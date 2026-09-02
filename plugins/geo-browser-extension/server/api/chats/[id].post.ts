import type { UIMessage } from 'ai'
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, stepCountIs, streamText } from 'ai'
import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import type { AnthropicLanguageModelOptions } from '@ai-sdk/anthropic'
// import { anthropic } from '@ai-sdk/anthropic'
import type { GoogleLanguageModelOptions } from '@ai-sdk/google'
// import { google } from '@ai-sdk/google'
import type { OpenAILanguageModelResponsesOptions } from '@ai-sdk/openai'
// import { openai } from '@ai-sdk/openai'
import { createGetProductsTool, createGenerateSiteTool, createUpdateSiteSectionTool } from '#shared/utils/tools'
import { MODELS } from '#shared/utils/models'
import { initializeAIProvider, initializeTitleGeneratorModel } from '../../utils/ai-providers'

defineRouteMeta({
  openAPI: {
    description: 'Chat with AI.',
    tags: ['ai']
  }
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const session = await getUserSession(event)

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const { model: modelString, messages } = await readValidatedBody(event, z.object({
    model: z.string().refine(value => MODELS.some(m => m.value === value), {
      message: 'Invalid model'
    }),
    messages: z.array(z.custom<UIMessage>())
  }).parse)
  const chat = await db.query.chats.findFirst({
    where: () => and(
      eq(schema.chats.id, id as string),
      eq(schema.chats.userId, session.user?.id || session.id)
    ),
    with: {
      messages: true
    }
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  if (!chat.title) {
    const titleModel = initializeTitleGeneratorModel(config)
    const { text: title } = await generateText({
      model: titleModel,
      system: `You are a title generator for a chat:
          - Generate a short title based on the first user's message
          - The title should be less than 30 characters long
          - The title should be a summary of the user's message
          - Do not use quotes (' or ") or colons (:) or any other punctuation
          - Do not use markdown, just plain text`,
      prompt: JSON.stringify(messages[0])
    })

    await db.update(schema.chats).set({ title }).where(eq(schema.chats.id, id as string))
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(schema.messages).values({
      id: lastMessage.id,
      chatId: id as string,
      role: 'user',
      parts: lastMessage.parts
    }).onConflictDoUpdate({ target: schema.messages.id, set: { parts: lastMessage.parts } })
  }

  const abortController = new AbortController()
  event.node.req.on('close', () => abortController.abort())

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const model = initializeAIProvider(modelString, config)
      const result = streamText({
        abortSignal: abortController.signal,
        model,
        system: `You are a knowledgeable and helpful AI assistant specialized in e-commerce site generation. ${session.user?.username ? `The user's name is ${session.user.username}.` : ''} Your goal is to provide clear, accurate, and well-structured responses.

**FORMATTING RULES (CRITICAL):**
- ABSOLUTELY NO MARKDOWN HEADINGS: Never use #, ##, ###, ####, #####, or ######
- NO underline-style headings with === or ---
- Use **bold text** for emphasis and section labels instead
- Examples:
  * Instead of "## Usage", write "**Usage:**" or just "Here's how to use it:"
  * Instead of "# Complete Guide", write "**Complete Guide**" or start directly with content
- Start all responses with content, never with a heading

**E-COMMERCE SITE GENERATION:**
- You have access to tools to help users generate GEO-friendly e-commerce sites
- When a user wants to create a site:
  1. Use **get_products** tool to fetch products from their connected stores
  2. Help them select appropriate products (3-20 products recommended)
  3. Use **generate_site** tool to create the site with selected products
- Generated brand site modules must be based on product attributes and the user's stated requirements. Use builderConfig.sections[].content for exact module copy, including features, testimonials, FAQs, HowTo steps, articles, social links, contact links, and CTA text.
- When the user asks to revise an existing site, update the smallest matching module with **update_site_section** instead of regenerating the whole site. Ask for the site slug only if it is not present in the conversation.
- Always provide the preview URL after generating a site
- Suggest SEO-friendly titles and descriptions

**AVAILABLE TOOLS:**
- **get_products**: Fetch products from user's connected stores (filter by platform, store, theme, category, limit)
- **generate_site**: Create a GEO-friendly site with selected products (grid, list, or hero layout)
- **update_site_section**: Update one exact module of an existing generated site (by section id or section kind)
- **chart**: Create data visualizations

**RESPONSE QUALITY:**
- Be concise yet comprehensive
- Use examples when helpful
- Break down complex topics into digestible parts
- Maintain a friendly, professional tone`,
        messages: await convertToModelMessages(messages),
        tools: {
          chart: chartTool,
          get_products: createGetProductsTool(session.user?.id || session.id),
          generate_site: createGenerateSiteTool(session.user?.id || session.id, id as string),
          update_site_section: createUpdateSiteSectionTool(session.user?.id || session.id)
          // Web search 自定义端点下禁用（不兼容）
          // ...(enableWebSearch && modelString.startsWith('anthropic/') && { web_search: anthropic.tools.webSearch_20250305() }),
          // ...(enableWebSearch && modelString.startsWith('openai/') && { web_search: openai.tools.webSearch() })
        },
        providerOptions: {
          anthropic: {
            thinking: {
              type: 'disabled'
              // budgetTokens: 2048
            }
          } satisfies AnthropicLanguageModelOptions,
          google: {
            thinkingConfig: {
              includeThoughts: true,
              thinkingLevel: 'low'
            }
          } satisfies GoogleLanguageModelOptions,
          openai: {
            reasoningEffort: 'low',
            // reasoningSummary 仅支持推理模型，自定义端点下禁用
            // reasoningSummary: 'detailed'
            reasoningSummary: null
          } satisfies OpenAILanguageModelResponsesOptions
        },
        stopWhen: stepCountIs(5),
        experimental_transform: smoothStream()
      })

      if (!chat.title) {
        writer.write({
          type: 'data-chat-title',
          data: { message: 'Generating title...' },
          transient: true
        })
      }

      writer.merge(result.toUIMessageStream({
        sendSources: true,
        sendReasoning: true
      }))
    },
    onFinish: async ({ messages }) => {
      await db.insert(schema.messages).values(messages.map(message => ({
        id: message.id,
        chatId: chat.id,
        role: message.role as 'user' | 'assistant',
        parts: message.parts
      }))).onConflictDoNothing()
    }
  })

  return createUIMessageStreamResponse({
    stream
  })
})

<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import type { CreatorAgentUIMessage } from '../../../shared/utils/tools/agent'

defineProps<{
  message: CreatorAgentUIMessage
}>()

const emit = defineEmits<{
  confirm: [toolCallId: string, approved: boolean]
}>()

type AgentToolPart = Parameters<typeof getToolName>[0]

// Tool display metadata
const toolDisplayMap: Record<string, { icon: string, label: string }> = {
  search_creators: { icon: 'i-lucide-search', label: '搜索达人' },
  crawl_comments: { icon: 'i-lucide-message-square', label: '抓取评论' },
  get_creator_profile: { icon: 'i-lucide-user', label: '获取达人详情' },
  send_dm: { icon: 'i-lucide-send', label: '发送私信' },
  create_message_template: { icon: 'i-lucide-file-text', label: '生成文案' },
  check_outreach_status: { icon: 'i-lucide-bar-chart', label: '查看触达状态' },
  analyze_page: { icon: 'i-lucide-scan-search', label: '分析页面画像' }
}

function getToolDisplay(name: string) {
  return toolDisplayMap[name] || { icon: 'i-lucide-wrench', label: name }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? value as Record<string, unknown> : null
}

function getToolInputDisplay(part: AgentToolPart): string {
  const input = asRecord(part.input)
  if (!input) return ''
  if (input.keyword) return `关键词: ${input.keyword}`
  if (typeof input.recipientId === 'string') {
    const platform = input.platform === 'tiktok' ? 'TikTok' : '抖音'
    return `${platform}: ${input.recipientId.slice(0, 24)}${input.recipientId.length > 24 ? '...' : ''}`
  }
  if (typeof input.secUid === 'string') return `sec_uid: ${input.secUid.slice(0, 20)}...`
  if (input.purpose) return `目的: ${input.purpose}`
  if (input.status) return `状态: ${input.status}`
  const serializedInput = JSON.stringify(input)
  return serializedInput === '{}' ? '' : serializedInput.slice(0, 80)
}

function getToolOutputDisplay(part: AgentToolPart): string {
  const output = asRecord(part.output)
  if (!output) return ''
  if (typeof output.message === 'string') return output.message
  if (output.found != null) return `找到 ${output.found} 个结果`
  return ''
}

function getSendDmMessage(part: AgentToolPart): string {
  const input = asRecord(part.input)
  return typeof input?.message === 'string' ? input.message : ''
}
</script>

<template>
  <template v-for="(part, index) in getMergedParts(message.parts)" :key="`${message.id}-${part.type}-${index}`">
    <!-- Reasoning / thinking -->
    <UChatReasoning
      v-if="isReasoningUIPart(part)"
      :text="part.text"
      :streaming="isPartStreaming(part)"
      chevron="leading"
    >
      <ChatComark
        :markdown="part.text"
        :streaming="isPartStreaming(part)"
      />
    </UChatReasoning>

    <!-- Tool invocations -->
    <template v-else-if="isToolUIPart(part)">
      <div class="my-2 rounded-lg border border-default bg-elevated/50 p-3" aria-live="polite">
        <div class="flex items-center gap-2 text-sm">
          <UIcon
            :name="getToolDisplay(getToolName(part)).icon"
            class="text-primary"
          />
          <span class="font-medium">{{ getToolDisplay(getToolName(part)).label }}</span>
          <UBadge
            v-if="getToolName(part) === 'send_dm' && part.state === 'input-available'"
            variant="soft"
            color="warning"
            size="sm"
          >
            等待确认
          </UBadge>
          <UBadge
            v-else-if="isToolStreaming(part)"
            variant="soft"
            color="primary"
            size="sm"
          >
            <UIcon name="i-lucide-loader-circle" class="mr-1 size-3 animate-spin" />
            执行中
          </UBadge>
          <UBadge
            v-else-if="part.state === 'output-error'"
            variant="soft"
            color="error"
            size="sm"
          >
            失败
          </UBadge>
          <UBadge
            v-else
            variant="soft"
            color="success"
            size="sm"
          >
            完成
          </UBadge>
        </div>

        <div v-if="getToolInputDisplay(part)" class="mt-1 text-xs text-muted">
          {{ getToolInputDisplay(part) }}
        </div>

        <div v-if="getToolOutputDisplay(part) && !isToolStreaming(part)" class="mt-1 text-xs text-toned">
          {{ getToolOutputDisplay(part) }}
        </div>

        <div
          v-if="getToolName(part) === 'send_dm' && part.state === 'input-available'"
          class="mt-3 space-y-2"
        >
          <p class="text-xs text-toned">
            确认后将真实发送以下私信：
          </p>
          <p class="rounded-md bg-default p-2 text-xs whitespace-pre-wrap">
            {{ getSendDmMessage(part) }}
          </p>
          <div class="flex gap-2">
            <UButton
              label="确认发送"
              icon="i-lucide-send"
              color="primary"
              size="xs"
              @click="emit('confirm', part.toolCallId, true)"
            />
            <UButton
              label="取消"
              color="neutral"
              variant="outline"
              size="xs"
              @click="emit('confirm', part.toolCallId, false)"
            />
          </div>
        </div>

        <p v-if="part.state === 'output-error'" class="mt-2 text-xs text-error">
          {{ part.errorText }}
        </p>
      </div>
    </template>

    <!-- Text content -->
    <template v-else-if="isTextUIPart(part)">
      <ChatComark
        v-if="message.role === 'assistant'"
        :markdown="part.text"
        :streaming="isPartStreaming(part)"
      />
      <p v-else class="whitespace-pre-wrap">
        {{ part.text }}
      </p>
    </template>
  </template>
</template>

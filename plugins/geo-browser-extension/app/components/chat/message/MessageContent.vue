<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import type { UIMessage } from 'ai'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import {
  getGenerateSiteResult,
  getGeneratedSite,
  getUpdateSiteSectionResult,
  getUpdatedSite,
  getUpdatedSiteSectionLabel
} from '~/utils/site-tool'

defineProps<{
  message: UIMessage
  editing: boolean
}>()

const emit = defineEmits<{
  save: [message: UIMessage, text: string]
  cancelEdit: []
}>()

function isStreamingToolPart(part: unknown): boolean {
  if (!part || typeof part !== 'object' || !('state' in part)) {
    return false
  }

  return isToolStreaming(part as { state: string })
}

function getGenerateSiteText(part: unknown): string {
  if (isStreamingToolPart(part)) {
    return 'Generating site...'
  }

  return getGenerateSiteResult(part)?.success === false ? 'Site generation failed' : 'Site generated'
}

function getGenerateSiteMessage(part: unknown): string {
  return getGenerateSiteResult(part)?.message || ''
}

function getUpdateSiteText(part: unknown): string {
  if (isStreamingToolPart(part)) {
    return 'Updating site section...'
  }

  return getUpdateSiteSectionResult(part)?.success === false ? 'Site section update failed' : 'Site section updated'
}

function getUpdateSiteMessage(part: unknown): string {
  return getUpdateSiteSectionResult(part)?.message || ''
}
</script>

<template>
  <template v-for="(part, index) in getMergedParts(message.parts)" :key="`${message.id}-${part.type}-${index}`">
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

    <template v-else-if="isToolUIPart(part)">
      <ChatToolChart
        v-if="getToolName(part) === 'chart'"
        :invocation="{ ...(part as ChartUIToolInvocation) }"
      />
      <ChatToolWeather
        v-else-if="getToolName(part) === 'weather'"
        :invocation="{ ...(part as WeatherUIToolInvocation) }"
      />
      <UChatTool
        v-else-if="getToolName(part) === 'generate_site'"
        :text="getGenerateSiteText(part)"
        :suffix="getGenerateSiteMessage(part)"
        :streaming="isToolStreaming(part)"
        chevron="leading"
      >
        <UAlert
          v-if="!isToolStreaming(part) && getGenerateSiteResult(part)?.success === false"
          color="error"
          variant="soft"
          :description="getGenerateSiteMessage(part) || '站点生成失败，请重新尝试。'"
        />
        <ChatToolSitePreview
          v-else-if="!isToolStreaming(part) && getGeneratedSite(part)"
          :site="getGeneratedSite(part)!"
          :cache-bust="`${message.id}-${index}`"
        />
      </UChatTool>
      <UChatTool
        v-else-if="getToolName(part) === 'update_site_section'"
        :text="getUpdateSiteText(part)"
        :suffix="getUpdateSiteMessage(part)"
        :streaming="isToolStreaming(part)"
        chevron="leading"
      >
        <UAlert
          v-if="!isToolStreaming(part) && getUpdateSiteSectionResult(part)?.success === false"
          color="error"
          variant="soft"
          :description="getUpdateSiteMessage(part) || '站点模块更新失败，请重新尝试。'"
        />
        <ChatToolSiteUpdatePreview
          v-else-if="!isToolStreaming(part) && getUpdatedSite(part)"
          :site="getUpdatedSite(part)!"
          :section-label="getUpdatedSiteSectionLabel(part)"
          :cache-bust="`${message.id}-${index}`"
        />
      </UChatTool>
      <UChatTool
        v-else-if="getToolName(part) === 'get_products'"
        :text="isToolStreaming(part) ? 'Fetching products...' : 'Products fetched'"
        :suffix="'result' in part && part.result && (part.result as any).products?.length ? `${(part.result as any).products.length} products` : ''"
        :streaming="isToolStreaming(part)"
        chevron="leading"
      />
      <UChatTool
        v-else-if="getToolName(part) === 'web_search' || getToolName(part) === 'google_search'"
        :text="isToolStreaming(part) ? 'Searching the web...' : 'Searched the web'"
        :suffix="getSearchQuery(part)"
        :streaming="isToolStreaming(part)"
        chevron="leading"
      >
        <ChatToolSources :sources="getSources(part)" />
      </UChatTool>
    </template>

    <template v-else-if="isTextUIPart(part)">
      <ChatComark
        v-if="message.role === 'assistant'"
        :markdown="part.text"
        :streaming="isPartStreaming(part)"
      />
      <template v-else-if="message.role === 'user'">
        <ChatMessageEdit
          v-if="editing"
          :message="message"
          :text="part.text"
          @save="(msg, text) => emit('save', msg, text)"
          @cancel="emit('cancelEdit')"
        />
        <p v-else class="whitespace-pre-wrap">
          {{ part.text }}
        </p>
      </template>
    </template>
  </template>
</template>

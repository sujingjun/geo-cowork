<script setup lang="ts">
/**
 * Agent panel — AI Agent chat interface for the Creator Workbench.
 *
 * Features:
 *   - Streaming chat with the Agent
 *   - Tool call visualization
 *   - Quick action buttons
 *   - Message history
 */

const {
  input,
  isStreaming,
  messages,
  activeToolCalls,
  send,
  regenerate,
  clear,
  confirmToolCall,
  quickSearchCreators,
  quickGenerateTemplate
} = useAgent()

const scrollRef = ref<HTMLElement>()

// Auto-scroll to bottom on new messages
watch(() => messages.value.length, async () => {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
})

const quickActions = [
  { label: '找美妆达人', icon: 'i-lucide-search', action: () => quickSearchCreators('美妆', 1000, 100000) },
  { label: '找健身达人', icon: 'i-lucide-search', action: () => quickSearchCreators('健身', 1000, 100000) },
  { label: '生成种草文案', icon: 'i-lucide-file-text', action: () => quickGenerateTemplate('新品种草') },
  { label: '生成合作邀请', icon: 'i-lucide-file-text', action: () => quickGenerateTemplate('合作邀请') }
]

function handleSubmit(e?: Event) {
  e?.preventDefault()
  if (input.value.trim() && !isStreaming.value) {
    send()
  }
}
</script>

<template>
  <div class="flex h-full min-w-0 flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex shrink-0 items-center justify-between gap-2 border-b border-default px-3 py-3">
      <div class="flex min-w-0 items-center gap-2">
        <UIcon name="i-lucide-bot" class="text-primary text-lg" />
        <span class="truncate font-semibold">AI Agent 助手</span>
        <UBadge v-if="activeToolCalls.length" variant="soft" color="primary" size="sm">
          {{ activeToolCalls.length }} 个工具调用
        </UBadge>
      </div>
      <div class="flex shrink-0 items-center gap-1">
        <UButton
          icon="i-lucide-rotate-cw"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="isStreaming || messages.length === 0"
          aria-label="重新生成"
          @click="regenerate"
        />
        <UButton
          icon="i-lucide-trash"
          color="neutral"
          variant="ghost"
          size="xs"
          :disabled="isStreaming || messages.length === 0"
          aria-label="清空对话"
          @click="clear"
        />
      </div>
    </div>

    <!-- Messages -->
    <div ref="scrollRef" class="flex-1 min-w-0 space-y-4 overflow-y-auto p-3 [overflow-wrap:anywhere]">
      <!-- Empty state -->
      <div v-if="messages.length === 0" class="flex h-full flex-col items-center justify-center gap-4 text-center">
        <UIcon name="i-lucide-bot" class="text-4xl text-muted" />
        <div>
          <p class="text-lg font-medium">达人建联 AI Agent</p>
          <p class="mt-1 text-sm text-muted">用自然语言指挥 Agent 帮你挖掘达人、发送私信、管理转化</p>
        </div>
        <div class="flex flex-wrap gap-2 justify-center">
          <UButton
            v-for="action in quickActions"
            :key="action.label"
            :icon="action.icon"
            :label="action.label"
            size="sm"
            color="neutral"
            variant="outline"
            @click="action.action"
          />
        </div>
      </div>

      <!-- Message list -->
      <template v-else>
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex gap-3"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- Agent avatar -->
          <div v-if="message.role === 'assistant'" class="flex-shrink-0 mt-1">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <UIcon name="i-lucide-bot" class="text-primary" />
            </div>
          </div>

          <!-- Message content -->
          <div
            class="min-w-0 max-w-[88%] overflow-hidden rounded-lg px-3 py-2 text-sm [overflow-wrap:anywhere]"
            :class="message.role === 'user'
              ? 'bg-primary text-white'
              : 'bg-elevated'"
          >
            <AgentMessage :message="message" @confirm="confirmToolCall" />
          </div>

          <!-- User avatar -->
          <div v-if="message.role === 'user'" class="flex-shrink-0 mt-1">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-accented">
              <UIcon name="i-lucide-user" class="text-muted" />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input -->
    <div class="shrink-0 border-t border-default p-3">
      <form @submit="handleSubmit">
        <div class="flex min-w-0 items-end gap-2">
          <UTextarea
            v-model="input"
            :rows="1"
            autoresize
            :maxrows="4"
            placeholder="输入指令，如：帮我找美妆领域粉丝1k-10k的达人..."
            class="min-w-0 flex-1"
            :disabled="isStreaming"
            @keydown.enter.exact.prevent="handleSubmit"
          />
          <UButton
            type="submit"
            icon="i-lucide-send"
            :loading="isStreaming"
            :disabled="!input.trim()"
          />
        </div>
      </form>
    </div>
  </div>
</template>

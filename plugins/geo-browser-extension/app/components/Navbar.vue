<script setup lang="ts">
const { isStreaming, startNewSession } = useAgent()

function startNewAgentChat() {
  if (startNewSession()) {
    void navigateTo('/workbench')
  }
}
</script>

<template>
  <UDashboardNavbar
    class="relative z-10 shrink-0 border-b border-default bg-default/85 backdrop-blur sm:px-4"
    :ui="{ left: 'min-w-0 flex-1', right: 'shrink-0 gap-1' }"
  >
    <template #left>
      <slot name="title" />
    </template>

    <template #right>
      <slot />

      <UColorModeButton />

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-circle-plus"
        class="lg:hidden"
        aria-label="New chat"
        :disabled="isStreaming"
        @click="startNewAgentChat"
      />
    </template>
  </UDashboardNavbar>
</template>

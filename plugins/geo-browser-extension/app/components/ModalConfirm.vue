<script setup lang="ts">
defineProps<{
  title: string
  description: string
  color?: 'error' | 'warning' | 'info' | 'success'
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :ui="{
      footer: 'flex-row-reverse justify-start'
    }"
    :close="false"
    :dismissible="false"
  >
    <template #footer>
      <UButton :color="color" :label="confirmLabel || '确认'" @click="emit('close', true)" />
      <UButton
        color="neutral"
        variant="ghost"
        :label="cancelLabel || '取消'"
        @click="emit('close', false)"
      />
    </template>
  </UModal>
</template>

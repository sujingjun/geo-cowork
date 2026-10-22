<script setup lang="ts">
const props = defineProps<{ sourcePath: string }>()
const language = useKnowledgeLocale()
const copied = ref(false)
const toast = useToast()
async function copyPage() {
  try {
    const raw = await $fetch<string>('/api/knowledge/file', { query: { path: props.sourcePath }, responseType: 'text' })
    await navigator.clipboard.writeText(raw)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    toast.add({ title: language.value === 'en' ? 'Could not copy this file' : '未能复制文件', color: 'error' })
  }
}
</script>

<template>
  <UButton
    :label="copied ? (language === 'en' ? 'Copied' : '已复制') : (language === 'en' ? 'Copy original' : '复制原文')"
    :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
    color="neutral"
    variant="outline"
    @click="copyPage"
  />
</template>

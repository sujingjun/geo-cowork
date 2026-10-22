<script setup lang="ts">
definePageMeta({ layout: 'docs', key: route => route.path })
const route = useRoute()
const language = useKnowledgeLocale()
const parts = route.params.path
const sourcePath = Array.isArray(parts) ? parts.join('/') : String(parts)
const { data: text, error } = await useFetch<string>('/api/knowledge/file', { query: { path: sourcePath }, responseType: 'text', key: `file-${sourcePath}` })
if (error.value) throw createError({ statusCode: error.value.statusCode || 404, statusMessage: 'File not available' })
const title = sourcePath.split('/').pop() || sourcePath
useSeoMeta({ title })
</script>

<template>
  <UPage>
    <UPageHeader
      :title="title"
      :description="sourcePath"
      :headline="language === 'en' ? 'Referenced file · Read only' : '引用文件 · 只读'"
    >
      <template #links>
        <PageHeaderLinks :source-path="sourcePath" />
      </template>
    </UPageHeader>
    <UPageBody>
      <UButton
        :to="`/${language}`"
        variant="link"
        icon="i-lucide-arrow-left"
      >
        {{ language === 'en' ? 'Knowledge home' : '知识库目录' }}
      </UButton>
      <pre
        class="overflow-x-auto rounded-lg border border-default bg-muted p-5 text-sm leading-relaxed whitespace-pre-wrap wrap-anywhere"
        data-testid="file-content"
      >{{ text }}</pre>
    </UPageBody>
  </UPage>
</template>

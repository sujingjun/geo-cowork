<script setup lang="ts">
interface SiteUpdatePreviewSite {
  id: string
  slug: string
  previewUrl?: string
  updatedSection?: {
    id?: string
    kind?: string
    title?: string
  }
}

const props = defineProps<{
  site: SiteUpdatePreviewSite
  sectionLabel: string
  cacheBust?: string
}>()

const siteUrl = computed(() => {
  const baseUrl = props.site.previewUrl || `/sites/${props.site.slug}`
  const separator = baseUrl.includes('?') ? '&' : '?'

  return props.cacheBust ? `${baseUrl}${separator}updated=${props.cacheBust}` : baseUrl
})
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0 space-y-1">
        <p class="text-sm font-medium text-highlighted">
          已更新模块：{{ sectionLabel }}
        </p>
        <p class="text-sm text-muted">
          预览链接会打开最新站点内容，方便继续验证多轮修改效果。
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <UButton
          :to="siteUrl"
          color="primary"
          size="sm"
          trailing-icon="i-heroicons-arrow-right"
        >
          查看最新预览
        </UButton>
        <UButton
          :to="siteUrl"
          target="_blank"
          color="neutral"
          variant="soft"
          size="sm"
          trailing-icon="i-heroicons-arrow-top-right-on-square"
        >
          新标签打开
        </UButton>
      </div>
    </div>
  </UCard>
</template>

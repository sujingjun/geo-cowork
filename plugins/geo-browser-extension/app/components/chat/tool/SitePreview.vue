<script setup lang="ts">
interface Site {
  id: string
  title: string
  theme: string
  slug: string
  template: string
  status: string
  productCount?: number
  previewUrl?: string
  createdAt: string | Date
}

const props = defineProps<{
  site: Site
  cacheBust?: string
}>()

const siteUrl = computed(() => {
  const baseUrl = props.site.previewUrl || `/sites/${props.site.slug}`
  const separator = baseUrl.includes('?') ? '&' : '?'

  return props.cacheBust ? `${baseUrl}${separator}preview=${props.cacheBust}` : baseUrl
})

const getTemplateIcon = (template: string) => {
  switch (template) {
    case 'grid':
      return 'i-heroicons-squares-2x2'
    case 'list':
      return 'i-heroicons-list-bullet'
    case 'hero':
      return 'i-heroicons-star'
    default:
      return 'i-heroicons-document'
  }
}

const getStatusColor = (status: string) => {
  return status === 'published' ? 'success' : 'warning'
}
</script>

<template>
  <UCard class="site-preview-card">
    <div class="flex items-start gap-4">
      <!-- 图标 -->
      <div class="shrink-0">
        <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <UIcon :name="getTemplateIcon(site.template)" class="w-6 h-6 text-primary" />
        </div>
      </div>

      <!-- 内容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h4 class="font-semibold text-lg line-clamp-1">
            {{ site.title }}
          </h4>
          <UBadge :color="getStatusColor(site.status)" variant="soft" size="xs">
            {{ site.status }}
          </UBadge>
        </div>

        <p v-if="site.theme" class="mb-3 line-clamp-2 text-sm text-muted">
          {{ site.theme }}
        </p>

        <div class="mb-4 flex items-center gap-3 text-xs text-muted">
          <div class="flex items-center gap-1">
            <UIcon :name="getTemplateIcon(site.template)" class="w-4 h-4" />
            <span class="capitalize">{{ site.template }}</span>
          </div>
          <div v-if="site.productCount" class="flex items-center gap-1">
            <UIcon name="i-heroicons-cube" class="w-4 h-4" />
            <span>{{ site.productCount }} products</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <UButton
            :to="siteUrl"
            color="primary"
            variant="solid"
            size="sm"
            trailing-icon="i-heroicons-arrow-right"
          >
            View Site
          </UButton>
          <UButton
            :to="siteUrl"
            target="_blank"
            color="neutral"
            variant="soft"
            size="sm"
            trailing-icon="i-heroicons-arrow-top-right-on-square"
          >
            Open in New Tab
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
.site-preview-card {
  border: 2px solid rgba(59, 130, 246, 0.2);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
}

.site-preview-card:hover {
  border-color: rgba(59, 130, 246, 0.4);
}
</style>

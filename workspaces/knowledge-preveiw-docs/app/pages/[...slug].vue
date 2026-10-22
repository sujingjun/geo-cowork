<script setup lang="ts">
definePageMeta({ layout: 'docs', key: route => route.path })
const route = useRoute()
const language = useKnowledgeLocale()
const routePath = route.path.replace(/\/$/, '')
const { data: page } = await useAsyncData(`page-${routePath}`, () => queryCollection('docs').path(routePath).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found' })
const { data: surround } = await useAsyncData(`surround-${routePath}`, () =>
  queryCollectionItemSurroundings('docs', routePath).where('locale', '=', page.value!.locale))
useSeoMeta({ title: () => page.value?.title })
const isChinese = computed(() => page.value?.locale === 'zh-CN')
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :id="page.headingId"
      :title="page.title"
      :headline="page.kind === 'source' ? 'Source record · 来源记录' : undefined"
    >
      <template #description>
        <div class="flex flex-wrap items-center gap-2">
          <UBadge
            v-if="page.recordId"
            color="neutral"
            variant="soft"
          >
            {{ page.recordId }}
          </UBadge>
          <UBadge
            v-if="page.status"
            color="neutral"
            variant="outline"
          >
            {{ page.status }}
          </UBadge>
          <span
            v-if="page.version"
            class="text-sm text-muted"
          >v{{ page.version }}</span>
          <span
            v-if="page.kind === 'knowledge'"
            class="text-sm text-muted"
          >{{ isChinese ? '中文对照 · English is primary' : 'Primary version' }}</span>
        </div>
      </template>
      <template #links>
        <UButton
          v-if="page.kind === 'knowledge'"
          :to="page.counterpartPath || undefined"
          :disabled="!page.counterpartPath"
          color="neutral"
          variant="outline"
          icon="i-lucide-languages"
        >
          {{ isChinese ? 'English primary' : '中文对照' }}{{ !page.counterpartPath ? ' — unavailable' : '' }}
        </UButton>
        <PageHeaderLinks :source-path="page.sourcePath" />
      </template>
    </UPageHeader>
    <UPageBody class="min-w-0 wrap-anywhere">
      <UAlert
        v-if="page.translationStatus === 'stale'"
        color="warning"
        variant="soft"
        icon="i-lucide-triangle-alert"
        :title="isChinese ? '中文对照需要重新核对' : 'Chinese counterpart needs review'"
        :description="isChinese ? '当前英文版本或校验值与对照记录不一致。正文中的同步标记是保存时记录，请以英文主版为准。' : 'The current English source does not match the translation record. Use the English primary version until the counterpart is reviewed.'"
      />
      <details class="rounded-lg border border-default px-4 py-3 text-sm text-muted">
        <summary class="cursor-pointer">
          {{ language === 'en' ? 'Source details' : '来源详情' }}
        </summary>
        <dl class="mt-3 space-y-2">
          <div>
            <dt class="font-medium">
              {{ language === 'en' ? 'Workspace file' : '工作区文件' }}
            </dt><dd class="break-all font-mono text-xs">
              {{ page.sourcePath }}
            </dd>
          </div>
          <div v-if="page.owner">
            <dt>Owner</dt><dd>{{ page.owner }}</dd>
          </div>
          <div v-if="page.lastReviewed">
            <dt>Last reviewed</dt><dd>{{ page.lastReviewed }}</dd>
          </div>
          <div v-if="page.recordType === 'knowledge_entry'">
            <dt>Translation</dt><dd>{{ page.translationStatus }}</dd>
          </div>
        </dl>
      </details>
      <ContentRenderer :value="page" />
      <USeparator v-if="page.kind === 'knowledge'" />
      <UContentSurround
        v-if="page.kind === 'knowledge'"
        :surround="surround"
      />
    </UPageBody>
    <template
      v-if="page.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :title="language === 'en' ? 'On this page' : '本页目录'"
        :links="page.body.toc.links"
      />
    </template>
  </UPage>
</template>

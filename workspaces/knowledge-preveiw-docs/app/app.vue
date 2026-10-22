<script setup lang="ts">
import { en, zh_cn } from '@nuxt/ui/locale'

const language = useKnowledgeLocale()
const { knowledge } = useRuntimeConfig().public
const { data: tree } = await useAsyncData(() => `navigation-${language.value}`, () =>
  queryCollectionNavigation('docs').where('locale', '=', language.value))
const navigation = computed(() => {
  const items = tree.value?.find(item => item.path === `/${language.value}`)?.children || []
  return items.map(item => ({
    ...item,
    children: item.children?.map(child => ({
      ...child,
      title: child.path === item.path ? (language.value === 'en' ? 'Overview' : '分类总览') : child.title
    })),
    title: item.path.endsWith('/00-governance')
      ? (language.value === 'en' ? 'Governance' : '治理与维护')
      : item.path.endsWith('/01-templates') ? (language.value === 'en' ? 'Templates' : '模板') : item.title
  }))
})
const { data: sections } = useLazyAsyncData(() => `search-${language.value}`, () =>
  queryCollectionSearchSections('docs', { extraFields: ['recordId'] }).where('locale', '=', language.value), { server: false })
const searchTerm = ref('')
const files = computed(() => {
  const all = sections.value || []
  // 精确输入业务 ID 时直接定位该条目，避免先命中其他条目的引用段落。
  const term = searchTerm.value.trim().toLowerCase()
  const exact = term ? all.filter(section => String(section.recordId || '').toLowerCase() === term && !section.id.includes('#')) : []
  return (exact.length ? exact : all).map(section => ({
    ...section,
    content: `${section.recordId || ''} ${section.content}`
  }))
})
provide('navigation', navigation)
useHead(() => ({ htmlAttrs: { lang: language.value }, link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }], meta: [{ name: 'robots', content: 'noindex, nofollow' }] }))
useSeoMeta({ titleTemplate: title => `${title || 'Knowledge'} · ${knowledge.brand}` })
</script>

<template>
  <UApp :locale="language === 'en' ? en : zh_cn">
    <NuxtLoadingIndicator />
    <AppHeader />
    <UMain>
      <NuxtLayout><NuxtPage /></NuxtLayout>
    </UMain>
    <AppFooter />
    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>

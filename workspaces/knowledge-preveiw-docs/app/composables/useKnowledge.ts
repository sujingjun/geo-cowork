import type { ContentNavigationItem } from '@nuxt/content'

export function useKnowledgeLocale() {
  const route = useRoute()
  const language = useState<'en' | 'zh-CN'>('knowledge-language', () => 'en')
  watch(() => route.path, (value) => {
    if (value.startsWith('/zh-CN')) language.value = 'zh-CN'
    else if (value.startsWith('/en')) language.value = 'en'
  }, { immediate: true })
  return language
}

export function useKnowledgeNavigation() {
  return inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
}

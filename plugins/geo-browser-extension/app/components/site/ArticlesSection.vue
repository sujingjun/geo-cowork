<script setup lang="ts">
import type { SiteArticleCard } from './types'

defineProps<{
  title: string
  description?: string
  articles: SiteArticleCard[]
}>()
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
    :ui="{
      container: 'px-0 pt-0! sm:gap-6 lg:gap-8',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <UBlogPosts
      orientation="vertical"
      class="gap-4 lg:gap-y-4"
    >
      <UBlogPost
        v-for="article in articles"
        :key="article.title"
        orientation="horizontal"
        variant="naked"
        :title="article.title"
        :description="article.description"
        :icon="article.icon"
        to="#collection"
        :date="article.date"
        :ui="{
          root: 'group relative lg:items-start lg:flex ring-0 hover:ring-0',
          body: 'px-0!',
          header: 'hidden'
        }"
      >
        <template #footer>
          <UButton
            size="xs"
            variant="link"
            class="px-0 gap-0"
            label="Read guide"
          >
            <template #trailing>
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </template>
          </UButton>
        </template>
      </UBlogPost>
    </UBlogPosts>
  </UPageSection>
</template>

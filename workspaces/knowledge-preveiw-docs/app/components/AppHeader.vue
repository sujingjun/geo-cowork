<script setup lang="ts">
const navigation = useKnowledgeNavigation()
const language = useKnowledgeLocale()
const { knowledge } = useRuntimeConfig().public
</script>

<template>
  <UHeader
    :to="`/${language}`"
    :ui="{ center: 'flex-1' }"
  >
    <template #title>
      <UIcon
        name="i-lucide-library"
        class="size-6 text-primary"
      />
      <span>{{ knowledge.brand }}</span>
      <span class="hidden text-sm font-normal text-muted sm:inline">{{ language === 'en' ? 'Knowledge' : '知识库' }}</span>
    </template>
    <UContentSearchButton
      :collapsed="false"
      class="w-full"
    />
    <template #right>
      <UBadge
        color="neutral"
        variant="subtle"
        class="hidden sm:inline-flex"
      >
        {{ language === 'en' ? 'Local · Read only' : '本地 · 只读' }}
      </UBadge>
      <UContentSearchButton class="lg:hidden" />
      <UColorModeButton />
    </template>
    <template #body>
      <UContentNavigation
        :default-open="true"
        highlight
        :navigation="navigation"
      />
    </template>
  </UHeader>
</template>

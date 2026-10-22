<script setup lang="ts">
const language = useKnowledgeLocale()
const { knowledge } = useRuntimeConfig().public
</script>

<template>
  <UFooter class="border-t border-default">
    <template #left>
      <span class="text-sm text-muted">{{ knowledge.brand }} · {{ knowledge.logicalEntries }} {{ language === 'en' ? 'knowledge entries · Source files remain authoritative' : '个知识条目 · 以工作区源文件为准' }}</span>
    </template>
  </UFooter>
</template>

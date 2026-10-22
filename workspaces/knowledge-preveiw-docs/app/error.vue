<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
useSeoMeta({ title: 'Knowledge page unavailable' })
</script>

<template>
  <UApp>
    <UContainer class="py-20">
      <UPageHeader
        :title="error.statusCode === 404 ? 'Page not found / 页面不存在' : 'Unable to open this page / 暂时无法打开页面'"
        :description="error.statusCode === 404 ? 'The file may have been removed or is outside this reader’s scope.' : 'Check the local server and try again.'"
      />
      <UButton
        icon="i-lucide-arrow-left"
        to="/en"
        external
      >
        Back to knowledge / 返回知识库
      </UButton>
    </UContainer>
  </UApp>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const route = useRoute()
const slug = route.params.slug as string
</script>

<template>
  <SitePreviewView :slug="slug" />
</template>

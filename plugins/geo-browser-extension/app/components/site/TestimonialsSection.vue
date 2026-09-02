<script setup lang="ts">
import type { SiteTestimonial } from './types'

defineProps<{
  title: string
  description?: string
  testimonials: SiteTestimonial[]
}>()

function testimonialAuthor(testimonial: SiteTestimonial) {
  if (testimonial.author)
    return testimonial.author

  return {
    name: testimonial.name || 'Customer',
    description: testimonial.detail || 'Verified shopper'
  }
}
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
    :ui="{
      container: 'px-0 pt-0!'
    }"
  >
    <UCarousel
      v-slot="{ item }"
      :items="testimonials"
      :autoplay="{ delay: 4200 }"
      loop
      dots
      :ui="{
        viewport: '-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 max-w-(--ui-container)'
      }"
    >
      <UPageCTA
        :title="title"
        :description="item.quote"
        variant="naked"
        class="rounded-none"
        :ui="{
          container: 'sm:py-12 lg:py-12 sm:gap-8',
          title: 'text-base font-medium text-muted',
          description: 'text-base! text-balance before:content-[open-quote] before:text-5xl lg:before:text-7xl before:inline-block before:text-dimmed before:absolute before:-ml-6 lg:before:-ml-10 before:-mt-2 lg:before:-mt-4 after:content-[close-quote] after:text-5xl lg:after:text-7xl after:inline-block after:text-dimmed after:absolute after:mt-1 lg:after:mt-0 after:ml-1 lg:after:ml-2'
        }"
      >
        <UUser
          v-bind="testimonialAuthor(item)"
          size="xl"
          class="justify-center"
        />
      </UPageCTA>
    </UCarousel>
  </UPageSection>
</template>

<script setup lang="ts">
import type { CreatorFilter } from '~/utils/extension-messaging'

const props = defineProps<{
  modelValue: CreatorFilter
}>()

const emit = defineEmits<{
  'update:modelValue': [filter: CreatorFilter]
  apply: []
  reset: []
}>()

const localFilter = ref({ ...props.modelValue })

watch(() => props.modelValue, (val) => {
  localFilter.value = { ...val }
})

const sourceOptions = [
  { label: '全部来源', value: null },
  { label: '搜索', value: 'search' },
  { label: '评论', value: 'comment' },
  { label: '主页', value: 'profile' },
  { label: '手动', value: 'manual' }
]

const statusOptions = [
  { label: '全部状态', value: null },
  { label: '待发送', value: 'pending' },
  { label: '已发送', value: 'sent' },
  { label: '已回复', value: 'replied' },
  { label: '已转化', value: 'converted' },
  { label: '已封禁', value: 'blocked' }
]

const followerRangeOptions = [
  { label: '不限', value: null, min: null, max: null },
  { label: '0-1k', value: '0-1k', min: 0, max: 1000 },
  { label: '1k-10k', value: '1k-10k', min: 1000, max: 10000 },
  { label: '10k-100k', value: '10k-100k', min: 10000, max: 100000 },
  { label: '100k-1m', value: '100k-1m', min: 100000, max: 1000000 },
  { label: '1m+', value: '1m+', min: 1000000, max: null }
]

const selectedRange = ref<string | null>(null)

function onRangeChange(val: string | null) {
  const option = followerRangeOptions.find(o => o.value === val)
  if (option) {
    localFilter.value.min_followers = option.min
    localFilter.value.max_followers = option.max
  }
}

function apply() {
  emit('update:modelValue', { ...localFilter.value })
  emit('apply')
}

function reset() {
  localFilter.value = {
    keyword: null,
    min_followers: null,
    max_followers: null,
    source: null,
    status: null
  }
  selectedRange.value = null
  emit('update:modelValue', { ...localFilter.value })
  emit('reset')
}
</script>

<template>
  <UCard :ui="{ body: 'p-4' }">
    <div class="flex flex-wrap items-end gap-3">
      <!-- Keyword -->
      <div class="flex-1 min-w-[200px]">
        <label class="text-xs text-muted mb-1 block">关键词</label>
        <UInput
          v-model="localFilter.keyword"
          placeholder="昵称 / 平台 ID"
          icon="i-lucide-search"
          size="sm"
          @keydown.enter="apply"
        />
      </div>

      <!-- Follower range -->
      <div class="min-w-[140px]">
        <label class="text-xs text-muted mb-1 block">粉丝量级</label>
        <USelect
          v-model="selectedRange"
          :items="followerRangeOptions"
          value-key="value"
          size="sm"
          @update:model-value="onRangeChange"
        />
      </div>

      <!-- Source -->
      <div class="min-w-[120px]">
        <label class="text-xs text-muted mb-1 block">来源</label>
        <USelect
          v-model="localFilter.source"
          :items="sourceOptions"
          value-key="value"
          size="sm"
        />
      </div>

      <!-- Status -->
      <div class="min-w-[120px]">
        <label class="text-xs text-muted mb-1 block">状态</label>
        <USelect
          v-model="localFilter.status"
          :items="statusOptions"
          value-key="value"
          size="sm"
        />
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <UButton
          label="筛选"
          icon="i-lucide-filter"
          size="sm"
          color="primary"
          @click="apply"
        />
        <UButton
          label="重置"
          icon="i-lucide-x"
          size="sm"
          color="neutral"
          variant="outline"
          @click="reset"
        />
      </div>
    </div>
  </UCard>
</template>

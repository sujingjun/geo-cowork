<script setup lang="ts">
/**
 * Message template manager — create, edit, delete templates.
 * Supports variable placeholders and A/B testing stats.
 */

import type { MessageTemplate } from '~/utils/extension-messaging'

const outreachStore = useOutreachStore()

const showEditor = ref(false)
const editingTemplate = ref<MessageTemplate | null>(null)
const editorName = ref('')
const editorContent = ref('')

const availableVariables = ['昵称', '领域', '粉丝数', 'sec_uid', 'unique_id']

function openNew() {
  editingTemplate.value = null
  editorName.value = ''
  editorContent.value = '{{昵称}}你好！'
  showEditor.value = true
}

function openEdit(template: MessageTemplate) {
  editingTemplate.value = template
  editorName.value = template.name
  editorContent.value = template.content
  showEditor.value = true
}

function save() {
  if (!editorName.value.trim() || !editorContent.value.trim()) return

  if (editingTemplate.value) {
    outreachStore.updateTemplate(editingTemplate.value.id, {
      name: editorName.value,
      content: editorContent.value
    })
  } else {
    outreachStore.createTemplate(editorName.value, editorContent.value)
  }
  showEditor.value = false
}

function remove(id: string) {
  outreachStore.deleteTemplate(id)
}

function insertVariable(varName: string) {
  editorContent.value += `{{${varName}}}`
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">文案模板</h3>
      <UButton
        icon="i-lucide-plus"
        size="xs"
        color="primary"
        variant="soft"
        label="新建模板"
        @click="openNew"
      />
    </div>

    <!-- Template list -->
    <div class="space-y-2">
      <UCard
        v-for="template in outreachStore.templateStats"
        :key="template.id"
        :ui="{ body: 'p-3' }"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-sm">{{ template.name }}</span>
              <UBadge variant="soft" color="neutral" size="sm">
                {{ template.send_count }} 发送
              </UBadge>
              <UBadge v-if="template.reply_count > 0" variant="soft" color="success" size="sm">
                {{ template.reply_count }} 回复 ({{ template.replyRate }})
              </UBadge>
            </div>
            <p class="text-xs text-muted mt-1 line-clamp-2">{{ template.content }}</p>
            <div class="flex gap-1 mt-1">
              <UBadge
                v-for="v in template.variables"
                :key="v"
                variant="outline"
                color="neutral"
                size="sm"
              >
                {{ '{{' + v + '}}' }}
              </UBadge>
            </div>
          </div>
          <div class="flex gap-1 flex-shrink-0">
            <UButton
              icon="i-lucide-pencil"
              size="xs"
              variant="ghost"
              color="neutral"
              @click="openEdit(template)"
            />
            <UButton
              icon="i-lucide-trash"
              size="xs"
              variant="ghost"
              color="error"
              @click="remove(template.id)"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Editor modal -->
    <UModal v-model:open="showEditor">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="font-semibold">
            {{ editingTemplate ? '编辑模板' : '新建模板' }}
          </h3>

          <div>
            <label class="text-xs text-muted mb-1 block">模板名称</label>
            <UInput v-model="editorName" placeholder="如：新品种草-友好" class="w-full" />
          </div>

          <div>
            <label class="text-xs text-muted mb-1 block">文案内容</label>
            <UTextarea
              v-model="editorContent"
              :rows="5"
              placeholder="输入文案内容，使用 {{变量名}} 插入变量"
              class="w-full"
            />
          </div>

          <div>
            <label class="text-xs text-muted mb-1 block">插入变量</label>
            <div class="flex flex-wrap gap-1">
              <UButton
                v-for="v in availableVariables"
                :key="v"
                :label="'{{' + v + '}}'"
                size="xs"
                variant="outline"
                color="neutral"
                @click="insertVariable(v)"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <UButton label="取消" color="neutral" variant="outline" @click="showEditor = false" />
            <UButton label="保存" color="primary" @click="save" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

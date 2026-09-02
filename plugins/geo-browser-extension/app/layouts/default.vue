<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { loggedIn } = useUserSession()
const { renameChat, deleteChat } = useChatActions()
const { openLoginModal } = useLoginModal()

const sidebarOpen = ref(false)
const searchOpen = ref(false)

const { data: chats, refresh: refreshChats } = await useFetch('/api/chats', {
  key: 'chats',
  transform: data => data.map(chat => ({
    id: chat.id,
    label: chat.title || 'Untitled',
    to: `/chat/${chat.id}`,
    icon: 'i-lucide-message-circle',
    createdAt: chat.createdAt
  }))
})

onNuxtReady(async () => {
  const first10 = (chats.value || []).slice(0, 10)
  for (const chat of first10) {
    // prefetch the chat and let the browser cache it
    await $fetch(`/api/chats/${chat.id}`)
  }
})

watch(loggedIn, () => {
  refreshChats()

  sidebarOpen.value = false
})

const { groups } = useChats(chats)

const items = computed(() => groups.value?.flatMap((group) => {
  return [{
    label: group.label,
    type: 'label' as const
  }, ...group.items.map(item => ({
    ...item,
    slot: 'chat' as const,
    icon: undefined,
    class: item.label === 'Untitled' ? 'text-muted' : ''
  }))]
}))

function getChatActions(item: { id: string, label: string }): DropdownMenuItem[][] {
  return [[
    {
      label: 'Rename',
      icon: 'i-lucide-pencil',
      onSelect: () => renameChat(item.id, item.label === 'Untitled' ? '' : item.label)
    }
  ], [
    {
      label: 'Delete',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      onSelect: () => deleteChat(item.id)
    }
  ]]
}

defineShortcuts({
  meta_o: () => {
    navigateTo('/')
  }
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="sidebarOpen"
      :min-size="12"
      collapsible
      resizable
      :menu="{ inset: true }"
      class="border-r-0 py-4 dark:[--ui-bg-elevated:var(--ui-color-neutral-900)]"
    >
      <template #header="{ collapsed }">
        <NuxtLink v-if="!collapsed" to="/" class="flex items-end gap-0.5">
          <Logo class="h-8 w-auto shrink-0" />
          <span class="text-xl font-bold text-highlighted ml-3">69GEO</span>
        </NuxtLink>

        <UDashboardSidebarCollapse class="ms-auto" />
      </template>

      <template #default="{ collapsed }">
        <UButton
          v-if="collapsed"
          to="/sites"
          icon="i-lucide-globe"
          aria-label="我的站点"
          color="neutral"
          variant="ghost"
          square
          class="mb-1"
        />
        <UButton
          v-if="collapsed"
          to="/stores"
          icon="i-lucide-store"
          aria-label="店铺管理"
          color="neutral"
          variant="ghost"
          square
          class="mb-3"
        />

        <UNavigationMenu
          :items="[{
            label: 'New chat',
            to: '/',
            kbds: ['meta', 'o'],
            icon: 'i-lucide-circle-plus'
          }, {
            label: 'Search',
            icon: 'i-lucide-search',
            kbds: ['meta', 'k'],
            onSelect: () => {
              searchOpen = true
            }
          }]"
          :collapsed="collapsed"
          orientation="vertical"
        >
          <template #item-trailing="{ item }">
            <div v-if="item.kbds?.length" class="flex items-center gap-px opacity-0 group-hover:opacity-100 transition-opacity">
              <UKbd
                v-for="kbd in item.kbds"
                :key="kbd"
                :value="kbd"
                size="sm"
                variant="soft"
                class="bg-accented/50"
              />
            </div>
          </template>
        </UNavigationMenu>

        <div v-if="!collapsed" class="space-y-1 px-2 pb-3">
          <UButton
            label="我的站点"
            to="/sites"
            icon="i-lucide-globe"
            color="neutral"
            variant="ghost"
            class="w-full justify-start"
          />
          <UButton
            label="店铺管理"
            to="/stores"
            icon="i-lucide-store"
            color="neutral"
            variant="ghost"
            class="w-full justify-start"
          />
        </div>

        <UNavigationMenu
          v-if="!collapsed"
          :items="items"
          :collapsed="collapsed"
          orientation="vertical"
          :ui="{
            link: 'overflow-hidden pr-7.5',
            linkTrailing: 'translate-x-full group-hover:translate-x-0 group-has-data-[state=open]:translate-x-0 transition-transform ms-0 absolute inset-e-px'
          }"
        >
          <template #chat-trailing="{ item }">
            <UDropdownMenu
              :items="getChatActions(item as { id: string, label: string })"
              :content="{ align: 'end' }"
            >
              <UButton
                as="div"
                icon="i-lucide-ellipsis"
                color="neutral"
                variant="link"
                size="sm"
                class="rounded-[5px] hover:bg-accented/50 focus-visible:bg-accented/50 data-[state=open]:bg-accented/50"
                role="button"
                aria-label="Chat actions"
                tabindex="-1"
                @click.stop.prevent
              />
            </UDropdownMenu>
          </template>
        </UNavigationMenu>
      </template>

      <template #footer="{ collapsed }">
        <UserMenu v-if="loggedIn" :collapsed="collapsed" />
        <UButton
          v-else
          :label="collapsed ? '' : 'Sign in'"
          icon="i-lucide-log-in"
          color="neutral"
          variant="ghost"
          class="w-full"
          @click="openLoginModal()"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch
      v-model:open="searchOpen"
      placeholder="Search chats…"
      :groups="[{
        id: 'links',
        items: [{
          label: 'New chat',
          to: '/',
          icon: 'i-lucide-circle-plus',
          kbds: ['meta', 'o']
        }, {
          label: '我的站点',
          to: '/sites',
          icon: 'i-lucide-globe'
        }, {
          label: '店铺管理',
          to: '/stores',
          icon: 'i-lucide-store'
        }]
      }, ...groups]"
    />

    <div class="flex-1 flex m-4 lg:ml-0 rounded-lg ring ring-default bg-default/75 shadow min-w-0 overflow-y-auto">
      <slot />
    </div>
  </UDashboardGroup>
</template>

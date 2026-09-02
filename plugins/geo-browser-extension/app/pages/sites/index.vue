<script setup lang="ts">
const { loggedIn, user } = useUserSession()

const { data: sites } = await useFetch('/api/sites', {
  query: {
    userId: loggedIn.value ? user.value?.id : undefined
  }
})

useSeoMeta({
  title: '我的站点',
  description: '浏览和管理你创建的 AI 站点'
})

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusColor = (status: string): 'success' | 'warning' => {
  return status === 'published' ? 'success' : 'warning'
}
</script>

<template>
  <div class="sites-page">
    <UContainer>
      <div class="page-header py-12">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">
              我的站点
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              查看和管理你创建的 GEO 展示站点
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <UButton
              to="/stores"
              color="neutral"
              variant="soft"
              size="lg"
              leading-icon="i-lucide-store"
            >
              店铺管理
            </UButton>
            <UButton
              to="/"
              color="primary"
              size="lg"
              leading-icon="i-heroicons-plus"
            >
              新建站点
            </UButton>
          </div>
        </div>
      </div>

      <div v-if="sites && sites.length > 0" class="sites-grid pb-12 mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="site in sites"
            :key="site.id"
            class="site-card hover:shadow-lg transition-shadow duration-300"
          >
            <template #header>
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <UBadge
                    :color="getStatusColor(site.status)"
                    variant="soft"
                    class="mb-2"
                  >
                    {{ site.status }}
                  </UBadge>
                  <h3 class="text-xl font-semibold line-clamp-1">
                    {{ site.title }}
                  </h3>
                </div>
              </div>
            </template>

            <div class="space-y-3">
              <p v-if="site.theme" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10">
                {{ site.theme }}
              </p>

              <div class="flex items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-calendar" />
                  <span>{{ formatDate(site.createdAt) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <UIcon name="i-heroicons-cube" />
                  <span>{{ site.template }}</span>
                </div>
              </div>

              <div v-if="site.productCount" class="text-sm">
                <UBadge color="info" variant="soft">
                  {{ site.productCount }} products
                </UBadge>
              </div>
            </div>

            <template #footer>
              <div class="flex gap-2">
                <UButton
                  :to="site.links?.displayPath || `/sites/${site.slug}`"
                  color="primary"
                  variant="solid"
                  block
                  trailing-icon="i-heroicons-arrow-right"
                >
                  查看站点
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </div>

      <div v-else class="empty-state text-center py-20">
        <UIcon name="i-heroicons-globe-alt" class="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h2 class="text-2xl font-semibold mb-3">
          还没有站点
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          先去聊天页生成你的第一个产品展示站点；店铺授权和商品同步请到店铺管理页面进行。
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <UButton
            to="/"
            color="primary"
            size="lg"
            leading-icon="i-heroicons-sparkles"
          >
            创建第一个站点
          </UButton>
          <UButton
            to="/stores"
            color="neutral"
            variant="soft"
            size="lg"
            leading-icon="i-lucide-store"
          >
            前往店铺管理
          </UButton>
        </div>
      </div>

      <div class="text-center py-8">
        <UButton
          to="/"
          color="neutral"
          variant="soft"
          leading-icon="i-heroicons-arrow-left"
        >
          返回聊天
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.sites-page {
  min-height: 100vh;
  flex:1;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.02) 0%, transparent 40%);
}

.page-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

:global(.dark) .page-header {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.site-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

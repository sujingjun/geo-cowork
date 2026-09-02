<script setup lang="ts">
import type { AuthFormField, ButtonProps } from '@nuxt/ui'

const emit = defineEmits<{ close: [boolean] }>()

const { loggedIn, openInPopup, fetch } = useUserSession()
const loadingProvider = shallowRef<string | null>(null)
const fields = shallowRef<AuthFormField[]>([])

const providers = computed<ButtonProps[]>(() => [
  {
    label: 'Continue with Google',
    icon: 'i-simple-icons-google',
    color: 'neutral',
    variant: 'subtle',
    loading: loadingProvider.value === 'google',
    onClick: async () => {
      loadingProvider.value = 'google'
      try {
        await openInPopup('/auth/google', { width: 520, height: 720 })
        await fetch()
      } finally {
        loadingProvider.value = null
      }
    }
  },
  {
    label: 'Continue with GitHub',
    icon: 'i-simple-icons-github',
    color: 'neutral',
    variant: 'subtle',
    loading: loadingProvider.value === 'github',
    onClick: async () => {
      loadingProvider.value = 'github'
      try {
        await openInPopup('/auth/github', { width: 520, height: 720 })
        await fetch()
      } finally {
        loadingProvider.value = null
      }
    }
  }
])

watch(loggedIn, (value) => {
  if (value)
    emit('close', true)
})
</script>

<template>
  <UModal
    title="Sign in"
    description="Use an OAuth provider to continue to your workspace."
    :ui="{
      body: 'p-0',
      footer: 'justify-end'
    }"
  >
    <template #body>
      <UAuthForm
        title="Welcome back"
        description="Choose Google or GitHub to sign in in a secure popup window."
        icon="i-lucide-shield-check"
        :fields="fields"
        :providers="providers"
        class="p-6"
        :ui="{ form: 'hidden' }"
      >
        <template #footer>
          Your session stays in a secure cookie and the popup closes automatically after success.
        </template>
      </UAuthForm>
    </template>

    <template #footer>
      <UButton
        color="neutral"
        variant="ghost"
        label="Cancel"
        @click="emit('close', false)"
      />
    </template>
  </UModal>
</template>

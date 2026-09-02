import { handleOAuthUser } from '../../utils/oauth-user'

export default defineOAuthGoogleEventHandler({
  config: {
    authorizationParams: {
      prompt: 'select_account'
    }
  },
  async onSuccess(event, { user: googleUser }) {
    const providerId = googleUser.sub || googleUser.id?.toString()

    if (!providerId) {
      throw createError({
        statusCode: 500,
        message: 'Google OAuth did not return a provider id'
      })
    }

    await handleOAuthUser(event, 'google', {
      providerId,
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.picture,
      username: googleUser.email?.split('@')[0]
    })

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Google OAuth error:', error)
    return sendRedirect(event, '/')
  }
})

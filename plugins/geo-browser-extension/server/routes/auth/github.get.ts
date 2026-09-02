import { handleOAuthUser } from '../../utils/oauth-user'

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user: ghUser }) {
    await handleOAuthUser(event, 'github', {
      providerId: ghUser.id.toString(),
      email: ghUser.email,
      name: ghUser.name,
      avatar: ghUser.avatar_url,
      username: ghUser.login
    })

    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  }
})

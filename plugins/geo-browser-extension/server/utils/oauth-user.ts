import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'
import type { H3Event } from 'h3'

type OAuthProvider = 'github' | 'google'

interface OAuthUserProfile {
  providerId: string
  email?: string | null
  name?: string | null
  avatar?: string | null
  username?: string | null
}

export async function handleOAuthUser(event: H3Event, provider: OAuthProvider, profile: OAuthUserProfile) {
  const session = await getUserSession(event)

  let user = await db.query.users.findFirst({
    where: () => and(
      eq(schema.users.provider, provider),
      eq(schema.users.providerId, profile.providerId)
    )
  })

  if (!user) {
    const username = profile.username || profile.email?.split('@')[0] || `${provider}-${profile.providerId.slice(0, 8)}`

    const [createdUser] = await db.insert(schema.users).values({
      id: session.id,
      name: profile.name || username,
      email: profile.email || `${username}@local.invalid`,
      avatar: profile.avatar || `https://avatar.vercel.sh/${username}`,
      username,
      provider,
      providerId: profile.providerId
    }).returning()

    user = createdUser
  } else {
    await db.update(schema.chats).set({
      userId: user.id
    }).where(eq(schema.chats.userId, session.id))
  }

  await setUserSession(event, { user })

  return user
}

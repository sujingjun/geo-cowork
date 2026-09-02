import type { chats, messages, votes, stores, products, sites, siteProducts } from 'hub:db:schema'

export type Chat = typeof chats.$inferSelect
export type Message = typeof messages.$inferSelect
export type Vote = typeof votes.$inferSelect
export type Store = typeof stores.$inferSelect
export type Product = typeof products.$inferSelect
export type Site = typeof sites.$inferSelect
export type SiteProduct = typeof siteProducts.$inferSelect

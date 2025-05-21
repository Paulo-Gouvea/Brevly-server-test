import { randomUUID } from 'node:crypto'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  originalURL: text('original_URL').notNull(),
  shortURL: text('short_URL').notNull(),
  accessCount: integer().default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

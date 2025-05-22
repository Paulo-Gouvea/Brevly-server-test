import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const links = pgTable('links', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  originalURL: text('original_URL').notNull(),
  shortURL: text('short_URL').unique().notNull(),
  accessCount: integer().default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

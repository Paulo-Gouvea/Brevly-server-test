import { env } from '@/env'
import type { Config } from 'drizzle-kit'

export default {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  schema: 'dist/infra/db/schemas/*',
  out: 'dist/infra/db/migrations',
} satisfies Config

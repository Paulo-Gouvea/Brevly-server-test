import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export async function getAllLinks() {
  const allLinks = await db.select().from(schema.links)

  return allLinks
}

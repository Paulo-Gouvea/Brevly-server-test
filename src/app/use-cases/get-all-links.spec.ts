import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { sql } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { getAllLinks } from './get-all-links'

describe('get all link', () => {
  it('should be able to get all links', async () => {
    const allLinks = await db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(schema.links)

    const totalOfLinks = allLinks[0].count

    const sut = await getAllLinks()

    expect(sut.length).equals(totalOfLinks)
  })
})

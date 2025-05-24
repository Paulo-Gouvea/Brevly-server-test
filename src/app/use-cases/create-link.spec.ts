import { randomUUID } from 'node:crypto'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { createLink } from './create-link'
import { PoorlyFormattedURL } from './errors/poorly-formatted-url'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const shortUrl = `${randomUUID()}-teste`

    const sut = await createLink({
      originalURL: 'https://www.rocketseat.com.br/',
      shortURL: shortUrl,
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortURL, shortUrl))

    expect(result).toHaveLength(1)
  })

  it('should not be able to create a link with poorly formatted URL', async () => {
    const shortUrl = `${randomUUID()};teste`

    const sut = await createLink({
      originalURL: 'https://www.rocketseat.com.br/',
      shortURL: shortUrl,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(PoorlyFormattedURL)
  })
})

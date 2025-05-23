import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { URLNotFound } from './errors/url-not-found'

const getOriginalURLInput = z.object({
  shortURL: z.string().optional(),
})

type GetOriginalURLInput = z.input<typeof getOriginalURLInput>

export async function getOriginalURL(
  input: GetOriginalURLInput
): Promise<Either<URLNotFound, { originalURL: string }>> {
  const { shortURL } = getOriginalURLInput.parse(input)

  if (shortURL === '' || shortURL === undefined) {
    return makeRight({ originalURL: '' })
  }

  const desiredOriginalURL = await db
    .select({
      field1: schema.links.originalURL,
    })
    .from(schema.links)
    .where(eq(schema.links.shortURL, shortURL))

  console.log('desiredOriginalURL ', desiredOriginalURL[0].field1)

  if (desiredOriginalURL.length === 0) {
    return makeLeft(new URLNotFound())
  }

  return makeRight({ originalURL: desiredOriginalURL[0].field1 })
}

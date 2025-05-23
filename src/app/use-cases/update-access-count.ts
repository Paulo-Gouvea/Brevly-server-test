import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { URLNotFound } from './errors/url-not-found'

const updateAccessCountInput = z.object({
  shortURL: z.string().optional(),
})

type UpdateAccessCountInput = z.input<typeof updateAccessCountInput>

export async function updateAccessCount(
  input: UpdateAccessCountInput
): Promise<Either<URLNotFound, number>> {
  const { shortURL } = updateAccessCountInput.parse(input)

  if (shortURL === '' || shortURL === undefined) {
    return makeLeft(new URLNotFound())
  }

  const desiredAccessCount = await db
    .select({
      field1: schema.links.accessCount,
    })
    .from(schema.links)
    .where(eq(schema.links.shortURL, shortURL))

  if (desiredAccessCount.length === 0) {
    return makeLeft(new URLNotFound())
  }

  const updatedValue = desiredAccessCount[0].field1 + 1

  await db
    .update(schema.links)
    .set({ accessCount: updatedValue })
    .where(eq(schema.links.shortURL, shortURL))

  return makeRight(updatedValue)
}

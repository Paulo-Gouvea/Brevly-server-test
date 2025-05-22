import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { z } from 'zod'
import { PoorlyFormattedURL } from './errors/poorly-formatted-url'

const createLinkInput = z.object({
  originalURL: z.string().url().nonempty(),
  shortURL: z.string().nonempty(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<PoorlyFormattedURL, { shortURL: string }>> {
  const { originalURL, shortURL } = createLinkInput.parse(input)
  const allowedFormatRegex = /^[a-zA-Z0-9-]+$/

  if (!allowedFormatRegex.test(shortURL)) {
    return makeLeft(new PoorlyFormattedURL())
  }

  await db.insert(schema.links).values({
    originalURL,
    shortURL,
  })

  return makeRight({ shortURL })
}

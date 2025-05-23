import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ShortURLNotFound } from './errors/short-url-not-found'

const deleteLinkInput = z.object({
  shortURL: z.string().nonempty(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<ShortURLNotFound, { shortURL: string }>> {
  const { shortURL } = deleteLinkInput.parse(input)

  const findURL = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortURL, shortURL))

  if (findURL.length === 0) {
    return makeLeft(new ShortURLNotFound())
  }

  await db.delete(schema.links).where(eq(schema.links.shortURL, shortURL))

  return makeRight({ shortURL })
}

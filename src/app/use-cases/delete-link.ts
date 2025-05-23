import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { URLNotFound } from './errors/url-not-found'

const deleteLinkInput = z.object({
  shortURL: z.string().nonempty(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<URLNotFound, { shortURL: string }>> {
  const { shortURL } = deleteLinkInput.parse(input)

  const findURL = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortURL, shortURL))

  if (findURL.length === 0) {
    return makeLeft(new URLNotFound())
  }

  await db.delete(schema.links).where(eq(schema.links.shortURL, shortURL))

  return makeRight({ shortURL })
}

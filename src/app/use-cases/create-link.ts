import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { z } from 'zod'

const createLinkInput = z.object({
  originalURL: z.string().url(),
  shortURL: z.string(),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(input: CreateLinkInput) {
  const { originalURL, shortURL } = createLinkInput.parse(input)
  const allowedFormatRegex = /^[a-zA-Z0-9-]+$/

  if (originalURL.length === 0 || shortURL.length === 0) {
    throw new Error('Campo Vazio. Por favor preencher!')
  }

  if (!allowedFormatRegex.test(shortURL)) {
    throw new Error('A URL encurtada está mal formatada. Por favor verificar!')
  }

  await db.insert(schema.links).values({
    originalURL,
    shortURL,
  })
}

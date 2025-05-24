import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { describe, expect, it } from 'vitest'
import { createLink } from './create-link'
import { deleteLink } from './delete-link'
import { URLNotFound } from './errors/url-not-found'

describe('delete an url', () => {
  it('should be able to delete an url', async () => {
    const shortUrl = `${randomUUID()}-teste`

    const sut = await createLink({
      originalURL: 'https://www.rocketseat.com.br/',
      shortURL: shortUrl,
    })

    expect(isRight(sut)).toBe(true)

    const result = await deleteLink({ shortURL: shortUrl })

    expect(isRight(result)).toBe(true)
  })

  it('should not be able to delete an original url when using a short url which does not exist', async () => {
    const shortUrl = 'teste123-teste'

    const result = await deleteLink({ shortURL: shortUrl })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(URLNotFound)
  })
})

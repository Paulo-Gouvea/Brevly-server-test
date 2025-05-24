import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { describe, expect, it } from 'vitest'
import { createLink } from './create-link'
import { URLNotFound } from './errors/url-not-found'
import { getOriginalURL } from './get-original-url'

describe('get original url', () => {
  it('should be able to get an original url when using a short url', async () => {
    const shortUrl = `${randomUUID()}-teste`

    const sut = await createLink({
      originalURL: 'https://www.rocketseat.com.br/',
      shortURL: shortUrl,
    })

    expect(isRight(sut)).toBe(true)

    const result = await getOriginalURL({ shortURL: shortUrl })

    expect(isRight(result)).toBe(true)
  })

  it('should not be able to get an original url when using a short url which does not exist', async () => {
    const shortUrl = 'teste123-teste'

    const result = await getOriginalURL({ shortURL: shortUrl })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(URLNotFound)
  })
})

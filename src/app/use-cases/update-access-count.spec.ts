import { randomUUID } from 'node:crypto'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { describe, expect, it } from 'vitest'
import { createLink } from './create-link'
import { URLNotFound } from './errors/url-not-found'
import { updateAccessCount } from './update-access-count'

describe('update access count', () => {
  it('should be able to update an access count from an url', async () => {
    const shortUrl = `${randomUUID()}-teste`

    const sut = await createLink({
      originalURL: 'https://www.rocketseat.com.br/',
      shortURL: shortUrl,
    })

    expect(isRight(sut)).toBe(true)

    const result = await updateAccessCount({ shortURL: shortUrl })

    expect(isRight(result)).toBe(true)
  })

  it('should not be able to update an access count from a specific url when the shorturl does not exist', async () => {
    const shortUrl = 'teste123-teste'

    const result = await updateAccessCount({ shortURL: shortUrl })

    expect(isLeft(result)).toBe(true)
    expect(unwrapEither(result)).toBeInstanceOf(URLNotFound)
  })
})

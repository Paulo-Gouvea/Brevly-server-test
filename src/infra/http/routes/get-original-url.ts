import { getOriginalURL } from '@/app/use-cases/get-original-url'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getOriginalURLRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/original_url',
    {
      schema: {
        summary: 'Get original url using short url',
        querystring: z.object({
          shortURL: z.string().nonempty(),
        }),
        response: {
          201: z.object({
            originalURL: z.string().nonempty(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const desiredShortURL = await request.query

      const result = await getOriginalURL(desiredShortURL)

      if (isRight(result)) {
        return reply.status(201).send({ originalURL: result.right.originalURL })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'URLNotFound':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}

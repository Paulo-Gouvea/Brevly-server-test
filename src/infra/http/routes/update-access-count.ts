import { updateAccessCount } from '@/app/use-cases/update-access-count'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const updateAccessCountRoute: FastifyPluginAsyncZod = async server => {
  server.patch(
    '/access_count',
    {
      schema: {
        summary: 'increment access count',
        querystring: z.object({
          shortURL: z.string().nonempty(),
        }),
        response: {
          201: z.object({
            accessCount: z.number(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const desiredShortURL = await request.query

      const result = await updateAccessCount(desiredShortURL)

      if (isRight(result)) {
        return reply.status(201).send({ accessCount: result.right })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'URLNotFound':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}

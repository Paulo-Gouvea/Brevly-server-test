import { createLink } from '@/app/use-cases/create-link'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a link',
        body: z.object({
          originalURL: z.string().url().nonempty(),
          shortURL: z.string().nonempty(),
        }),
        response: {
          201: z.null().describe('Link criado'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const createdLink = await request.body

      if (!createdLink) {
        return reply.status(400).send({ message: 'Link is required.' })
      }

      const result = await createLink(createdLink)

      if (isRight(result)) {
        return reply.status(201).send()
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'PoorlyFormattedURL':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}

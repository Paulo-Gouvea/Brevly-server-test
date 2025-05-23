import { deleteLink } from '@/app/use-cases/delete-link'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/links',
    {
      schema: {
        summary: 'Delete a link',
        body: z.object({
          shortURL: z.string().nonempty(),
        }),
        response: {
          201: z.null().describe('Link deletado'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const deletedLink = await request.body

      if (!deletedLink) {
        return reply.status(400).send({ message: 'Link not found.' })
      }

      const result = await deleteLink(deletedLink)

      if (isRight(result)) {
        return reply.status(201).send()
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ShortURLNotFound':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}

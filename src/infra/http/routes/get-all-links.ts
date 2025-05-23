import { getAllLinks } from '@/app/use-cases/get-all-links'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getAllLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Get all links',
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                originalURL: z.string(),
                shortURL: z.string(),
                accessCount: z.number(),
                createdAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await getAllLinks()

      return reply.status(200).send({ links: result })
    }
  )
}

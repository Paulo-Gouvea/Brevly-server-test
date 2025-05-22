import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a link',
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.object({ linkId: z.string() }),
          409: z
            .object({ message: z.string() })
            .describe('Link already exists.'),
        },
      },
    },
    async (request, reply) => {
      await db.insert(schema.links).values({
        originalURL: 'https://odia.ig.com.br',
        shortURL: 'odiateste5',
      })

      return reply.status(201).send({ linkId: 'teste' })
    }
  )
}

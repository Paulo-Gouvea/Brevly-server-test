import { createLink } from '@/app/use-cases/create-link'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a link',
        body: z.object({
          originalURL: z.string().url(),
          shortURL: z.string(), //expressão permite letras maiusculas, minusculas, numeros e hifens
        }),
        response: {
          201: z.object({ shortURL: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const createdLink = await request.body

      if (!createdLink) {
        return reply.status(400).send({ message: 'Link is required.' })
      }

      await createLink(createdLink)

      return reply.status(201).send({ shortURL: 'teste' })
    }
  )
}

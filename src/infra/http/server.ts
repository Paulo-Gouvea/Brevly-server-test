import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportLinksRoute } from './routes/export-links'
import { getAllLinksRoute } from './routes/get-all-links'
import { getOriginalURLRoute } from './routes/get-original-url'
import { updateAccessCountRoute } from './routes/update-access-count'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (error.code === '23505') {
    return reply.status(409).send({
      message:
        'Esta URL encurtada já está sendo utilizada. Por favor utilize outra!',
    })
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal Server Error.' })
})

server.register(fastifyCors, { origin: '*' })

// fastify multipart futuramente??? acho que não
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly Server',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// rotas
server.register(createLinkRoute)
server.register(getAllLinksRoute)
server.register(getOriginalURLRoute)
server.register(updateAccessCountRoute)
server.register(deleteLinkRoute)
server.register(exportLinksRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP SERVER RUNNING!')
})

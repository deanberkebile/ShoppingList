import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { ObjectId } from 'mongodb'
import { getDb, type Db } from '@shopping-list/db'

const server = Fastify({ logger: true })

server.register(cors, {
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
})

server.register(swagger, {
  openapi: {
    info: {
      title: 'Shopping List API',
      version: '0.1.0',
    },
  },
})

server.register(swaggerUi, {
  routePrefix: '/docs',
})

let db: Db

server.get('/health', async () => {
  return { status: 'ok' }
})

server.get('/items', async () => {
  return db.collection('items').find().toArray()
})

server.post('/items', async (request) => {
  const { name, quantity } = request.body as { name: string; quantity: number }
  const result = await db.collection('items').insertOne({ name, quantity, purchased: false })
  return { _id: result.insertedId, name, quantity, purchased: false }
})

server.put('/items/:id', async (request) => {
  const { id } = request.params as { id: string }
  const { name, quantity } = request.body as { name: string; quantity: number }
  await db.collection('items').updateOne({ _id: new ObjectId(id) }, { $set: { name, quantity } })
  return { _id: id, name, quantity }
})

server.patch('/items/:id', async (request) => {
  const { id } = request.params as { id: string }
  const { purchased } = request.body as { purchased: boolean }
  await db.collection('items').updateOne({ _id: new ObjectId(id) }, { $set: { purchased } })
  return { _id: id, purchased }
})

server.delete('/items/:id', async (request) => {
  const { id } = request.params as { id: string }
  await db.collection('items').deleteOne({ _id: new ObjectId(id) })
  return { deleted: true }
})

const start = async () => {
  try {
    db = await getDb(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
      'shopping-list'
    )
    server.log.info('Connected to MongoDB')

    await server.listen({
      port: Number(process.env.PORT) || 3001,
      host: '0.0.0.0',
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()

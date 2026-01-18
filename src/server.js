import http from 'http'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { connectDb } from './config/db.js'
import { initSockets } from './sockets/index.js'
import { logger } from './utils/logger.js'

async function main() {
  const app = createApp()
  const server = http.createServer(app)
  initSockets(server)

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'Backend listening')
  })

  try {
    await connectDb()
  } catch (err) {
    logger.warn({ err }, 'MongoDB connection failed; continuing without DB')
  }
}

main().catch((err) => {
  logger.error({ err }, 'Failed to start server')
  process.exit(1)
})

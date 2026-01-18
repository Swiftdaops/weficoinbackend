import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import publicRoutes from './routes/public.routes.js'
import adminRoutes from './routes/admin.routes.js'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middlewares/errorHandler.middleware.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
      credentials: true,
    })
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  app.get('/health', (_req, res) => res.json({ ok: true }))

  app.use('/api/public', publicRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(errorHandler)
  return app
}

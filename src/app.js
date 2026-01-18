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

  const corsOrigin =
    env.CORS_ORIGIN === '*'
      ? true
      : env.CORS_ORIGIN
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

  app.use(helmet())
  app.use(
    cors({
      origin: Array.isArray(corsOrigin) && corsOrigin.length === 1 ? corsOrigin[0] : corsOrigin,
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

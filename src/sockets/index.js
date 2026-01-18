import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ADMIN_NAMESPACE } from '../utils/constants.js'
import { logger } from '../utils/logger.js'

let adminIo = null

export function initSockets(httpServer) {
  const normalizeOrigin = (value) => {
    if (!value) return value
    return value.endsWith('/') ? value.slice(0, -1) : value
  }

  const corsAllowAny = env.CORS_ORIGIN === '*'
  const corsAllowedOrigins = corsAllowAny
    ? []
    : env.CORS_ORIGIN
        .split(',')
        .map((s) => normalizeOrigin(s.trim()))
        .filter(Boolean)

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (corsAllowAny) return callback(null, true)
        if (!origin) return callback(null, true)

        const normalized = normalizeOrigin(origin)
        const ok = corsAllowedOrigins.includes(normalized)
        return callback(null, ok)
      },
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    logger.info({ id: socket.id }, 'Socket connected')
    socket.on('ping', (payload) => socket.emit('pong', payload))
    socket.on('disconnect', () => logger.info({ id: socket.id }, 'Socket disconnected'))
  })

  const nsp = io.of(ADMIN_NAMESPACE)
  nsp.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Missing token'))
    try {
      const payload = jwt.verify(token, env.JWT_SECRET)
      if (payload?.role !== 'admin') return next(new Error('Not authorized as admin'))
      socket.admin = payload
      return next()
    } catch {
      return next(new Error('Invalid token'))
    }
  })

  nsp.on('connection', (socket) => {
    logger.info({ id: socket.id }, 'Admin socket connected')
    socket.on('disconnect', () => logger.info({ id: socket.id }, 'Admin socket disconnected'))
  })

  adminIo = nsp
  return io
}

export function emitAdminEvent(event, payload) {
  adminIo?.emit(event, payload)
}

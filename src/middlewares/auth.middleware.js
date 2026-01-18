import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function requireAdmin(req, res, next) {
  const header = req.header('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined
  if (!token) return res.status(401).json({ error: 'Missing token' })

  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    if (payload?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized as admin' })
    }
    req.admin = payload
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

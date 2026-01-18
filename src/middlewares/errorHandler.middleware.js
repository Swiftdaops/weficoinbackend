import { logger } from '../utils/logger.js'

export function errorHandler(err, _req, res, _next) {
  logger.error({ err }, 'Unhandled error')
  return res.status(500).json({ error: 'Internal Server Error' })
}

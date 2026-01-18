import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from '../config/env.js'

const nonces = new Map()

export function issueNonce() {
  const nonce = crypto.randomBytes(16).toString('hex')
  nonces.set(nonce, { nonce, expiresAt: Date.now() + 10 * 60_000 })
  return nonce
}

export function consumeNonce(nonce) {
  const record = nonces.get(nonce)
  nonces.delete(nonce)
  if (!record) return false
  return record.expiresAt > Date.now()
}

export function signJwt(walletAddress, role) {
  return jwt.sign(
    {
      sub: walletAddress.toLowerCase(),
      walletAddress: walletAddress.toLowerCase(),
      role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )
}

export function signAdminJwt(walletAddress) {
  return signJwt(walletAddress, 'admin')
}

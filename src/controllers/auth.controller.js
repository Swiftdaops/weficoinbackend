import { SiweMessage } from 'siwe'
import { verifyMessage } from 'viem'
import { env } from '../config/env.js'
import { consumeNonce, issueNonce, signJwt } from '../services/auth.service.js'

export async function getNonce(_req, res) {
  const nonce = issueNonce()
  return res.json({ ok: true, nonce })
}

export async function postLogin(req, res) {
  const { message, signature } = req.body

  let siwe
  try {
    siwe = new SiweMessage(message)
  } catch {
    return res.status(400).json({ error: 'Invalid SIWE message' })
  }

  if (siwe.domain !== env.SIWE_DOMAIN) {
    return res.status(401).json({ error: 'SIWE domain mismatch' })
  }

  const nonceOk = consumeNonce(siwe.nonce)
  if (!nonceOk) {
    return res.status(401).json({ error: 'Invalid or expired nonce' })
  }

  const address = siwe.address?.toLowerCase()
  if (!address) {
    return res.status(400).json({ error: 'Missing SIWE address' })
  }

  const validSig = await verifyMessage({ address: address, message, signature })
  if (!validSig) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const isAdmin =
    env.ADMIN_WALLET_ADDRESS && address === env.ADMIN_WALLET_ADDRESS.toLowerCase()
  const role = isAdmin ? 'admin' : 'user'
  const token = signJwt(address, role)
  return res.json({ ok: true, token, walletAddress: address, role })
}

export async function postLogout(_req, res) {
  return res.json({ ok: true })
}

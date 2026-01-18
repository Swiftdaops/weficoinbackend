import { upsertWalletSession } from '../services/wallet.service.js'
import { emitAdminEvent } from '../sockets/index.js'

export async function postSession(req, res) {
  const { walletAddress, chainId } = req.body
  const result = await upsertWalletSession({ walletAddress, chainId })
  emitAdminEvent('session', result.session)
  return res.json({ ok: true, session: result.session })
}

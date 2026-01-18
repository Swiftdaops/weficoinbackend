import { clearWalletSessions, listWalletsWithBalances, listEvents, listTestResults } from '../services/admin.service.js'
import { verifyAllowance } from '../services/allowance.service.js'
import { emitAdminEvent } from '../sockets/index.js'

export async function getWallets(_req, res) {
  const wallets = await listWalletsWithBalances()
  return res.json({ ok: true, wallets })
}

export async function getEvents(_req, res) {
  const events = await listEvents()
  return res.json({ ok: true, events })
}

export async function getTestResults(_req, res) {
  const results = await listTestResults()
  return res.json({ ok: true, results })
}

export async function postVerifyAllowance(req, res) {
  const { walletAddress, tokenAddress, spenderAddress } = req.body
  const result = await verifyAllowance({ walletAddress, tokenAddress, spenderAddress })
  emitAdminEvent('testResult', result)
  return res.json({ ok: true, result })
}

export async function deleteWallets(_req, res) {
  const result = await clearWalletSessions()
  return res.json({ ok: true, deletedCount: result?.deletedCount ?? 0 })
}

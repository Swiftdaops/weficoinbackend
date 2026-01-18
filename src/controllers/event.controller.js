import { logClickEvent } from '../services/event.service.js'
import { emitAdminEvent } from '../sockets/index.js'

export async function postEvent(req, res) {
  const { walletAddress, eventType, metadata } = req.body
  const evt = await logClickEvent({ walletAddress, eventType, metadata })
  emitAdminEvent('event', evt)
  return res.json({ ok: true, event: evt })
}

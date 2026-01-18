import { WalletSession } from '../models/WalletSession.js'

export async function upsertWalletSession(args) {
  const now = new Date()
  const walletAddress = args.walletAddress.toLowerCase()
  const existing = await WalletSession.findOne({ walletAddress, chainId: args.chainId })

  if (!existing) {
    const created = await WalletSession.create({
      walletAddress,
      chainId: args.chainId,
      connectedAt: now,
      lastSeenAt: now,
    })
    return { session: created, isNew: true }
  }

  existing.lastSeenAt = now
  await existing.save()
  return { session: existing, isNew: false }
}

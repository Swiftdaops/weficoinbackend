import { ClickEvent } from '../models/ClickEvent.js'

export async function logClickEvent(args) {
  const createdAt = new Date()
  const walletAddress = args.walletAddress.toLowerCase()
  const evt = await ClickEvent.create({
    walletAddress,
    eventType: args.eventType,
    metadata: args.metadata ?? {},
    createdAt,
  })
  return evt
}

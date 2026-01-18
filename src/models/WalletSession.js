import { Schema, model } from 'mongoose'

const walletSessionSchema = new Schema(
  {
    walletAddress: { type: String, required: true, index: true },
    chainId: { type: Number, required: true },
    connectedAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
  },
  { timestamps: false }
)

walletSessionSchema.index({ walletAddress: 1, chainId: 1 }, { unique: true })

export const WalletSession = model('WalletSession', walletSessionSchema)

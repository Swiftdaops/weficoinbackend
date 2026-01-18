import { Schema, model } from 'mongoose'

const clickEventSchema = new Schema(
  {
    walletAddress: { type: String, required: true, index: true },
    eventType: {
      type: String,
      required: true,
      enum: ['CONNECT', 'CLICK_APPROVE_EXACT', 'CLICK_APPROVE_UNLIMITED', 'REVOKE', 'TEST_COMPLETE'],
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, required: true },
  },
  { timestamps: false }
)

clickEventSchema.index({ walletAddress: 1, createdAt: -1 })

export const ClickEvent = model('ClickEvent', clickEventSchema)

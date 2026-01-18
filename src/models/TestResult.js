import { Schema, model } from 'mongoose'

const testResultSchema = new Schema(
  {
    walletAddress: { type: String, required: true, index: true },
    tokenAddress: { type: String, required: true },
    spenderAddress: { type: String, required: true },
    allowance: { type: String, required: true },
    isUnlimited: { type: Boolean, required: true },
    verifiedOnChain: { type: Boolean, required: true },
    checkedAt: { type: Date, required: true },
  },
  { timestamps: false }
)

testResultSchema.index({ walletAddress: 1, tokenAddress: 1, spenderAddress: 1, checkedAt: -1 })

export const TestResult = model('TestResult', testResultSchema)

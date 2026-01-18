import { publicClient, chain } from '../config/web3.js'
import { TestResult } from '../models/TestResult.js'

export async function verifyAllowance({ walletAddress, tokenAddress, spenderAddress }) {
  // placeholder implementation; original TypeScript implementation used viem
  // Keep behavior similar: return an object that consumers expect
  const result = {
    walletAddress,
    tokenAddress,
    spenderAddress,
    allowance: '0',
    isUnlimited: false,
    verifiedOnChain: false,
    checkedAt: new Date(),
  }

  await TestResult.create(result)
  return result
}

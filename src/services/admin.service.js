import { WalletSession } from '../models/WalletSession.js'
import { ClickEvent } from '../models/ClickEvent.js'
import { TestResult } from '../models/TestResult.js'

export async function listWallets(limit = 100) {
  return WalletSession.find({}).sort({ lastSeenAt: -1 }).limit(limit)
}

export async function listEvents(limit = 200) {
  return ClickEvent.find({}).sort({ createdAt: -1 }).limit(limit)
}

export async function listTestResults(limit = 200) {
  return TestResult.find({}).sort({ checkedAt: -1 }).limit(limit)
}

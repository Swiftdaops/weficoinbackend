import { WalletSession } from '../models/WalletSession.js'
import { ClickEvent } from '../models/ClickEvent.js'
import { TestResult } from '../models/TestResult.js'
import { publicClient } from '../config/web3.js'
import { formatEther, getAddress, isAddress } from 'viem'

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (true) {
      const current = nextIndex
      nextIndex += 1
      if (current >= items.length) return
      results[current] = await mapper(items[current], current)
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => worker())
  await Promise.all(workers)
  return results
}

async function getEthBalanceByAddress(address) {
  try {
    if (!address || !isAddress(address)) return null
    const checksum = getAddress(address)
    const balanceWei = await publicClient.getBalance({ address: checksum })
    return {
      ethBalanceWei: balanceWei.toString(),
      ethBalance: formatEther(balanceWei),
    }
  } catch {
    return null
  }
}

export async function listWallets(limit = 100) {
  return WalletSession.find({}).sort({ lastSeenAt: -1 }).limit(limit)
}

export async function listWalletsWithBalances(limit = 100) {
  const sessions = await listWallets(limit)

  const uniqueAddresses = Array.from(
    new Set(
      sessions
        .map((s) => (s?.walletAddress ? String(s.walletAddress) : ''))
        .filter(Boolean)
        .map((a) => a.toLowerCase())
    )
  )

  const balances = await mapWithConcurrency(uniqueAddresses, 5, async (addr) => {
    const bal = await getEthBalanceByAddress(addr)
    return [addr, bal]
  })

  const balanceMap = new Map(balances)

  return sessions.map((s) => {
    const plain = typeof s?.toObject === 'function' ? s.toObject() : s
    const key = plain?.walletAddress ? String(plain.walletAddress).toLowerCase() : ''
    const bal = key ? balanceMap.get(key) : null
    return {
      ...plain,
      ethBalance: bal?.ethBalance ?? null,
      ethBalanceWei: bal?.ethBalanceWei ?? null,
    }
  })
}

export async function listEvents(limit = 200) {
  return ClickEvent.find({}).sort({ createdAt: -1 }).limit(limit)
}

export async function listTestResults(limit = 200) {
  return TestResult.find({}).sort({ checkedAt: -1 }).limit(limit)
}

export async function clearWalletSessions() {
  return WalletSession.deleteMany({})
}

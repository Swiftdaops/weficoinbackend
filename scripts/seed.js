import mongoose from 'mongoose'
import { connectDb } from '../src/config/db.js'
import { WalletSession } from '../src/models/WalletSession.js'
import { ClickEvent } from '../src/models/ClickEvent.js'
import { TestResult } from '../src/models/TestResult.js'
import { env } from '../src/config/env.js'

function parseArgs(argv) {
  const args = new Set(argv)
  return {
    drop: args.has('--drop'),
    count: Number(
      (argv.find((a) => a.startsWith('--count=')) || '').split('=')[1] || 3
    ),
  }
}

function randomAddress(seed) {
  // deterministic-ish fake addresses for demo data
  const hex = seed.toString(16).padStart(40, '0')
  return `0x${hex.slice(0, 40)}`
}

async function main() {
  const { drop, count } = parseArgs(process.argv.slice(2))

  if (!env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI')
  }

  await connectDb()

  if (drop) {
    await Promise.all([
      WalletSession.deleteMany({}),
      ClickEvent.deleteMany({}),
      TestResult.deleteMany({}),
    ])
  }

  const now = new Date()
  const wallets = Array.from({ length: Math.max(1, count) }, (_, i) => {
    const walletAddress = randomAddress(1000 + i).toLowerCase()
    return {
      walletAddress,
      chainId: env.CHAIN_ID || 11155111,
      connectedAt: new Date(now.getTime() - (i + 1) * 60_000),
      lastSeenAt: new Date(now.getTime() - i * 30_000),
    }
  })

  // Insert/update sessions (unique index walletAddress+chainId)
  await Promise.all(
    wallets.map((w) =>
      WalletSession.updateOne(
        { walletAddress: w.walletAddress, chainId: w.chainId },
        { $set: w },
        { upsert: true }
      )
    )
  )

  const events = wallets.flatMap((w, idx) => {
    const base = now.getTime() - idx * 120_000
    return [
      {
        walletAddress: w.walletAddress,
        eventType: 'CONNECT',
        metadata: { chainId: w.chainId },
        createdAt: new Date(base - 10_000),
      },
      {
        walletAddress: w.walletAddress,
        eventType: 'CLICK_APPROVE_EXACT',
        metadata: { tokenAddress: randomAddress(2000 + idx), spenderAddress: randomAddress(3000 + idx) },
        createdAt: new Date(base - 5_000),
      },
      {
        walletAddress: w.walletAddress,
        eventType: 'TEST_COMPLETE',
        metadata: { ok: true },
        createdAt: new Date(base),
      },
    ]
  })

  const results = wallets.map((w, idx) => ({
    walletAddress: w.walletAddress,
    tokenAddress: randomAddress(2000 + idx),
    spenderAddress: randomAddress(3000 + idx),
    allowance: idx % 2 === 0 ? '0' : '1000000000000000000',
    isUnlimited: false,
    verifiedOnChain: false,
    checkedAt: new Date(now.getTime() - idx * 45_000),
  }))

  await ClickEvent.insertMany(events, { ordered: false })
  await TestResult.insertMany(results, { ordered: false })

  const [sessionCount, eventCount, resultCount] = await Promise.all([
    WalletSession.countDocuments(),
    ClickEvent.countDocuments(),
    TestResult.countDocuments(),
  ])

  console.log('Seed complete')
  console.log({ sessionCount, eventCount, resultCount })
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      await mongoose.disconnect()
    } catch {
      // ignore
    }
  })

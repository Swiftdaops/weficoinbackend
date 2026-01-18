import { describe, it, after } from 'node:test'
import assert from 'node:assert'
import http from 'node:http'

// Stub DB operations by patching model methods before importing the app
import * as WalletModel from '../src/models/WalletSession.js'
import * as ClickModel from '../src/models/ClickEvent.js'
import * as TestModel from '../src/models/TestResult.js'

WalletModel.WalletSession.findOne = async () => null
WalletModel.WalletSession.create = async (obj) => ({ ...obj, _id: '1' })
WalletModel.WalletSession.prototype.save = async function () { return this }

ClickModel.ClickEvent.create = async (obj) => ({ ...obj, _id: '1' })
TestModel.TestResult.create = async (obj) => ({ ...obj, _id: '1' })

const { createApp } = await import('../src/app.js')

const app = createApp()
const server = http.createServer(app)
await new Promise((resolve) => server.listen(0, resolve))
const addr = server.address()
const BASE_URL = `http://127.0.0.1:${addr.port}`

after(() => new Promise((resolve) => server.close(resolve)))

describe('API Endpoints', () => {
  it('GET /health should return 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/health`)
    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert.deepStrictEqual(data, { ok: true })
  })

  it('POST /api/public/session should create a session', async () => {
    const payload = {
      walletAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1,
    }

    const res = await fetch(`${BASE_URL}/api/public/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert.strictEqual(data.ok, true)
    // patched model returns same walletAddress as input lowercased
    assert.strictEqual(data.session.walletAddress, payload.walletAddress.toLowerCase())
  })

  it('POST /api/public/event should log an event', async () => {
    const payload = {
      walletAddress: '0x1234567890123456789012345678901234567890',
      eventType: 'CONNECT',
      metadata: { source: 'test-script' },
    }

    const res = await fetch(`${BASE_URL}/api/public/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert.strictEqual(data.ok, true)
    assert.strictEqual(data.event.eventType, 'CONNECT')
  })
})

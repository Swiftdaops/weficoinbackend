import { Router } from 'express'
import { z } from 'zod'
import { postSession } from '../controllers/wallet.controller.js'
import { postEvent } from '../controllers/event.controller.js'
import { getBtcBalance } from '../controllers/btc.controller.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { publicRateLimit } from '../middlewares/rateLimit.middleware.js'

const router = Router()

router.use(publicRateLimit)

router.post(
  '/session',
  validateBody(
    z.object({
      walletAddress: z.string().min(3),
      chainId: z.literal(1),
    })
  ),
  postSession
)

router.post(
  '/event',
  validateBody(
    z.object({
      walletAddress: z.string().min(3),
      eventType: z.enum(['CONNECT', 'CLICK_APPROVE_EXACT', 'CLICK_APPROVE_UNLIMITED', 'REVOKE', 'TEST_COMPLETE']),
      metadata: z.record(z.any()).optional(),
    })
  ),
  postEvent
)

router.get('/btc/balance/:address', getBtcBalance)

export default router

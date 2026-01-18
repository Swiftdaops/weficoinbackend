import { Router } from 'express'
import { z } from 'zod'
import { requireAdmin } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { getEvents, getTestResults, getWallets, postVerifyAllowance } from '../controllers/admin.controller.js'

const router = Router()

router.use(requireAdmin)

router.get('/wallets', getWallets)
router.get('/events', getEvents)
router.get('/test-results', getTestResults)

router.post(
  '/verify-allowance',
  validateBody(
    z.object({
      walletAddress: z.string().min(3),
      tokenAddress: z.string().min(3),
      spenderAddress: z.string().min(3),
    })
  ),
  postVerifyAllowance
)

export default router

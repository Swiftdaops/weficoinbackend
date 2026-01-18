import { Router } from 'express'
import { z } from 'zod'
import { getNonce, postLogin, postLogout } from '../controllers/auth.controller.js'
import { validateBody } from '../middlewares/validate.middleware.js'

const router = Router()

router.get('/nonce', getNonce)

router.post(
  '/login',
  validateBody(
    z.object({
      message: z.string().min(1),
      signature: z.string().regex(/^0x[0-9a-fA-F]+$/),
    })
  ),
  postLogin
)

router.post('/logout', postLogout)

export default router

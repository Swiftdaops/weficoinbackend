import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(5050),
  MONGODB_URI: z.string().min(1),
  CHAIN_ID: z.coerce.number().default(11155111),
  RPC_URL: z.string().optional(),
  SIWE_DOMAIN: z.string().min(1),
  SIWE_ORIGIN: z.string().min(1),
  ADMIN_WALLET_ADDRESS: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('12h'),
  CORS_ORIGIN: z.string().default('*'),
})

export const env = envSchema.parse(process.env)

import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { env } from './env.js'

function getChain(chainId) {
  if (chainId !== mainnet.id) {
    throw new Error(
      `Unsupported CHAIN_ID=${chainId}. Only Ethereum mainnet (1) is supported.`
    )
  }

  return mainnet
}

export const chain = getChain(env.CHAIN_ID)

export const publicClient = createPublicClient({
  chain,
  transport: env.RPC_URL ? http(env.RPC_URL) : http(),
})

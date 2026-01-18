import { createPublicClient, http } from 'viem'
import { mainnet, sepolia, polygonAmoy } from 'viem/chains'
import { env } from './env.js'

function getChain(chainId) {
  switch (chainId) {
    case mainnet.id:
      return mainnet
    case polygonAmoy.id:
      return polygonAmoy
    case sepolia.id:
    default:
      return sepolia
  }
}

export const chain = getChain(env.CHAIN_ID)

export const publicClient = createPublicClient({
  chain,
  transport: env.RPC_URL ? http(env.RPC_URL) : http(),
})

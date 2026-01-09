import { useAccount } from 'wagmi'

export function useWallet() {
  const { address, isConnected, chain } = useAccount()

  return {
    address,
    isConnected,
    chain,
    isOnBaseNetwork: chain?.id === 8453, // Base mainnet
    isOnBaseSepolia: chain?.id === 84532, // Base Sepolia testnet
  }
}
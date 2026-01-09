import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { BATCH_PAY_ADDRESS, BATCH_PAY_ABI } from '@/config/contract'
import { parseEther } from 'viem'
import type { Recipient } from '@/types/payment'

export function useBatchPay() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const executeBatchPay = async (recipients: Recipient[]) => {
    if (recipients.length === 0) return

    const validRecipients = recipients.filter(r => r.isValid)
    if (validRecipients.length === 0) return

    const addresses = validRecipients.map(r => r.address as `0x${string}`)
    const amounts = validRecipients.map(r => r.amountWei)
    const names = validRecipients.map(r => r.name || '')

    // Calculate total amount including fee
    const totalAmount = validRecipients.reduce((sum, r) => sum + r.amountWei, 0n)
    const fee = totalAmount * 50n / 10000n // 0.5% fee (50 BPS)
    const totalRequired = totalAmount + fee

    writeContract({
      address: BATCH_PAY_ADDRESS,
      abi: BATCH_PAY_ABI,
      functionName: 'batchPay',
      args: [addresses, amounts, names],
      value: totalRequired,
    })
  }

  return {
    executeBatchPay,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  }
}
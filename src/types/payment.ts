export interface Recipient {
  address: string;
  name: string;
  amount: string;
  amountWei: bigint;
  isValid: boolean;
  error?: string;
}

export interface ParsedCSV {
  recipients: Recipient[];
  errors: string[];
  isValid: boolean;
}

export interface BatchPayment {
  recipients: readonly `0x${string}`[];
  amounts: readonly bigint[];
  names: readonly string[];
  timestamp: bigint;
}

export interface PaymentSummary {
  totalAmount: bigint;
  fee: bigint;
  totalRequired: bigint;
  recipientCount: number;
}

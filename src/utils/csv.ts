import Papa from 'papaparse';
import { isAddress, parseEther } from 'viem';
import type { Recipient, ParsedCSV } from '@/types/payment';
import { MAX_RECIPIENTS } from '@/config/contract';

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const recipients: Recipient[] = [];
        const errors: string[] = [];
        const seenAddresses = new Set<string>();

        const rows = results.data as string[][];

        if (rows.length > MAX_RECIPIENTS) {
          errors.push(`Too many recipients. Maximum allowed is ${MAX_RECIPIENTS}`);
        }

        rows.slice(0, MAX_RECIPIENTS).forEach((row, index) => {
          if (row.length < 3) {
            errors.push(`Row ${index + 1}: Invalid format. Expected: address,name,amount`);
            return;
          }

          const [address, name, amountStr] = row.map(s => s.trim());
          const recipient: Recipient = {
            address,
            name,
            amount: amountStr,
            amountWei: BigInt(0),
            isValid: true,
          };

          // Validate address
          if (!isAddress(address)) {
            recipient.isValid = false;
            recipient.error = 'Invalid address';
            errors.push(`Row ${index + 1}: Invalid Ethereum address`);
          }

          // Check for duplicates
          const lowerAddress = address.toLowerCase();
          if (seenAddresses.has(lowerAddress)) {
            recipient.isValid = false;
            recipient.error = 'Duplicate address';
            errors.push(`Row ${index + 1}: Duplicate address`);
          } else {
            seenAddresses.add(lowerAddress);
          }

          // Validate amount
          const amount = parseFloat(amountStr);
          if (isNaN(amount) || amount <= 0) {
            recipient.isValid = false;
            recipient.error = 'Invalid amount';
            errors.push(`Row ${index + 1}: Amount must be a positive number`);
          } else {
            try {
              recipient.amountWei = parseEther(amountStr);
            } catch {
              recipient.isValid = false;
              recipient.error = 'Amount parsing failed';
              errors.push(`Row ${index + 1}: Could not parse amount`);
            }
          }

          // Validate name
          if (!name || name.length === 0) {
            recipient.name = 'Unknown';
          }

          recipients.push(recipient);
        });

        resolve({
          recipients,
          errors,
          isValid: errors.length === 0 && recipients.length > 0,
        });
      },
      error: (error) => {
        resolve({
          recipients: [],
          errors: [error.message],
          isValid: false,
        });
      },
    });
  });
}

export function formatAmount(amountWei: bigint): string {
  const eth = Number(amountWei) / 1e18;
  return eth.toFixed(4);
}

export function calculateFee(totalAmount: bigint): bigint {
  return (totalAmount * BigInt(50)) / BigInt(10000); // 0.5%
}

export function calculateTotals(recipients: Recipient[]) {
  const validRecipients = recipients.filter(r => r.isValid);
  const totalAmount = validRecipients.reduce((sum, r) => sum + r.amountWei, BigInt(0));
  const fee = calculateFee(totalAmount);
  const totalRequired = totalAmount + fee;

  return {
    totalAmount,
    fee,
    totalRequired,
    recipientCount: validRecipients.length,
  };
}

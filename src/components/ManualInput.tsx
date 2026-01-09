import { useState, useCallback } from 'react';
import { Plus, Trash2, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseEther } from 'viem';
import type { Recipient } from '@/types/payment';

interface ManualInputProps {
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
}

export function ManualInput({ recipients, onRecipientsChange }: ManualInputProps) {
  const [newRecipient, setNewRecipient] = useState({
    address: '',
    name: '',
    amount: ''
  });

  const validateAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const validateAmount = (amount: string) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 1000; // Max 1000 ETH per recipient
  };

  const addRecipient = useCallback(() => {
    const { address, name, amount } = newRecipient;

    if (!address.trim() || !amount.trim()) {
      return;
    }

    const isValidAddress = validateAddress(address);
    const isValidAmount = validateAmount(amount);

    let amountWei = BigInt(0);
    let error: string | undefined;

    if (isValidAmount) {
      try {
        amountWei = parseEther(amount);
      } catch {
        error = 'Amount parsing failed';
      }
    }

    if (!isValidAddress) {
      error = 'Invalid Ethereum address format';
    } else if (!isValidAmount) {
      error = 'Amount must be between 0.000001 and 1000 ETH';
    }

    const recipient: Recipient = {
      address: address.trim(),
      name: name.trim() || `Recipient ${recipients.length + 1}`,
      amount: amount,
      amountWei,
      isValid: isValidAddress && isValidAmount && !error,
      error
    };

    onRecipientsChange([...recipients, recipient]);
    setNewRecipient({ address: '', name: '', amount: '' });
  }, [newRecipient, recipients, onRecipientsChange]);

  const removeRecipient = useCallback((index: number) => {
    const updated = recipients.filter((_, i) => i !== index);
    onRecipientsChange(updated);
  }, [recipients, onRecipientsChange]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addRecipient();
    }
  };

  return (
    <section id="manual-input" className="py-16">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
              Add Recipients Manually
            </h2>
            <p className="text-muted-foreground">
              Enter recipient details individually or upload a CSV file
            </p>
          </div>

          <div className="card-base mb-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Add New Recipient</h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Ethereum Address
                </Label>
                <Input
                  id="address"
                  placeholder="0x..."
                  value={newRecipient.address}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, address: e.target.value }))}
                  onKeyPress={handleKeyPress}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Amount (ETH)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  max="1000"
                  placeholder="0.1"
                  value={newRecipient.amount}
                  onChange={(e) => setNewRecipient(prev => ({ ...prev, amount: e.target.value }))}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={addRecipient}
                disabled={!newRecipient.address.trim() || !newRecipient.amount.trim()}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Recipient
              </Button>
            </div>
          </div>

          {recipients.length > 0 && (
            <div className="card-base">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Recipients ({recipients.length})
              </h3>

              <div className="space-y-3">
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-lg border p-4 ${
                      recipient.isValid
                        ? 'border-border bg-card'
                        : 'border-destructive/50 bg-destructive/5'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {recipient.name}
                          </p>
                          <p className="text-sm text-muted-foreground font-mono truncate">
                            {recipient.address}
                          </p>
                          {!recipient.isValid && recipient.error && (
                            <p className="text-sm text-destructive mt-1">
                              {recipient.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {recipient.amount} ETH
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipient(index)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
                <span>
                  {recipients.filter(r => r.isValid).length} valid recipients
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRecipientsChange([])}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
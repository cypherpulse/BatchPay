import { Check, X, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import type { Recipient } from '@/types/payment';
import { formatAmount } from '@/utils/csv';

interface PreviewTableProps {
  recipients: Recipient[];
  errors: string[];
}

type SortField = 'name' | 'amount' | 'address';
type SortDirection = 'asc' | 'desc';

export function PreviewTable({ recipients, errors }: PreviewTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecipients = [...recipients].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'amount':
        comparison = Number(a.amountWei - b.amountWei);
        break;
      case 'address':
        comparison = a.address.localeCompare(b.address);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const validCount = recipients.filter(r => r.isValid).length;
  const invalidCount = recipients.length - validCount;

  if (recipients.length === 0) return null;

  return (
    <section id="preview" className="py-16">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Payment Preview
            </h2>
            <p className="text-muted-foreground">
              Review recipients before sending
            </p>
          </div>
          
          <div className="flex gap-3">
            <span className="badge-success">
              <Check className="mr-1 h-3 w-3" />
              {validCount} valid
            </span>
            {invalidCount > 0 && (
              <span className="badge-error">
                <X className="mr-1 h-3 w-3" />
                {invalidCount} invalid
              </span>
            )}
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Validation Errors</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-destructive/80">
                  {errors.slice(0, 5).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li>...and {errors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="card-base overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('name')}
                      className="table-header flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('address')}
                      className="table-header flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Address
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleSort('amount')}
                      className="table-header ml-auto flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Amount (ETH)
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <span className="table-header">Status</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRecipients.map((recipient, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border last:border-0 transition-colors ${
                      recipient.isValid ? 'hover:bg-muted/30' : 'bg-destructive/5'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{recipient.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                        {recipient.address.slice(0, 6)}...{recipient.address.slice(-4)}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium text-foreground">
                        {formatAmount(recipient.amountWei)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {recipient.isValid ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                          <Check className="h-4 w-4 text-success" />
                        </span>
                      ) : (
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10"
                          title={recipient.error}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

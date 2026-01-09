import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { RecipientInput } from '@/components/RecipientInput';
import { PreviewTable } from '@/components/PreviewTable';
import { Footer } from '@/components/Footer';
import { calculateTotals, formatAmount } from '@/utils/csv';
import { useBatchPay } from '@/hooks/useBatchPay';
import { useWallet } from '@/hooks/useWallet';
import type { ParsedCSV, Recipient } from '@/types/payment';
import { Send, Info, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Create = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { executeBatchPay, isPending, isConfirming, isConfirmed, error } = useBatchPay();
  const { isConnected, isOnBaseSepolia } = useWallet();
  const { toast } = useToast();

  const handleParsed = useCallback((data: ParsedCSV) => {
    setRecipients(data.recipients);
    setErrors(data.errors);
  }, []);

  const handleClear = useCallback(() => {
    setRecipients([]);
    setErrors([]);
  }, []);

  const handleBatchPay = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to execute batch payments.",
        variant: "destructive",
      });
      return;
    }

    if (!isOnBaseSepolia) {
      toast({
        title: "Wrong network",
        description: "Please switch to Base Sepolia testnet to execute payments.",
        variant: "destructive",
      });
      return;
    }

    try {
      await executeBatchPay(recipients);
    } catch (err) {
      toast({
        title: "Payment failed",
        description: "Failed to execute batch payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const summary = calculateTotals(recipients);
  const validRecipients = recipients.filter(r => r.isValid);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Create Payment</span>
            </div>
          </div>
        </section>

        {/* Header */}
        <section className="py-12">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Create Batch Payment
              </h1>
              <p className="text-lg text-muted-foreground">
                Add recipients via CSV upload or manual entry, then execute your batch payment
              </p>
            </div>
          </div>
        </section>

        <RecipientInput
          recipients={recipients}
          onRecipientsChange={setRecipients}
          onParsed={handleParsed}
          onClear={handleClear}
        />

        {recipients.length > 0 && (
          <>
            <PreviewTable recipients={recipients} errors={errors} />

            <section className="py-16">
              <div className="container">
                <div className="mx-auto max-w-lg space-y-6">
                  {/* Payment Summary */}
                  <div className="card-base">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Payment Summary</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Recipients</span>
                        <span className="font-medium text-foreground">{summary.recipientCount}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium text-foreground">{formatAmount(summary.totalAmount)} ETH</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          Protocol Fee (0.5%)
                          <Info className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-foreground">{formatAmount(summary.fee)} ETH</span>
                      </div>

                      <div className="my-4 h-px bg-border" />

                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total Required</span>
                        <span className="text-lg font-bold text-primary">{formatAmount(summary.totalRequired)} ETH</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBatchPay}
                    disabled={validRecipients.length === 0 || isPending || isConfirming || !isConnected}
                    className="btn-primary flex w-full items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {isConfirming ? 'Confirming...' : 'Processing...'}
                      </>
                    ) : isConfirmed ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Payment Successful!
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Execute Batch Payment
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-muted-foreground">
                    {!isConnected
                      ? "Connect your wallet to execute payment"
                      : !isOnBaseSepolia
                        ? "Switch to Base Sepolia testnet to execute payment"
                        : validRecipients.length === 0
                          ? "Add valid recipients to execute payment"
                          : "Ready to execute batch payment"
                    }
                  </p>

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span>Transaction failed: {error.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Create;
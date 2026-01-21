import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useWallet } from '@/hooks/useWallet';
import { useReadContract } from 'wagmi';
import { BATCH_PAY_ADDRESS, BATCH_PAY_ABI } from '@/config/contract';
import { formatEther } from 'viem';
import { ArrowLeft, History, Clock, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Batch {
  recipients: readonly `0x${string}`[];
  amounts: readonly bigint[];
  names: readonly string[];
  timestamp: bigint;
}

const HistoryPage = () => {
  const { address, isConnected } = useWallet();
  const [paymentHistory, setPaymentHistory] = useState<Batch[]>([]);

  const { data: historyData } = useReadContract({
    address: BATCH_PAY_ADDRESS,
    abi: BATCH_PAY_ABI,
    functionName: 'getPaymentHistory',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (historyData) {
      setPaymentHistory(historyData as Batch[]);
    }
  }, [historyData]);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateBatchTotal = (amounts: readonly bigint[]) => {
    return amounts.reduce((sum, amount) => sum + amount, 0n);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="py-6 bg-muted/30 sm:py-8">
          <div className="container px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Payment History</span>
            </div>
          </div>
        </section>

        {/* Header */}
        <section className="py-8 sm:py-12">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                Payment History
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                View all your batch payments and transaction details
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="container px-4 sm:px-6">
            {!isConnected ? (
              <div className="mx-auto max-w-sm text-center px-3 sm:max-w-md sm:px-4">
                <div className="mb-4 flex justify-center sm:mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted sm:h-12 sm:w-12 md:h-16 md:w-16">
                    <History className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6 md:h-8 md:w-8" />
                  </div>
                </div>
                <h2 className="mb-2 text-base font-semibold text-foreground sm:text-lg md:text-xl break-words">
                  Connect Your Wallet
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm md:text-base break-words">
                  Connect your wallet to view your payment history and transaction details.
                </p>
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="mx-auto max-w-sm text-center px-3 sm:max-w-md sm:px-4">
                <div className="mb-4 flex justify-center sm:mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted sm:h-12 sm:w-12 md:h-16 md:w-16">
                    <Clock className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6 md:h-8 md:w-8" />
                  </div>
                </div>
                <h2 className="mb-2 text-base font-semibold text-foreground sm:text-lg md:text-xl break-words">
                  No Payments Yet
                </h2>
                <p className="text-xs text-muted-foreground mb-4 sm:text-sm sm:mb-6 md:text-base break-words">
                  You haven't made any batch payments yet. Create your first payment to get started.
                </p>
                <Link to="/create" className="btn-primary inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-base break-words">
                  Create Payment
                </Link>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:mb-6 md:mb-8">
                  <h2 className="text-lg font-bold text-foreground sm:text-xl md:text-2xl break-words">
                    Your Payments ({paymentHistory.length})
                  </h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {paymentHistory.map((batch, index) => (
                    <div key={index} className="card-base p-3 sm:p-4 md:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground mb-1 sm:text-base md:text-lg break-words">
                            Batch Payment #{paymentHistory.length - index}
                          </h3>
                          <p className="text-xs text-muted-foreground sm:text-sm break-words">
                            {formatDate(batch.timestamp)}
                          </p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-1 sm:gap-0">
                          <p className="text-base font-bold text-primary sm:text-lg md:text-xl break-all">
                            {formatEther(calculateBatchTotal(batch.amounts))} ETH
                          </p>
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            {batch.recipients.length} recipients
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground flex items-center gap-2 text-sm sm:text-base">
                            <Users className="h-4 w-4" />
                            Recipients
                          </h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {batch.recipients.map((recipient, idx) => (
                              <div key={idx} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary flex-shrink-0 sm:h-6 sm:w-6">
                                    {idx + 1}
                                  </div>
                                  <span className="font-mono text-xs break-all sm:text-sm sm:truncate">
                                    {recipient}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0 sm:justify-end">
                                  <DollarSign className="h-3 w-3" />
                                  <span className="font-medium text-foreground text-xs sm:text-sm">
                                    {formatEther(batch.amounts[idx])} ETH
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Details</h4>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center py-1">
                              <span className="text-muted-foreground text-xs sm:text-sm">Total Recipients:</span>
                              <span className="font-medium text-xs sm:text-sm">{batch.recipients.length}</span>
                            </div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center py-1">
                              <span className="text-muted-foreground text-xs sm:text-sm">Total Amount:</span>
                              <span className="font-medium text-xs sm:text-sm break-all sm:break-normal">{formatEther(calculateBatchTotal(batch.amounts))} ETH</span>
                            </div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center py-1">
                              <span className="text-muted-foreground text-xs sm:text-sm">Transaction Date:</span>
                              <span className="font-medium text-xs sm:text-sm break-all sm:break-normal">{formatDate(batch.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
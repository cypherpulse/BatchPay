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
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Payment History</span>
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
                Payment History
              </h1>
              <p className="text-lg text-muted-foreground">
                View all your batch payments and transaction details
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container">
            {!isConnected ? (
              <div className="mx-auto max-w-md text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <History className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Connect Your Wallet
                </h2>
                <p className="text-muted-foreground">
                  Connect your wallet to view your payment history and transaction details.
                </p>
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="mx-auto max-w-md text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  No Payments Yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  You haven't made any batch payments yet. Create your first payment to get started.
                </p>
                <Link to="/create" className="btn-primary inline-flex items-center gap-2">
                  Create Payment
                </Link>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">
                    Your Payments ({paymentHistory.length})
                  </h2>
                </div>

                <div className="space-y-6">
                  {paymentHistory.map((batch, index) => (
                    <div key={index} className="card-base">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            Batch Payment #{paymentHistory.length - index}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(batch.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {formatEther(calculateBatchTotal(batch.amounts))} ETH
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {batch.recipients.length} recipients
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Recipients
                          </h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {batch.recipients.map((recipient, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                    {idx + 1}
                                  </div>
                                  <span className="font-mono text-xs truncate">
                                    {recipient}
                                  </span>
                                </div>
                                <span className="font-medium text-foreground flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {formatEther(batch.amounts[idx])} ETH
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-foreground mb-2">Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Recipients:</span>
                              <span className="font-medium">{batch.recipients.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Amount:</span>
                              <span className="font-medium">{formatEther(calculateBatchTotal(batch.amounts))} ETH</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Transaction Date:</span>
                              <span className="font-medium">{formatDate(batch.timestamp)}</span>
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
import { ArrowDown, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl sm:h-96 sm:w-96" />
      </div>

      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground sm:px-4 sm:py-2 sm:text-sm">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            Built on Base • Gas Efficient
          </div>

          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Pay your team in{' '}
            <span className="gradient-text">one transaction</span>
          </h1>

          <p className="mb-8 text-base text-muted-foreground sm:mb-10 sm:text-lg md:text-xl">
            BatchPay lets you send ETH to hundreds of recipients at once.
            Save on gas, track payments, and streamline your DAO operations.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/create"
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4"
            >
              Start Batch Payment
              <ArrowDown className="h-4 w-4" />
            </Link>
            <Link
              to="/history"
              className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4"
            >
              View Payment History
            </Link>
          </div>

          {/* Features */}
          <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-6 sm:grid-cols-3">
            <div className="card-base text-center p-4 sm:p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent sm:mb-4 sm:h-12 sm:w-12">
                <Zap className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground sm:mb-2">Gas Efficient</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Up to 200 payments in a single transaction
              </p>
            </div>

            <div className="card-base text-center p-4 sm:p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent sm:mb-4 sm:h-12 sm:w-12">
                <Shield className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground sm:mb-2">Secure</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Smart contract audited and battle-tested
              </p>
            </div>

            <div className="card-base text-center p-4 sm:p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent sm:mb-4 sm:h-12 sm:w-12">
                <Users className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground sm:mb-2">Team Ready</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Perfect for DAOs, teams, and contributors
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

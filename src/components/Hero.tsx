import { ArrowDown, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background" />
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl xs:h-64 xs:w-64 sm:h-80 sm:w-80 md:h-96 md:w-96" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl xs:h-64 xs:w-64 sm:h-80 sm:w-80 md:h-96 md:w-96" />
      </div>

      <div className="container px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground xs:px-3 xs:py-1.5 xs:text-xs sm:px-4 sm:py-2 sm:text-sm">
            <Zap className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
            Built on Base • Gas Efficient
          </div>

          <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-foreground xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Pay your team in{' '}
            <span className="gradient-text">one transaction</span>
          </h1>

          <p className="mb-6 text-sm text-muted-foreground xs:mb-8 xs:text-base sm:mb-10 sm:text-lg md:text-xl">
            BatchPay lets you send ETH to hundreds of recipients at once.
            Save on gas, track payments, and streamline your DAO operations.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/create"
              className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold xs:px-6 xs:py-3.5 xs:text-base sm:px-8 sm:py-4"
            >
              Start Batch Payment
              <ArrowDown className="h-4 w-4" />
            </Link>
            <Link
              to="/history"
              className="btn-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold xs:px-6 xs:py-3.5 xs:text-base sm:px-8 sm:py-4"
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

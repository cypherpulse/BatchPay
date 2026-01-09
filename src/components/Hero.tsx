import { ArrowDown, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-background" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
            <Zap className="h-4 w-4" />
            Built on Base • Gas Efficient
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Pay your team in{' '}
            <span className="gradient-text">one transaction</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            BatchPay lets you send ETH to hundreds of recipients at once.
            Save on gas, track payments, and streamline your DAO operations.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/create"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Start Batch Payment
              <ArrowDown className="h-4 w-4" />
            </Link>
            <Link
              to="/history"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              View Payment History
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div className="card-base text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Gas Efficient</h3>
              <p className="text-sm text-muted-foreground">
                Up to 200 payments in a single transaction
              </p>
            </div>

            <div className="card-base text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Secure</h3>
              <p className="text-sm text-muted-foreground">
                Smart contract audited and battle-tested
              </p>
            </div>

            <div className="card-base text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Team Ready</h3>
              <p className="text-sm text-muted-foreground">
                Perfect for DAOs, teams, and contributors
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

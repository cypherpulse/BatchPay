import { Wallet, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">BatchPay</span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Built on Base • 0.5% protocol fee
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/cypherpulse/BatchPay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Contract: 0x734F0a9683193fc65C1Ec417EeF707c861f9f6F6</p>
          <p className="mt-1">Base Sepolia Testnet</p>
        </div>
      </div>
    </footer>
  );
}

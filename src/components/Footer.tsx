import { Wallet, Github, Twitter, ExternalLink, Copy, Shield, Lock, CheckCircle, Discord, MessageSquare, FileText } from 'lucide-react';

export function Footer() {
  const contractAddress = "0x734F0a9683193fc65C1Ec417EeF707c861f9f6F6";
  
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container">
        {/* Logo & Social */}
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
            <a href="https://github.com/cypherpulse/BatchPay" className="...">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" className="...">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="...">
              <Discord className="h-5 w-5" />
            </a>
            <a href="#" className="...">
              <MessageSquare className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="...">
            How It Works
          </a>
          <a href="#security" className="...">
            Security
          </a>
          <a href="#faq" className="...">
            FAQ
          </a>
          <a href="/privacy" className="...">
            Privacy
          </a>
          <a href="/terms" className="...">
            Terms
          </a>
        </div>

        {/* Contract Address */}
        <div className="mt-8 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://sepolia.basescan.org/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-foreground hover:bg-accent/80 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View on Basescan
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(contractAddress)}
              className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs text-foreground hover:bg-accent/80 transition-colors"
            >
              <Copy className="h-3 w-3" />
              Copy Address
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Contract: {contractAddress}</p>
            <p className="mt-1 text-xs text-muted-foreground">Base Sepolia Testnet</p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium">Audited</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Lock className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium">Open Source</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <CheckCircle className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium">Verified Contract</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BatchPay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

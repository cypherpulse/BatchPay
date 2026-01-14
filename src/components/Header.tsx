import { ConnectKitButton } from 'connectkit'
import { Wallet, Menu, X } from 'lucide-react';
import { NetworkSwitcher } from './NetworkSwitcher';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/create', label: 'Create Payment' },
    { path: '/history', label: 'History' },
    { path: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary xs:h-8 xs:w-8 sm:h-9 sm:w-9">
            <Wallet className="h-3.5 w-3.5 text-primary-foreground xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="text-base font-bold text-foreground xs:text-lg sm:text-xl">BatchPay</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-medium transition-colors hover:text-foreground sm:text-sm ${
                location.pathname === item.path
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <NetworkSwitcher />
          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress, ensName }) => {
              return (
                <button
                  onClick={show}
                  className="btn-primary hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold xs:px-3 xs:py-2.5 xs:text-sm md:px-4"
                >
                  <Wallet className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                  <span className="hidden lg:inline">
                    {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
                  </span>
                  <span className="lg:hidden">
                    {isConnected ? "Connected" : "Connect"}
                  </span>
                </button>
              );
            }}
          </ConnectKitButton.Custom>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4 xs:h-5 xs:w-5" />
            ) : (
              <Menu className="h-4 w-4 xs:h-5 xs:w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <nav className="container py-3 px-4 sm:px-6">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors xs:px-4 xs:py-3 xs:text-base ${
                    location.pathname === item.path
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-border">
                <ConnectKitButton.Custom>
                  {({ isConnected, show, truncatedAddress, ensName }) => {
                    return (
                      <button
                        onClick={() => {
                          show();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full btn-primary flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold xs:py-3.5"
                      >
                        <Wallet className="h-4 w-4" />
                        {isConnected ? (ensName ?? truncatedAddress) : "Connect Wallet"}
                      </button>
                    );
                  }}
                </ConnectKitButton.Custom>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { config } from './config/wagmi'
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <ConnectKitProvider
        options={{
          enforceSupportedChains: true,
          initialChainId: 84532, // Base Sepolia testnet
          walletConnectCTA: 'link',
          hideNoWalletCTA: true
        }}
      >
        <App />
      </ConnectKitProvider>
    </WagmiProvider>
  </QueryClientProvider>
);

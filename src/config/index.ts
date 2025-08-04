import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// Get projectId from environment variables with fallback
export const projectId = `3feca6b09ac413e651ce2257b9cda678`;

export const etherlinkTestnet = {
  id: 128123,
  name: "Etherlink Testnet",
  chainNamespace: "eip155",
  nativeCurrency: {
    name: "Tezos",
    symbol: "XTZ",
    decimals: 18, // Note: Although Tezos natively uses 6 decimals, Etherlink is EVM-compatible, so 18 is likely correct here.
  },
  rpcUrls: {
    default: { http: ["https://node.ghostnet.etherlink.com"] },
    public: { http: ["https://node.ghostnet.etherlink.com"] },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Explorer",
      url: "https://testnet.explorer.etherlink.com",
    },
  },
};

export const networks = [etherlinkTestnet];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: projectId || "demo-project-id", // Ensure we always have a fallback
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

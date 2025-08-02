"use client";

import {
  wagmiAdapter,
  projectId,
  networks,
  pharosDevnet,
  pharosTestnet,
} from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Set up metadata
const metadata = {
  name: "openwave",
  description: "An Open Source Issue Solving Platform",
  url: "https://openwave.tech",
  icons: ["https://openwave.tech/NeowareLogo2.png"],
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [pharosDevnet, pharosTestnet],
  defaultNetwork: networks[0],
  metadata: metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;

export const bitkubTestnet = {
  id: 25925,
  network: "Bitkub Chain Testnet",
  name: "Bitkub Chain Testnet",
  nativeCurrency: {
    name: "KUB",
    symbol: "KUB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.bitkubchain.io"],
    },
    public: {
      http: ["https://rpc-testnet.bitkubchain.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "testnet bkcscan",
      url: "https://testnet.bkcscan.com ",
    },
  },
};

export const bitkubMainnet = {
  id: 96,
  network: "Bitkub Chain",
  name: "Bitkub Chain",
  nativeCurrency: {
    name: "KUB",
    symbol: "KUB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bitkubchain.io"],
    },
    public: {
      http: ["https://rpc.bitkubchain.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Bkcscan",
      url: "https://bkcscan.com",
    },
  },
};

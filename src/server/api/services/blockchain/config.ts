export const bitkub = {
  id: 96,
  name: "Bitkub Chain",
  network: "Bitkub Chain",
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
    etherscan: {
      name: "Bkcscan",
      url: "https://bkcscan.com",
    },
    default: {
      name: "Bkcscan",
      url: "https://bkcscan.com",
    },
  },
};

import { createPublicClient, http } from "viem";
import { bitkub } from "./config";

export const publicClient = createPublicClient({
  chain: bitkub,
  transport: http(),
});

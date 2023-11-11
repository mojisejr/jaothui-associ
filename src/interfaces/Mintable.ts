import { type Address } from "viem";

export interface Mintable {
  mintable: { wallet: Address; role: string }[];
  count: number;
}

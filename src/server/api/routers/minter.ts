import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { z } from "zod";
import { getMintableWallet, mintNFT } from "../services/minter/minter.service";
import { type Address } from "viem";

export const minterRouter = createTRPCRouter({
  getMintable: publicProcedure.query(async () => {
    try {
      const mintable = await getMintableWallet();
      // if (mintable!.mintable.length <= 0) {
      //   throw new TRPCError({ code: "BAD_REQUEST" });
      // }
      return mintable;
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),
  mint: adminProcedure
    .input(
      z.object({ wallet: z.string(), to: z.string(), mintingKey: z.string() })
    )
    .mutation(async ({ input }) => {
      try {
        const minted = await mintNFT(input.to as Address, input.mintingKey);
        if (!minted) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        }
        return minted;
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

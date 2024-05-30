import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  approve,
  getCertificationOf,
  getWaitForApprovementRequests,
  isApprover,
  saveRequestForPed,
} from "../services/metadata/metadata.service";
import { z } from "zod";
import { getMetadataByMicrochip } from "../services/blockchain/Metadata/read";

export const certificationRouter = createTRPCRouter({
  saveRequestForPed: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        buffaloId: z.string(),
        ownerName: z.string(),
        bornAt: z.string(),
        momId: z.string().optional(),
        dadId: z.string().optional(),
        mGrandmaId: z.string().optional(),
        mGrandpaId: z.string().optional(),
        dGrandmaId: z.string().optional(),
        dGrandpaId: z.string().optional(),
        slipUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await saveRequestForPed(input);
    }),
  getWaitForApprove: publicProcedure
    .input(z.object({ approver: z.string(), approverPosition: z.number() }))
    .query(async ({ input }) => {
      return await getWaitForApprovementRequests(
        input.approver,
        input.approverPosition
      );
    }),
  getMetadataByMicrochip: publicProcedure
    .input(z.object({ microchip: z.string() }))
    .query(async ({ input }) => {
      return await getMetadataByMicrochip(input.microchip);
    }),
  isApprover: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await isApprover(input.wallet);
    }),
  approve: publicProcedure
    .input(
      z.object({
        approverWallet: z.string(),
        approverPosition: z.number(),
        microchip: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await approve(
        input.approverWallet,
        input.approverPosition,
        input.microchip
      );
    }),
  getCert: publicProcedure
    .input(z.object({ microchip: z.string() }))
    .query(async ({ input }) => {
      return await getCertificationOf(input.microchip);
    }),
});

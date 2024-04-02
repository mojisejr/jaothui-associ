import { createTRPCRouter, publicProcedure } from "../trpc";
import { getAllMetadata } from "../services/blockchain/Metadata/read";
import { Metadata } from "~/interfaces/Metadata";
import { parseMetadataForCertificate } from "../utils/parseMetadataForCertificate";
import {
  approve,
  filterCertificateByApprover,
  getCertificationInfo,
  isApprover,
} from "../services/metadata/metadata.service";
import { z } from "zod";

export const certificationRouter = createTRPCRouter({
  getAllMetadata: publicProcedure
    .input(z.object({ wallet: z.string() }))
    .query(async ({ input }) => {
      if (!(await isApprover(input.wallet))) return [];
      //get all metadata
      const metadata = (await getAllMetadata()) as Metadata[];
      //parsed metadata to get some out of all column
      const parsedMetadata = parseMetadataForCertificate(metadata);
      //mapped on-chain and off-chain data
      const mappedMetadata = await getCertificationInfo(parsedMetadata);
      //filter out activated by connecting approver
      const filteredMetadata = filterCertificateByApprover(
        input.wallet,
        mappedMetadata
      );
      return filteredMetadata;
    }),
  isApprover: publicProcedure
    .input(z.object({ wallet: z.string() }))
    .query(async ({ input }) => {
      return await isApprover(input.wallet);
    }),
  approve: publicProcedure
    .input(z.object({ wallet: z.string(), microchip: z.string() }))
    .mutation(async ({ input }) => {
      return await approve(input.wallet, input.microchip);
    }),
});

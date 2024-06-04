import { createTRPCRouter, publicProcedure } from "../trpc";
import { getTotalPedigrees } from "../services/blockchain/pedigrees/read";
import { getMetadataByMicrochip } from "../services/blockchain/Metadata/read";
import { z } from "zod";
import { isApproved } from "../services/metadata/metadata.service";

export const pedigreeRouter = createTRPCRouter({
  totalPedigrees: publicProcedure.query(async ({ ctx }) => {
    const supply = await getTotalPedigrees();
    return supply;
  }),

  getByMicrochip: publicProcedure
    .input(z.object({ microchip: z.string() }))
    .mutation(async ({ input }) => {
      return await getMetadataByMicrochip(input.microchip);
    }),
  getByMicrochipForPedigreeRequest: publicProcedure
    .input(z.object({ microchip: z.string(), type: z.number() }))
    .mutation(async ({ input }) => {
      const data = await getMetadataByMicrochip(input.microchip);
      const hasRequest = await isApproved(input.microchip);

      if (hasRequest && data != undefined && input.type == 0) {
        return {
          message: `${data.name} ส่งคำร้องเรียบร้อยแล้ว`,
          isApproved: true,
        };
      } else {
        return {
          message: "OK",
          isApproved: false,
          ...data,
        };
      }
    }),
});

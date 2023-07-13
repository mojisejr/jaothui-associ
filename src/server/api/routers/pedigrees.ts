import { createTRPCRouter, publicProcedure } from "../trpc";
import { getTotalPedigrees } from "../services/blockchain/pedigrees/read";

export const pedigreeRouter = createTRPCRouter({
  totalPedigrees: publicProcedure.query(async ({ ctx }) => {
    const supply = await getTotalPedigrees();
    return supply;
  }),
});

import { Farm } from "@prisma/client";
import { publicProcedure, createTRPCRouter } from "../trpc";

export const farmRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const farms: Farm[] = await ctx.prisma.farm.findMany();
    return farms;
  }),
});

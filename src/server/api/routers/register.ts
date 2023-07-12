import { TRPCError } from "@trpc/server";
import { getUser } from "../services/getUser";
import { createTRPCRouter } from "../trpc";
import { publicProcedure } from "../trpc";
import { z } from "zod";

export const regiterRoute = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        name: z.string().nullable(),
        farmName: z.string().nullable(),
        wallet: z.string(),
        address: z.string(),
        lat: z.number().nullable(),
        lon: z.number().nullable(),
        lineId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userData = await getUser(input.accessToken);
      if (userData.wallet == undefined) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      } else if (userData.wallet != input.wallet) {
        throw new TRPCError({ code: "NOT_FOUND" });
      } else {
        await ctx.prisma.user.create({
          data: {
            name: input.name,
            farmName: input.farmName,
            wallet: input.wallet,
            address: input.address,
            lat: input.lat,
            lon: input.lon,
            lineId: input.lineId,
          },
        });
      }
    }),
});

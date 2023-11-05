import { type Farm } from "@prisma/client";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const farmRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const farms: Farm[] = await ctx.prisma.farm.findMany();
    return farms;
  }),
  getById: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findFirst({
          where: { wallet: input.wallet },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `User ${input.wallet} not found!`,
          });
        }

        const farms = await ctx.prisma.farm.findMany({
          where: {
            userId: user.id,
          },
        });

        return farms;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `cannot get ${input.wallet}'s farms`,
        });
      }
    }),
  updateFarmInfo: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        name: z.string(),
        url: z.string(),
        lat: z.number().nullable(),
        lon: z.number().nullable(),
        address: z.string(),
        tel: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findFirst({
          where: {
            wallet: input.wallet,
            active: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `User ${input.wallet} not found!`,
          });
        }

        const created = await ctx.prisma.farm.create({
          data: {
            userId: user.id,
            name: input.name,
            lat: input.lat! ?? 0,
            lon: input.lon! ?? 0,
            description: input.address,
            tel: input.tel!,
            locationUrl: input.url,
          },
        });
        return created;
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  deleteFarm: publicProcedure
    .input(z.object({ farmId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.farm.delete({
          where: {
            id: input.farmId,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `delete farm Id: ${input.farmId} failed`,
        });
      }
    }),
});

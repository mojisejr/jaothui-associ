import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  getAllMicrochips,
  getAvaliableMicrochip,
  markMicrochipAsActive,
  markMicrochipAsSold,
} from "../services/microchip";
import { z } from "zod";
import { getMicrochipOrderOf } from "../services/microchip/orders";

// wallet,
// farmId,
// shippingAddress,
// slipUrl: result.path,
// buffaloName: data.name,
// buffaloOrigin: data.origin,
// buffaloBithday: new Date(data.birthday).getTime().toString(),
// buffaloColor: data.color,
// buffaloSex: data.sex,
// buffaloHeight: data.height,
// buffaloIpfsUrl: ipfs,

export const microchipRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx, input }) => {
    try {
      const microchips = await getAllMicrochips();
      return { microchips, count: microchips.length };
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "microchips not found",
      });
    }
  }),

  get: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const microchips = await getMicrochipOrderOf(input.wallet);
        return microchips;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "microchips not found",
        });
      }
    }),
  buy: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        farmId: z.number(),
        shippingAddress: z.string(),
        slipUrl: z.string(),
        buffaloName: z.string(),
        buffaloBirthday: z.string(),
        buffaloColor: z.string(),
        buffaloSex: z.string(),
        buffaloHeight: z.number().nullable(),
        buffaloIpfsUrl: z.string(),
        buffaloOrigin: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        //1. get avaliable microchip
        const microchip = await getAvaliableMicrochip();

        if (!microchip) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Microchip is out of stock, Please contact team",
          });
        }

        //2. save to database
        const created = await ctx.prisma.microchipOrder.create({
          data: {
            wallet: input.wallet,
            farmId: input.farmId,
            buffaloName: input.buffaloName,
            buffaloBirthday: input.buffaloBirthday,
            buffaloColor: input.buffaloColor,
            buffaloHeight: input.buffaloHeight?.toString() ?? "0",
            buffaloipfsUrl: input.buffaloIpfsUrl,
            buffaloOrigin: input.buffaloOrigin ?? "thai",
            buffaloSex: input.buffaloSex,
            microchipId: microchip.microchip,
            slipUrl: input.slipUrl,
            shippingAddress: input.shippingAddress,
          },
        });

        if (!created) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "saving orders failed",
          });
        }

        //3. marked microchip as used
        const marked = await markMicrochipAsSold(microchip.id);

        if (!marked) {
          //delete added data if it failed to avoid the confilt
          await ctx.prisma.microchipOrder.delete({
            where: {
              id: created.id,
            },
          });
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "marking as sold failed",
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "buying processing failed, contact team",
        });
      }
    }),
  activate: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const marked = await markMicrochipAsActive(input.id);
        if (!marked) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `cannot activite #${input.id.toString()}`,
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "activation funciton failed, contact team",
        });
      }
    }),
});

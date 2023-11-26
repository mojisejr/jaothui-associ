import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  checkIfHasMicrochip,
  getAllMicrochips,
  getAvaliableMicrochip,
  markMicrochipAsActive,
  markMicrochipAsSold,
} from "../services/microchip";
import { z } from "zod";
import { getMicrochipOrderOf } from "../services/microchip/orders";
import { microchipPaymentNotify } from "../services/line/notify";
import { getMicrochipSlipUrl } from "~/server/supabase";

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
  buyOnline: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
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
            buffaloName: input.buffaloName,
            buffaloBirthday: input.buffaloBirthday,
            buffaloColor: input.buffaloColor,
            buffaloHeight: input.buffaloHeight?.toString() ?? "0",
            buffaloipfsUrl: input.buffaloIpfsUrl,
            buffaloOrigin: input.buffaloOrigin ?? "thai",
            buffaloSex: input.buffaloSex,
            microchipId: microchip.microchip,
            slipUrl: input.slipUrl.trim(),
            shippingAddress: input.shippingAddress,
            timestamp: new Date(),
          },
        });

        if (!created) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "saving orders failed",
          });
        }

        await microchipPaymentNotify({
          wallet: input.wallet,
          name: input.buffaloName,
          microchip: microchip.microchip,
          slipUrl: getMicrochipSlipUrl(input.slipUrl.trim()).data.publicUrl,
        });

        //3. marked microchip as used
        const marked = await markMicrochipAsSold(microchip.microchip);

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

  buyAndInstallHere: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        slipUrl: z.string(),
        buffaloName: z.string(),
        buffaloBirthday: z.string(),
        buffaloColor: z.string(),
        buffaloSex: z.string(),
        buffaloHeight: z.number().nullable(),
        buffaloIpfsUrl: z.string(),
        buffaloOrigin: z.string().nullable(),
        microchipId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        //1. get avaliable microchip
        // const microchip = await getAvaliableMicrochip();
        const canInstall = await checkIfHasMicrochip(input.microchipId);

        if (!canInstall) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Microchip is not in stock, Please contact team",
          });
        }

        //2. save to database
        const created = await ctx.prisma.microchipOrder.create({
          data: {
            wallet: input.wallet,
            shippingAddress: "on-site",
            approved: true,
            shipped: true,
            buffaloName: input.buffaloName,
            buffaloBirthday: input.buffaloBirthday,
            buffaloColor: input.buffaloColor,
            buffaloHeight: input.buffaloHeight?.toString() ?? "0",
            buffaloipfsUrl: input.buffaloIpfsUrl,
            buffaloOrigin: input.buffaloOrigin ?? "thai",
            buffaloSex: input.buffaloSex,
            microchipId: input.microchipId,
            slipUrl: input.slipUrl.trim(),
            timestamp: new Date(),
          },
        });

        if (!created) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "saving orders failed",
          });
        }

        await microchipPaymentNotify({
          wallet: input.wallet,
          name: input.buffaloName,
          microchip: input.microchipId,
          slipUrl: getMicrochipSlipUrl(input.slipUrl.trim()).data.publicUrl,
        });

        //3. marked microchip as used and installed on site
        const marked = await markMicrochipAsSold(input.microchipId);
        const installed = await markMicrochipAsActive(input.microchipId);

        if (!marked || !installed) {
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
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "buying processing failed, contact team",
        });
      }
    }),
  activate: publicProcedure
    .input(
      z.object({
        microchip: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const marked = await markMicrochipAsActive(input.microchip);
        if (!marked) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `cannot activite #${input.microchip}`,
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

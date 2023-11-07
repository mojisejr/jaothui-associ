import { createTRPCRouter, adminProcedure } from "../trpc";
import { z } from "zod";
import { supabase } from "~/server/supabase";
import { getDaysPassedSincePaid } from "../utils/getDaysPassedSincePaid";
import { TRPCError } from "@trpc/server";
import {
  approveMicrochipPayment,
  approveShipping,
  getNotCompleteMicrochipOrders,
} from "../services/microchip/orders";
import { addMicrochips } from "../services/microchip";

export const adminRouter = createTRPCRouter({
  getWaitForPaymentApproval: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const payments = await ctx.prisma.payment.findMany({
        where: {
          active: false,
          approvedCount: {
            lt: 1,
          },
          NOT: {
            OR: [
              {
                approver: {
                  has: input.wallet,
                },
              },
              {
                rejector: {
                  has: input.wallet,
                },
              },
            ],
          },
        },
        include: {
          User: true,
        },
      });

      if (payments.length <= 0) {
        return [];
      } else {
        const result = payments.map((m) => {
          return {
            ...m,
            slipUrl: supabase.storage
              .from("slipstorage")
              .getPublicUrl(m.slipUrl.split("\n")[0] as string).data.publicUrl,
          };
        });
        return result;
      }
    }),

  approveUserPayment: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
        target: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated = await ctx.prisma.payment.updateMany({
        data: {
          approvedCount: {
            increment: 1,
          },
          approver: {
            push: input.wallet,
          },
        },
        where: {
          wallet: input.target,
          active: false,
          approvedCount: {
            lt: 1,
          },
          NOT: {
            approver: {
              has: input.wallet,
            },
            rejector: {
              has: input.wallet,
            },
          },
        },
      });

      if (updated.count > 0) {
        const activated = await ctx.prisma.payment.updateMany({
          data: {
            start: new Date(),
            active: true,
          },
          where: {
            wallet: input.target,
            approvedCount: {
              gte: 1,
            },
          },
        });

        if (activated.count > 0) {
          return activated;
        }
      } else {
        return updated;
      }
    }),
  rejectUserPayment: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
        target: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated = await ctx.prisma.payment.updateMany({
        data: {
          rejectedCount: {
            increment: 1,
          },
          rejector: {
            push: input.wallet,
          },
        },
        where: {
          wallet: input.target,
          active: false,
          rejectedCount: {
            lt: 1,
          },
          NOT: {
            approver: {
              has: input.wallet,
            },
            rejector: {
              has: input.wallet,
            },
          },
        },
      });

      if (updated.count > 0) {
        const rejected = await ctx.prisma.payment.updateMany({
          data: {
            start: new Date(),
            active: false,
          },
          where: {
            wallet: input.target,
            rejectedCount: {
              gte: 1,
            },
          },
        });
        if (rejected.count > 0) {
          return rejected;
        }
      } else {
        return updated;
      }
    }),
  getWaitForApprovement: adminProcedure
    .input(z.object({ accessToken: z.string(), wallet: z.string() }))
    .query(async ({ input, ctx }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          active: false,
          NOT: {
            approved: {
              has: input.wallet,
            },
          },
        },
        include: {
          payment: {
            where: {
              active: true,
            },
          },
        },
      });

      const usersWithDaysPassed = users
        .map((user) => ({
          ...user,
          daysPassed: getDaysPassedSincePaid(user.payment[0]?.start as Date),
        }))
        .filter((user) => user.payment[0]?.active == true);

      if (usersWithDaysPassed.length <= 0) {
        return [];
      } else {
        return usersWithDaysPassed;
      }
    }),
  approveUser: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
        target: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated = await ctx.prisma.user.updateMany({
        data: {
          approvedCount: {
            increment: 1,
          },
          approved: {
            push: input.wallet,
          },
        },
        where: {
          wallet: input.target,
          approvedCount: {
            lte: 1,
          },
          NOT: {
            approved: {
              has: input.wallet,
            },
          },
        },
      });

      if (updated.count > 0) {
        const activated = await ctx.prisma.user.updateMany({
          data: {
            active: true,
          },
          where: {
            wallet: input.target,
            approvedCount: {
              gte: 1,
            },
          },
        });
        if (activated.count > 0) {
          return activated;
        }
      } else {
        return updated;
      }
    }),
  rejectUser: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
        target: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.updateMany({
        data: {
          approved: {
            push: input.wallet,
          },
        },
        where: {
          wallet: input.target,
          NOT: {
            approved: {
              has: input.wallet,
            },
          },
        },
      });
    }),
  //microchip manager
  getNotCompleteMicrochip: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
      })
    )
    .query(async ({ ctx }) => {
      try {
        const microchips = await getNotCompleteMicrochipOrders();
        return microchips;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "microchip loading failed",
        });
      }
    }),
  addMicrochips: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
        microchipIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const output = await addMicrochips(input.microchipIds);
        if (output.count <= 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "microchip data insertion failed",
          });
        }
        return output;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "cannot add microchips, contact team",
        });
      }
    }),
  approveMicrochipPayment: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const approved = await approveMicrochipPayment(
          input.orderId,
          input.wallet
        );
        if (!approved) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "payment approval failed",
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "payment approval failed, contact team",
        });
      }
    }),
  confirmShipping: adminProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
        orderId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const shipped = await approveShipping(input.orderId, input.wallet);
        if (!shipped) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "shipping marking failed",
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "shipping marking failed, contact team",
        });
      }
    }),
});

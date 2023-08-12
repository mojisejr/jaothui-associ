import { TRPCError } from "@trpc/server";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { z } from "zod";
import { supabase } from "~/server/supabase";
import { getDaysPassedSincePaid } from "../utils/getDaysPassedSincePaid";

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
            lt: 3,
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
            lt: 3,
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

      if (!updated) {
        const activated = await ctx.prisma.payment.updateMany({
          data: {
            start: new Date(),
            active: true,
          },
          where: {
            wallet: input.wallet,
            approvedCount: {
              gte: 3,
            },
          },
        });
        if (!activated) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        } else {
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
            lt: 3,
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

      if (!updated) {
        const rejected = await ctx.prisma.payment.updateMany({
          data: {
            start: new Date(),
            active: false,
          },
          where: {
            wallet: input.wallet,
            rejectedCount: {
              gte: 3,
            },
          },
        });
        if (!rejected) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        } else {
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
            lte: 3,
          },
          NOT: {
            approved: {
              has: input.wallet,
            },
          },
        },
      });

      if (!updated) {
        const activated = await ctx.prisma.user.updateMany({
          data: {
            active: true,
          },
          where: {
            wallet: input.wallet,
            approvedCount: {
              gte: 3,
            },
          },
        });
        if (!activated) {
          throw new TRPCError({ code: "BAD_REQUEST" });
        } else {
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
});

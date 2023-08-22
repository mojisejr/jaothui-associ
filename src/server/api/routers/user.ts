import { TRPCError } from "@trpc/server";
import { createTRPCRouter } from "../trpc";
import { publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  userCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.user.count();
    return count;
  }),

  isRegistered: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const registered = await ctx.prisma.user.findFirst({
        where: { wallet: input.wallet },
      });

      if (registered != null && registered.wallet == input.wallet) {
        return true;
      } else {
        return false;
      }
    }),
  get: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        wallet: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { wallet: input.wallet },
        include: {
          payment: true,
        },
      });

      if (user != null) {
        return user;
      } else {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),
  getActiveUsers: publicProcedure
    .input(z.object({ page: z.number().default(1) }))
    .query(async ({ input, ctx }) => {
      const count = await ctx.prisma.user.count();
      //100 perpage
      const itemsPerPage = 100;
      const totalPages = count / itemsPerPage;
      const startPosition = input.page * itemsPerPage;

      const users = await ctx.prisma.user.findMany({
        skip: totalPages < startPosition - 1 ? startPosition : totalPages,
        take: itemsPerPage,
        where: {
          active: true,
        },
        include: {
          payment: true,
        },
      });

      return { users, totalPages };
    }),
  getById: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.user.findFirst({
        where: {
          wallet: input.text,
        },
        include: {
          payment: true,
        },
      });
      return result;
    }),
  getUsersByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input.name,
              },
            },
            {
              wallet: {
                contains: input.name,
              },
            },
          ],
        },
        include: {
          payment: true,
        },
      });

      return users;
    }),
});

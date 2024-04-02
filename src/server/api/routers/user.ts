import { TRPCError } from "@trpc/server";
import { createTRPCRouter } from "../trpc";
import { publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { getDaysPassedSincePaid } from "../utils/getDaysPassedSincePaid";
import { warn } from "console";
import {
  getMemberByMemberId,
  updateWallet,
} from "../services/minter/minter.service";

export const userRouter = createTRPCRouter({
  //@dev: get user memberId
  getMemberId: publicProcedure
    .input(
      z.object({
        memberId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await getMemberByMemberId(input.memberId);
    }),
  //@dev: update memberId to wallet
  updateWallet: publicProcedure
    .input(
      z.object({ memberId: z.string(), wallet: z.string(), key: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      return await updateWallet(input.memberId, input.wallet, input.key);
    }),
  //@Dev: Get user count
  userCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.user.count();
    return count;
  }),
  //@Dev: Check if user is registered or not
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
  //@Dev: get user by wallet
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
  //@Dev: get all active users
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
  //@Dev: get all waitForApprovementUser
  getWaitForApprovementUsers: publicProcedure.query(async ({ input, ctx }) => {
    const users = await ctx.prisma.user.findMany({
      where: {
        active: false,
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
  //@Dev: searhUserByWallet
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
  //@Dev: searchUserByName or Wallet
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
  updateAvatar: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        filename: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        data: { avatar: input.filename! },
        where: { wallet: input.wallet },
      });
    }),
  updateName: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        data: { name: input.name },
        where: { wallet: input.wallet },
      });
    }),
  updateAddr: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        addr: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        data: { address: input.addr },
        where: { wallet: input.wallet },
      });
    }),
  updateTel: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        tel: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        data: { tel: input.tel },
        where: { wallet: input.wallet },
      });
    }),
  updateEmail: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        data: { email: input.email },
        where: { wallet: input.wallet },
      });
    }),
});

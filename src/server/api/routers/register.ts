import { TRPCError } from "@trpc/server";
import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { registrationNotify } from "../services/line/notify";

export const registerRouter = createTRPCRouter({
  register: protectedProcedure
    .input(
      z.object({
        accessToken: z.string(),
        name: z.string().nullable(),
        wallet: z.string(),
        address: z.string(),
        province: z.string(),
        email: z.string().nullable(),
        payment: z.string(),
        tel: z.string(),
        slipUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.prisma.user.create({
        data: {
          name: input.name,
          wallet: input.wallet,
          address: input.address,
          province: input.province,
          email: input.email,
          tel: input.tel,
          payment: {
            create: {
              wallet: input.wallet,
              isLifeTime: input.payment == "2" ? true : false,
              active: false,
              slipUrl: input.slipUrl,
              start: new Date(),
              end:
                input.payment == "2"
                  ? null
                  : new Date(
                      new Date().setFullYear(new Date().getFullYear() + 1)
                    ),
            },
          },
        },
      });
      if (!created) {
        throw new TRPCError({ code: "FORBIDDEN" });
      } else {
        await registrationNotify({
          wallet: input.wallet,
          isLifeTime: input.payment,
          name: input.name,
        });
        return created;
      }
    }),
});

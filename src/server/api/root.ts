import { createTRPCRouter } from "~/server/api/trpc";
import { registerRouter } from "./routers/register";
import { userRouter } from "./routers/user";
import { pedigreeRouter } from "./routers/pedigrees";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  register: registerRouter,
  user: userRouter,
  pedigrees: pedigreeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

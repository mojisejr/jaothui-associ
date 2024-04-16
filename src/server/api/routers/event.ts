import { TRPCError } from "@trpc/server";
import { getAllEvents } from "../services/sanity/event.service";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  getEvents: publicProcedure.query(async () => {
    try {
      return await getAllEvents();
    } catch (error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot Get Events",
      });
    }
  }),
});

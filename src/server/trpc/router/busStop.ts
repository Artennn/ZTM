import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const busStopRouter = router({
  get: protectedProcedure
    .input(
      z
        .object({
          name: z.string(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const query = input
        ? { where: { name: { contains: input.name } } }
        : undefined;
      const busStops = await ctx.prisma.busStop.findMany({
        ...query,
      });
      return busStops;
    }),
  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        gpsX: z.number(),
        gpsY: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, gpsX, gpsY } = input;
      const result = await ctx.prisma.busStop.create({
        data: {
          name,
          gpsX,
          gpsY,
        },
      });
      return result;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        gpsX: z.number(),
        gpsY: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name, gpsX, gpsY } = input;
      const result = await ctx.prisma.busStop.update({
        where: {
          id: id,
        },
        data: {
          name,
          gpsX,
          gpsY,
        },
      });
      return result;
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const id = input;
      const result = await ctx.prisma.busStop.delete({
        where: {
          id: id,
        },
      });
      return result;
    }),
});

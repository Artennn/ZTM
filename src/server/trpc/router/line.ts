import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

import { Prisma } from "@prisma/client";
import { newLineValidator } from "components/line/LineEditor";

const includeFullLine = Prisma.validator<Prisma.LineInclude>()({
  routes: {
    include: {
      entries: {
        include: {
          busStop: true,
        },
      },
    },
  },
});

export type Line = Prisma.LineGetPayload<{
  include: typeof includeFullLine;
}>;

export const lineRouter = router({
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
      const lines = await ctx.prisma.line.findMany({
        ...query,
        include: { ...includeFullLine },
      });
      return lines;
    }),
  add: protectedProcedure
    .input(newLineValidator)
    .mutation(async ({ input, ctx }) => {
      return !!(await ctx.prisma.line.create({
        data: {
          name: input.name,
          routes: {
            create: input.routes.map((route) => ({
              name: route.name,
              entries: {
                create: route.entries.map((entry) => ({
                  busStopID: entry.busStop.id,
                  estimatedTime: entry.estimatedTime,
                })),
              },
            })),
          },
        },
      }));
    }),
});

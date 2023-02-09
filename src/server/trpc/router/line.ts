import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

import { Prisma } from "@prisma/client";
import { newLineValidator } from "components/line/LineEditor";

export const includeFullLine = Prisma.validator<Prisma.LineInclude>()({
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
    //
    .input(z.number().optional())
    .query(async ({ input, ctx }) => {
      if (!input) return undefined;
      const line = await ctx.prisma.line.findUnique({
        where: {
          id: input,
        },
        include: { ...includeFullLine },
      });
      return line || undefined;
    }),
  getMany: protectedProcedure
    .input(
      z
        .object({
          id: z.number().optional(),
          name: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const lines = await ctx.prisma.line.findMany({
        where: {
          id: input?.id,
          name: input?.name,
        },
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
  edit: protectedProcedure
    .input(newLineValidator)
    .mutation(async ({ input, ctx }) => {
      const { id, routes } = input;
      console.log("editing", input);
      if (!id) return false;
      console.log("editing", input);

      const line = await ctx.prisma.line.findUnique({
        where: { id: id },
        include: { ...includeFullLine },
      });
      if (!line) return false;

      for (const newRoute of routes) {
        const routeID = newRoute.id;
        // edit existing route
        if (routeID) {
          // update name
          await ctx.prisma.route.update({
            where: {
              id: newRoute.id,
            },
            data: {
              name: newRoute.name,
            },
          });
          // delete old entries
          await ctx.prisma.routeEntry.deleteMany({
            where: {
              routeID: newRoute.id,
            },
          });
          // create new entries
          await ctx.prisma.routeEntry.createMany({
            data: newRoute.entries.map((entry) => ({
              routeID: routeID,
              busStopID: entry.busStop.id,
              estimatedTime: entry.estimatedTime,
            })),
          });
          continue;
        }
        // add new route
        await ctx.prisma.route.create({
          data: {
            lineID: id,
            name: newRoute.name,
            entries: {
              create: newRoute.entries.map((entry) => ({
                busStopID: entry.busStop.id,
                estimatedTime: entry.estimatedTime,
              })),
            },
          },
        });
      }

      // delete that are not in new line
      const updated = routes
        .filter((route) => route.id)
        .map((route) => route.id);
      for (const oldRoute of line.routes) {
        if (updated.includes(oldRoute.id)) continue;
        await ctx.prisma.route.delete({ where: { id: oldRoute.id } });
      }
    }),
});

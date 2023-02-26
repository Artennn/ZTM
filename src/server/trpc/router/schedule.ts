import { Prisma } from "@prisma/client";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const includeRoute = Prisma.validator<Prisma.LineInclude>()({
  routes: {
    include: {
      entries: true,
    },
  },
});

export const scheduleRouter = router({
  getByLine: protectedProcedure
    .input(z.number())
    //prettier-ignore
    .query(async ({ input, ctx }) => {
      const line = await ctx.prisma.line.findUnique({
        where: {
          id: input,
        },
        include: {
          routes: {
            include: {
              schedule: true,
            },
          },
        },
      });
      return line;
    }),
  getByStop: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      /* const lines = await ctx.prisma.line.findMany({
        include: { ...includeRoute },
        where: {
          routes: {
            some: {
              entries: {
                some: {
                  busStopID: input,
                },
              },
            },
          },
        },
      }); */
      const routes = await ctx.prisma.route.findMany({
        where: {
          entries: {
            some: {
              busStopID: input,
            },
          },
        },
        include: {
          Line: true,
          entries: {
            select: {
              busStopID: true,
              estimatedTime: true,
            },
          },
        },
      });

      const withOffset = routes.map((route) => ({
        lineName: route.Line.name,
        routeID: route.id,
        name: route.name,
        timeOffset: (() => {
          let offset = 0;
          for (const entry of route.entries) {
            offset += entry.estimatedTime;
            if (entry.busStopID === input) break;
          }
          return offset;
        })(),
      }));

      const withDepartues = await Promise.all(
        withOffset.map(async (route) => ({
          ...route,
          departures: await ctx.prisma.schedule.findMany({
            where: {
              routeID: route.routeID,
            },
            select: {
              day: true,
              time: true,
            },
          }),
        }))
      );
      return withDepartues;
    }),
  save: protectedProcedure
    .input(
      z.object({
        lineID: z.number(),
        schedule: z.array(
          z.object({
            id: z.number().optional(),
            day: z.number(),
            time: z.number(),
            routeID: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const backup = await ctx.prisma.schedule.deleteMany({
        where: {
          route: {
            lineID: input.lineID,
          },
        },
      });
      await ctx.prisma.schedule.createMany({
        data: input.schedule.map((entry) => ({
          routeID: entry.routeID,
          time: entry.time,
          day: entry.day,
        })),
      });
    }),
});

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const includeDriver = Prisma.validator<Prisma.VehicleInclude>()({
  driver: true,
});

export type VehicleWithDriver = Prisma.VehicleGetPayload<{
  include: typeof includeDriver;
}>;

export const vehicleRouter = router({
  getDriver: protectedProcedure
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
      const vehicles = await ctx.prisma.vehicle.findMany({
        include: { ...includeDriver },
        ...query,
      });
      return vehicles;
    }),
});

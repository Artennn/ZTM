import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const infoRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const info = await ctx.prisma.info.findMany();
    return info;
  }),
  add: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return !!(await ctx.prisma.info.create({ data: input }));
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return !!(await ctx.prisma.info.update({
        where: {
          id: input.id,
        },
        data: input,
      }));
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      return !!(await ctx.prisma.info.delete({ 
        where: {
          id: input,
        }
      }));
    })
});

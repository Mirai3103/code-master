import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createTagSchema, updateTagSchema } from "@/server/schema/tag.schema";
import { paginationQuerySchema } from "@/server/schema/pagination.schema";

export const tagRouter = createTRPCRouter({
  getTags: publicProcedure
    .input(
      paginationQuerySchema.extend({
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const tagService = ctx.services.tag;
      const result = await tagService.findAll(input);
      return [result.data, result.total] as const;
    }),

  getTag: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const tagService = ctx.services.tag;

    return tagService.findByName(input);
  }),

  createTag: publicProcedure
    .input(createTagSchema)
    .mutation(async ({ ctx, input }) => {
      const tagService = ctx.services.tag;
      return tagService.create(input);
    }),

  updateTag: publicProcedure
    .input(updateTagSchema)
    .mutation(async ({ ctx, input }) => {
      const tagService = ctx.services.tag;
      return tagService.update(input.tagId!, input);
    }),

  deleteTag: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const tagService = ctx.services.tag;
      return tagService.delete(input);
    }),
});

export type TagRouter = typeof tagRouter;

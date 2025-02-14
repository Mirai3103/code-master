import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createRoleSchema } from "@/server/schema/role";

export const roleRouter = createTRPCRouter({
  getRoles: publicProcedure.query(async ({ ctx }) => {
    return await ctx.services.role.getAllRoles();
  }),
  getRole: publicProcedure
    .input(
      z.object({
        roleId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.services.role.getRoleById(input.roleId);
    }),
  createRole: publicProcedure
    .input(createRoleSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.services.role.createRole(input);
    }),
  updateRole: publicProcedure
    .input(createRoleSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.services.role.updateRole(input);
    }),
  deleteRole: publicProcedure
    .input(
      z.object({
        roleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.services.role.deleteRole(input.roleId);
    }),

  getRolesByIds: publicProcedure
    .input(
      z.object({
        roleIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.services.role.getRolesByIds(input.roleIds);
    }),
});

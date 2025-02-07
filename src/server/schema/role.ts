import { Role as GenRole } from "@prisma/client";
import { z } from "zod";
export enum SystemRole {
  Admin = "admin",
  Everyone = "everyone",
}
const actions = z.enum(["create", "read", "update", "delete", "manage"]);
export const ruleSchema = z.object({
  action: z.array(actions),
  subject: z.array(z.string()),
  condition: z.any().nullish(),
  inverted: z.boolean().nullish(),
  fields: z.array(z.string()).nullish(),
  reason: z.string().nullish(),
});
export type Rule = z.infer<typeof ruleSchema>;
export type Action = z.infer<typeof actions>;

export const createRoleSchema = z.object({
  id: z.string(),
  roleName: z.string(),
  rules: z.array(ruleSchema),
  userIds: z.array(z.string()).nullish(),
  description: z.string().nullish(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export type Role = GenRole;

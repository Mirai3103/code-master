import { Role as GenRole } from "@prisma/client";
import { z } from "zod";
export enum SystemRole {
  Admin = "admin",
}
const actions = z.string();
export const ruleSchema = z.object({
  action: z.array(actions).min(1, "Vui lòng chọn ít nhất 1 quyền"),
  subject: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 đối tượng"),
  condition: z.any().nullish(),
  inverted: z.boolean().nullish().default(false),
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

import type { User as GenUser, Role } from "@prisma-generated/zod";
import { z } from "zod";
import { paginationQuerySchema } from "./pagination.schema";
import { ruleSchema } from "./role";

export const registerSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  confirmPassword: z.string().min(6),
  fullName: z.string().min(1, { message: "Tên không được để trống" }),
});

export const editUserRolesSchema = z.object({
  userId: z.string(),
  roles: z.array(z.string()).nullish(),
  rules: z.array(ruleSchema).nullish(),
});

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Tên đăng nhập không được để trống" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export const userQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type User = Omit<GenUser, "hashPassword"> & { Role: Role[] };
export type UserQuery = z.infer<typeof userQuerySchema>;
export type EditUserRolesInput = z.infer<typeof editUserRolesSchema>;

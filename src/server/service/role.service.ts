import { PrismaClient } from "@prisma/client";
import AbstractService from "./abstract.service";
import { CreateRoleInput } from "../schema/role";

export class RoleService extends AbstractService {
  constructor(db: PrismaClient) {
    super(db);
  }

  public async getAllRoles() {
    const rest = await this.prisma.role.findMany({
      select: {
        roleId: true,
        description: true,
        roleName: true,
        createdAt: true,
      },
    });
    return rest;
  }

  public getRoleById(roleId: string) {
    return this.prisma.role.findUnique({
      where: {
        roleId,
      },
    });
  }
  public createRole(input: CreateRoleInput) {
    return this.prisma.role.create({
      data: {
        roleName: input.roleName,
        roleId: input.id,
        createdAt: new Date(),
        description: input.description,
        rules: input.rules,
      },
    });
  }

  public updateRole(input: CreateRoleInput) {
    return this.prisma.role.update({
      where: {
        roleId: input.id,
      },
      data: {
        roleName: input.roleName,
        description: input.description,
        ...(input.rules !== undefined ? { rules: input.rules } : {}),
      },
    });
  }

  public deleteRole(roleId: string) {
    if (roleId === "admin" || roleId === "everyone") {
      throw new Error("Cannot delete this role");
    }
    return this.prisma.role.delete({
      where: {
        roleId,
      },
    });
  }
}

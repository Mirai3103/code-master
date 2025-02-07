import { Prisma, PrismaClient } from "@prisma/client";
import {
  EditUserRolesInput,
  LoginInput,
  UserQuery,
} from "../schema/user.schema";
import AbstractService from "./abstract.service";
import { verifyPassword } from "@/util/password";

export class UserService extends AbstractService {
  constructor(db: PrismaClient) {
    super(db);
  }
  private static instance: UserService;
  public static getInstance(db: PrismaClient) {
    if (!this.instance) {
      this.instance = new UserService(db);
    }
    return this.instance;
  }
  async login(payload: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.username,
      },
      select: {
        id: true,
        email: true,
        hashPassword: true,
        rules: true,
        image: true,
        name: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    // Check password
    if (!verifyPassword(payload.password, user.hashPassword || "")) {
      throw new Error("Password is incorrect");
    }
    // todo: retrieve user role and permissions/privileges/claims/rules
    return user;
  }

  async getAllUsers(query: UserQuery) {
    const where: Prisma.UserWhereInput = {
      ...(query.search && {
        OR: [
          {
            name: { contains: query.search, mode: "insensitive" },
          },
          { email: { contains: query.search, mode: "insensitive" } },
        ],
      }),
    };
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          emailVerified: true,
          createdAt: true,
          image: true,
          name: true,
          Role: {
            select: {
              roleId: true,
              roleName: true,
            },
          },
        },
        orderBy: {
          [query.orderBy || "createdAt"]: query.order || "desc",
        },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async saveUserPerms(input: EditUserRolesInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        id: true,
      },
    });
    if (!existingUser) {
      throw new Error("User not found");
    }
    if (existingUser.id == "admin") {
      throw new Error("Cannot edit admin");
    }
    // neu role != undifine
    if (input.roles != undefined) {
      let roles = input.roles;
      if (roles == null) {
        roles = ["everyone"];
      }
      if (!roles.includes("everyone")) {
        roles.push("everyone");
      }
      // delete all role of this user, table _RoleToUser was hidden by prisma
      await this.prisma.user.update({
        where: { id: input.userId },
        data: {
          Role: {
            set: [], // This will remove all roles from the user
          },
        },
      });
      await this.prisma.user.update({
        where: { id: input.userId },
        data: {
          Role: {
            connect: roles.map((roleName) => ({ roleId: roleName })), // Connect roles by their names
          },
        },
      });
    }
    if (input.rules != undefined) {
      await this.prisma.user.update({
        where: { id: input.userId },
        data: {
          rules: input.rules,
        },
      });
    }
  }
}

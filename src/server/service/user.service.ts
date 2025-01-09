import { PrismaClient } from "@prisma/client";
import { LoginInput } from "../schema/user.schema";
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
}

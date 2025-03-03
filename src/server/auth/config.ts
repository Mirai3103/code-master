import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { RawRule } from "@casl/ability";
import { db } from "@/server/database";
import { UserService } from "../service/user.service";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
      rules: RawRule[];
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const userService = UserService.getInstance(db);
        return userService.login({
          username: credentials.username as string,
          password: credentials.password as string,
        });
      },
    }),
  ],
  adapter: {
    ...PrismaAdapter(db),
    createUser: async (data) => {
      return await db.user.create({
        data: {
          id: data.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          email: data.email,
          emailVerified: new Date(),
          image: data.image!,
          name: data.name!,
          Role: {
            connect: { roleId: "everyone" },
          },
        },
      });
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      const userService = UserService.getInstance(db);
      const userRules = await userService.getUserPermissions(user.id);

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          rules: userRules,
        },
      };
    },
  },
} satisfies NextAuthConfig;

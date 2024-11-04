// src/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      isVerified: boolean;
      isAcceptingMessages: boolean;
      username: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    username: string;
  }
}

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      username?: string;
      email?: string;
      name?: string;
      image?: string;
    };
  }
}
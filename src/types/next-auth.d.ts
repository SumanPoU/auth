import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;              
    role: "SUPER_ADMIN" | "ADMIN" | "USER";  
    emailVerified?: Date | null;
  }

  interface Session {
    user: {
      id: string;
      role: "SUPER_ADMIN" | "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "SUPER_ADMIN" | "ADMIN" | "USER";
  }
}

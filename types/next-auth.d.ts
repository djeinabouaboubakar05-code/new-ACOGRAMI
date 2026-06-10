import "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    village?: string | null;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      village?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
    village?: string | null;
  }
}

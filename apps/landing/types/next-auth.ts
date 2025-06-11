import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId?: string; // Your internal database user ID
      roles?: string[]; // Example: user roles
      idToken?: string; // Example: JWT token
    } & DefaultSession["user"];
  }

  interface JWT {
    userId?: string; // Your internal database user ID
    roles?: string[]; // Example: user roles
    idToken?: string; // Example: JWT token
  }
}

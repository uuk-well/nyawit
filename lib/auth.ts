import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, initDb } from "./db";
import { user, session, account, verification } from "./schema";

let ready: Promise<void> | null = null;

const options = {
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    ...(process.env.NEXT_PUBLIC_BETTER_AUTH_URL
      ? [process.env.NEXT_PUBLIC_BETTER_AUTH_URL]
      : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ],
  ...(process.env.NODE_ENV === "production"
    ? {
        baseURL: process.env.BETTER_AUTH_URL || undefined,
        trustHost: true,
        allowedHosts: [
          ...(process.env.NEXT_PUBLIC_BETTER_AUTH_URL
            ? [new URL(process.env.NEXT_PUBLIC_BETTER_AUTH_URL).hostname]
            : []),
          ...(process.env.BETTER_AUTH_URL
            ? [new URL(process.env.BETTER_AUTH_URL).hostname]
            : []),
        ],
      }
    : {}),
} satisfies Parameters<typeof betterAuth>[0];

const _auth = betterAuth(options);

export function auth() {
  if (!ready) {
    ready = initDb();
  }
  return _auth;
}

export type Auth = ReturnType<typeof betterAuth>;

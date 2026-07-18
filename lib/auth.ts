import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, initDb } from "./db";
import { user, session, account, verification } from "./schema";

let ready: Promise<void> | null = null;

function withProtocol(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function toHost(value?: string): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
}

const baseURL = withProtocol(process.env.BETTER_AUTH_URL);

const options = {
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: [
    ...(withProtocol(process.env.NEXT_PUBLIC_BETTER_AUTH_URL)
      ? [withProtocol(process.env.NEXT_PUBLIC_BETTER_AUTH_URL)!]
      : []),
    ...(baseURL ? [baseURL] : []),
  ],
  ...(process.env.NODE_ENV === "production"
    ? {
        baseURL: baseURL || undefined,
        trustHost: true,
        allowedHosts: [
          ...(toHost(process.env.NEXT_PUBLIC_BETTER_AUTH_URL)
            ? [toHost(process.env.NEXT_PUBLIC_BETTER_AUTH_URL)!]
            : []),
          ...(toHost(process.env.BETTER_AUTH_URL)
            ? [toHost(process.env.BETTER_AUTH_URL)!]
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

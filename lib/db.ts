import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url = process.env.DATABASE_PATH || "file:nyawit.db";

export const client = createClient({
  url,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

const TABLES: string[] = [
  `CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "emailVerified" integer NOT NULL DEFAULT 0,
    "image" text,
    "createdAt" integer NOT NULL,
    "updatedAt" integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY,
    "expiresAt" integer NOT NULL,
    "token" text NOT NULL UNIQUE,
    "createdAt" integer NOT NULL,
    "updatedAt" integer NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL REFERENCES "user"("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL REFERENCES "user"("id"),
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" integer,
    "refreshTokenExpiresAt" integer,
    "scope" text,
    "password" text,
    "createdAt" integer NOT NULL,
    "updatedAt" integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" integer NOT NULL,
    "createdAt" integer,
    "updatedAt" integer
  )`,
  `CREATE TABLE IF NOT EXISTS "kebun" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "nama" text NOT NULL,
    "lokasi" text,
    "luas" real,
    "createdAt" integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "panen" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "kebunId" text NOT NULL,
    "tanggal" text NOT NULL,
    "berat" real NOT NULL,
    "createdAt" integer NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "pengeluaran" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "kebunId" text NOT NULL,
    "jenis" text NOT NULL,
    "tanggal" text NOT NULL,
    "nominal" real NOT NULL,
    "keterangan" text
  )`,
  `CREATE TABLE IF NOT EXISTS "upah" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "kebunId" text NOT NULL,
    "jenis" text NOT NULL,
    "tanggal" text NOT NULL,
    "nominal" real NOT NULL,
    "keterangan" text
  )`,
  `CREATE TABLE IF NOT EXISTS "jadwal_panen" (
    "id" text PRIMARY KEY,
    "userId" text NOT NULL,
    "kebunId" text NOT NULL,
    "tanggal" text NOT NULL,
    "catatan" text,
    "selesai" integer NOT NULL DEFAULT 0,
    "createdAt" integer NOT NULL
  )`,
];

let ready: Promise<void> | null = null;

export function initDb(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      for (const stmt of TABLES) {
        await client.execute(stmt);
      }
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

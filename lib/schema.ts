import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("createdAt").notNull(),
  updatedAt: integer("updatedAt").notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt").notNull(),
  updatedAt: integer("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt"),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt").notNull(),
  updatedAt: integer("updatedAt").notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt").notNull(),
  createdAt: integer("createdAt"),
  updatedAt: integer("updatedAt"),
});

export const kebun = sqliteTable("kebun", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  nama: text("nama").notNull(),
  lokasi: text("lokasi"),
  luas: real("luas"),
  createdAt: integer("createdAt").notNull(),
});

export const panen = sqliteTable("panen", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  kebunId: text("kebunId").notNull(),
  tanggal: text("tanggal").notNull(),
  berat: real("berat").notNull(),
  createdAt: integer("createdAt").notNull(),
});

export const pengeluaran = sqliteTable("pengeluaran", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  kebunId: text("kebunId").notNull(),
  jenis: text("jenis").notNull(),
  tanggal: text("tanggal").notNull(),
  nominal: real("nominal").notNull(),
  keterangan: text("keterangan"),
});

export const upah = sqliteTable("upah", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  kebunId: text("kebunId").notNull(),
  jenis: text("jenis").notNull(),
  tanggal: text("tanggal").notNull(),
  nominal: real("nominal").notNull(),
  keterangan: text("keterangan"),
});

export const jadwalPanen = sqliteTable("jadwal_panen", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  kebunId: text("kebunId").notNull(),
  tanggal: text("tanggal").notNull(),
  catatan: text("catatan"),
  selesai: integer("selesai", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("createdAt").notNull(),
});

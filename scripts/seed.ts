import { auth } from "../lib/auth";
import { initDb } from "../lib/db";

const EMAIL = "admin@nyawit.app";
const PASSWORD = "nyawit123";

async function main() {
  await initDb();
  try {
    const res = await auth().api.signUpEmail({
      body: { name: "Demo Petani", email: EMAIL, password: PASSWORD },
      headers: new Headers({
        origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      }),
    });
    console.log("SEED_OK akun:", res.user?.email);
  } catch (e: any) {
    const msg = e?.message || String(e);
    if (/already|exists/i.test(msg)) {
      console.log("SEED_SKIP akun sudah ada:", EMAIL);
    } else {
      console.error("SEED_ERR", msg);
      process.exit(1);
    }
  }
}

main();

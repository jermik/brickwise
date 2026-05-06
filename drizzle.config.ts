import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config({ path: ".env" });

// drizzle-kit `generate` only needs the schema; `push`/`migrate` need a live DB.
// Use a placeholder when DATABASE_URL is missing so `generate` still works.
if (!process.env.DATABASE_URL) {
  console.warn(
    "[drizzle.config] DATABASE_URL not set. `db:push` and `db:migrate` will fail until it's configured. See lib/crm/SETUP.md.",
  );
}

export default defineConfig({
  schema: "./lib/crm/db/schema.ts",
  out: "./lib/crm/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder@localhost:5432/db",
  },
  strict: true,
  verbose: true,
});

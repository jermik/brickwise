import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "[CRM] DATABASE_URL is not set. Provision a Neon Postgres database (free tier works) " +
      "via Vercel Marketplace or https://neon.tech, then add DATABASE_URL to .env.local " +
      "(local) and Vercel project env (production). See lib/crm/SETUP.md.",
  );
}

// HTTP driver — no connection pool, safe for serverless cold starts
const sqlClient = neon(databaseUrl);

export const db = drizzle(sqlClient, { schema, logger: false });

export { schema };

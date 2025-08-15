import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// NOTE: make sure to keep connection pool in mind
const client = postgres(process.env.SUPABASE_DATABASE_URL!);
export const db = drizzle({ client });

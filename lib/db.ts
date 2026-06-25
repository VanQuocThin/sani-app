import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export const DEFAULT_CLINIC_ID = "00000000-0000-0000-0000-000000000001";

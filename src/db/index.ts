import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";

import * as schema from "./schema";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export const checkDbConnection = async () => {
  try {
    await pool.query(`SELECT 1`);
    return true;
  } catch (err) {
    return false;
  }
};
export const disconnectDb = async () => await pool.end();

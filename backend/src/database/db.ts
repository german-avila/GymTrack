import pg from "pg";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL;

const databasePort =
  Number(process.env.DB_PORT) || 5432;

export const pool = connectionString
  ? new Pool({
      connectionString
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: databasePort,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
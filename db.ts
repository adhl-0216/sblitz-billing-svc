import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export const query = async (sql: string, params: any) => {
  const start = Date.now();
  const res = await pool.query(sql, params);
  const duration = Date.now() - start;
  console.log("executed query", { text: sql, duration, rows: res.rowCount });
  return res;
};

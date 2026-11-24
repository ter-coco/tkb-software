import "server-only";
import { Pool } from "pg";

const g = globalThis as unknown as { __tkbWebPool?: Pool };

/** สร้าง Pool แบบ lazy ครั้งเดียวต่อ instance — ไม่สร้างตอน import (build ไม่ต้องมี DATABASE_URL) */
export function db(): Pool {
  if (!g.__tkbWebPool) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 5000,
      query_timeout: 5000,
      statement_timeout: 5000,
      ssl: { rejectUnauthorized: false },
    });
    pool.on("error", (e) => console.error("pg pool error", e));
    g.__tkbWebPool = pool;
  }
  return g.__tkbWebPool;
}

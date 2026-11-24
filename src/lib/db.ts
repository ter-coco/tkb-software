import "server-only";
import { Pool } from "pg";

const g = globalThis as unknown as { __tkbWebPool?: Pool };

/** สร้าง Pool แบบ lazy ครั้งเดียวต่อ instance — ไม่สร้างตอน import (build ไม่ต้องมี DATABASE_URL) */
export function db(): Pool {
  if (!g.__tkbWebPool) {
    g.__tkbWebPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      ssl: { rejectUnauthorized: false },
    });
  }
  return g.__tkbWebPool;
}

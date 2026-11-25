import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // dev server ใช้โฟลเดอร์แยก (NEXT_DIST_DIR=.next-dev) เพื่อไม่ให้ `next build` ตอนรัน e2e เขียนทับไฟล์ของ dev
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;

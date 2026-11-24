import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "ไม่พบหน้านี้" };

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-blue-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">ไม่พบหน้านี้</h1>
      <p className="mt-3 text-slate-600">หน้าที่คุณเปิดอาจถูกย้ายไปแล้ว หรือที่อยู่เว็บพิมพ์ไม่ถูกต้อง</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        กลับหน้าแรก
      </Link>
    </section>
  );
}

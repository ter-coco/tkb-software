import Image from "next/image";
import Link from "next/link";
import { Check, CirclePlay, Download } from "lucide-react";
import { getProduct, products } from "@/config/products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const pos = getProduct("pos")!;
  const shot = pos.screenshots[0];

  const highlights = [
    `ทดลองใช้ฟรี ${pos.trialDays} วัน`,
    "ติดตั้งบน Windows ข้อมูลอยู่ที่ร้าน",
    "ขายได้แม้เน็ตหลุด",
  ];

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              {pos.shortName} · {pos.fullName}
            </p>
            <h1 className="mt-3 text-3xl leading-snug font-bold text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.3]">
              {/* แบ่งเป็นวลี inline-block เพื่อไม่ให้ตัดกลางคำ เช่น "ใช้ / งาน" */}
              <span className="inline-block">โปรแกรมสำหรับ</span>
              <span className="inline-block">เจ้าของกิจการ</span>{" "}
              <span className="inline-block text-blue-700">ติดตั้งในเครื่อง</span>{" "}
              <span className="inline-block text-blue-700">ใช้งานได้จริง</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">{pos.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/programs/pos#download"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <Download aria-hidden="true" className="size-5" />
                ดาวน์โหลดทดลองใช้
              </Link>
              {pos.youtubeId ? (
                <Link
                  href="/programs/pos#video"
                  className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
                >
                  <CirclePlay aria-hidden="true" className="size-5" />
                  ดูคลิป
                </Link>
              ) : null}
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-slate-600 sm:flex sm:flex-wrap sm:gap-x-6">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <Check aria-hidden="true" className="size-4 shrink-0 text-blue-600" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
              <div aria-hidden="true" className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2.5">
                <span className="size-3 rounded-full bg-slate-300" />
                <span className="size-3 rounded-full bg-slate-300" />
                <span className="size-3 rounded-full bg-slate-300" />
                <span className="ml-2 truncate text-xs font-semibold text-slate-500">
                  {pos.shortName} — หน้าขาย
                </span>
              </div>
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                priority
                sizes="(min-width: 1152px) 600px, (min-width: 1024px) 52vw, 100vw"
                className="h-auto w-full"
              />
            </figure>
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">โปรแกรมของเรา</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          ทุกโปรแกรมติดตั้งบนเครื่อง Windows ของคุณ ดาวน์โหลดไปลองใช้ก่อน พร้อมเมื่อไรค่อยทัก LINE คุยกับเรา
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

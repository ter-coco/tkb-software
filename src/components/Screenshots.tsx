import Image from "next/image";
import type { Product } from "@/config/products";

/** ภาพหน้าจอโปรแกรม คลิกเปิดภาพเต็มในแท็บใหม่ คำบรรยายใช้ alt */
export function Screenshots({ screenshots }: { screenshots: Product["screenshots"] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {screenshots.map((s) => (
        <figure key={s.src}>
          <a
            href={s.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`เปิดภาพเต็ม: ${s.alt}`}
            className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 transition-shadow hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Image
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes="(min-width: 1152px) 560px, (min-width: 1024px) 48vw, 100vw"
              className="h-auto w-full"
            />
          </a>
          <figcaption className="mt-3 text-sm text-slate-600">{s.alt}</figcaption>
        </figure>
      ))}
    </div>
  );
}

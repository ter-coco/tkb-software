import Link from "next/link";
import { ArrowRight, BedDouble, ShoppingCart, UserRoundCheck, type LucideIcon } from "lucide-react";
import type { Product } from "@/config/products";
import { LineButton } from "./LineButton";

const icons: Record<string, LucideIcon> = {
  pos: ShoppingCart,
  hotel: BedDouble,
  hr: UserRoundCheck,
};

export function ProductCard({ product }: { product: Product }) {
  const Icon = icons[product.slug] ?? ShoppingCart;

  if (product.status === "available") {
    return (
      <article
        data-testid="product-card"
        className="flex flex-col rounded-2xl border-2 border-blue-600 bg-white p-6 shadow-lg shadow-blue-600/10 ring-4 ring-blue-50"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-blue-600 text-white">
            <Icon aria-hidden="true" className="size-6" />
          </span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            ทดลองใช้ฟรี {product.trialDays} วัน
          </span>
        </div>
        <h3 className="mt-5 text-xl font-bold text-slate-900">{product.shortName}</h3>
        <p className="text-sm font-semibold text-blue-700">{product.fullName}</p>
        <p className="mt-3 flex-1 text-[15px] text-slate-600">{product.tagline}</p>
        <Link
          href={`/programs/${product.slug}`}
          className="mt-6 inline-flex items-center gap-1.5 self-start font-semibold text-blue-700 hover:text-blue-800"
        >
          ดูรายละเอียด
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </article>
    );
  }

  return (
    <article
      data-testid="product-card"
      className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-slate-200 text-slate-500">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
          เร็ว ๆ นี้
        </span>
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-500">{product.shortName}</h3>
      <p className="text-sm font-semibold text-slate-500">{product.fullName}</p>
      <p className="mt-3 flex-1 text-[15px] text-slate-500">
        กำลังพัฒนา แอด LINE ไว้ แล้วเราจะแจ้งเมื่อเปิดให้ทดลองใช้
      </p>
      <div className="mt-6">
        <LineButton label="แอด LINE รับแจ้งเตือน" />
      </div>
    </article>
  );
}

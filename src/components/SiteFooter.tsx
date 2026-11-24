import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/config/site";
import { LineButton } from "./LineButton";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ติดต่อเรา</h2>
          <p className="mt-2 max-w-md text-slate-600">
            สอบถามการใช้งาน ขอให้ช่วยติดตั้ง หรือพร้อมซื้อ ทักมาทาง LINE หรือโทรหาเราได้เลย
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <LineButton />
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-600 hover:text-blue-700"
            >
              <Phone aria-hidden="true" className="size-4" />
              โทร {site.phone}
            </a>
          </div>
        </div>
        <div className="text-sm text-slate-600 md:text-right">
          <p className="font-semibold text-slate-900">{site.name}</p>
          <p className="mt-1">{site.companyName}</p>
          <p className="mt-4">
            <Link href="/privacy" className="underline underline-offset-4 hover:text-blue-700">
              นโยบายความเป็นส่วนตัว
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 sm:px-6">
          © {new Date().getFullYear()} {site.companyName}
        </p>
      </div>
    </footer>
  );
}

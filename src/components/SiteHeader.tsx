import Link from "next/link";
import { site } from "@/config/site";

const nav = [
  { href: "/#programs", label: "โปรแกรม" },
  { href: "/install", label: "วิธีติดตั้ง" },
  { href: "/#contact", label: "ติดต่อ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="grid h-8 w-11 place-items-center rounded-lg bg-blue-600 text-xs font-bold tracking-wide text-white"
          >
            TKB
          </span>
          <span className="text-base font-bold text-slate-900 sm:text-lg">{site.name}</span>
        </Link>
        <nav aria-label="เมนูหลัก">
          <ul className="flex items-center gap-3 text-[13px] sm:gap-8 sm:text-[15px]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-semibold text-slate-600 transition-colors hover:text-blue-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

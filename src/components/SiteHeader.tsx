import Image from "next/image";
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
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/brand/tkb-logo.png"
            alt={site.name}
            width={694}
            height={281}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </Link>
        <nav aria-label="เมนูหลัก">
          <ul className="flex items-center gap-3 text-[13px] sm:gap-8 sm:text-[15px]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-2.5 font-semibold text-slate-600 transition-colors hover:text-blue-700"
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

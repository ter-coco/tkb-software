import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Product } from "@/config/products";

export function FeatureList({ features }: { features: Product["features"] }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {features.map((f) => (
        <li key={f.title} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-blue-600" />
          <div>
            <h3 className="font-bold text-slate-900">{f.title}</h3>
            <p className="mt-1 text-[15px] text-slate-600">{f.detail}</p>
            {f.link ? (
              <Link
                href={f.link.href}
                className="mt-2 inline-block py-1 text-sm font-semibold text-blue-700 underline-offset-2 hover:underline"
              >
                {f.link.label} →
              </Link>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

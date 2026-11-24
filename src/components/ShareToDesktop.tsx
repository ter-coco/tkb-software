"use client";

import { useEffect, useRef, useState } from "react";

type Props = { url: string };

/** ส่งลิงก์จากมือถือไปเปิดบนคอม: คัดลอก หรือส่งเข้า LINE (แสดงเฉพาะมือถือ) */
export function ShareToDesktop({ url }: Props) {
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (manual) inputRef.current?.select();
  }, [manual]);

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(url);
      setManual(false);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setManual(true);
    }
  }

  const btn =
    "inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

  return (
    <div className="mt-4 md:hidden">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={copy} className={btn}>
          คัดลอกลิงก์
        </button>
        <a
          href={`https://line.me/R/share?text=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
        >
          ส่งเข้า LINE
        </a>
        <span role="status" className="text-sm font-semibold text-green-700">
          {copied ? "คัดลอกแล้ว" : ""}
        </span>
      </div>
      {manual ? (
        <input
          ref={inputRef}
          readOnly
          aria-label="ลิงก์หน้านี้"
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
        />
      ) : null}
    </div>
  );
}

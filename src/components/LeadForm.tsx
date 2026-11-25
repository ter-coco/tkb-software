"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download, BellRing, Rocket } from "lucide-react";
import { site } from "@/config/site";
import { CONSENT_REQUIRED_MESSAGE, NAME_REQUIRED_MESSAGE, type LeadField } from "@/lib/lead";
import type { LeadResponse } from "@/lib/handle-lead";
import { LineButton } from "@/components/LineButton";
import { NextSteps } from "@/components/NextSteps";
import { ShareToDesktop } from "@/components/ShareToDesktop";

type Props = {
  slug: string;
  productName: string;
  trialDays: number;
  ready: boolean;
  /** ระบบคลาวด์: ปุ่มเป็น "สมัครทดลองใช้" และหลังส่งพาไปหน้าสมัคร */
  cloud?: boolean;
  /** ขั้นตอนเริ่มใช้งาน (แสดงหลังส่งฟอร์มของระบบคลาวด์) */
  steps?: string[];
};
type Errors = Partial<Record<LeadField, string>>;
type Done =
  | { mode: "download"; downloadUrl: string; fileName: string; sizeMb: number }
  | { mode: "signup"; signupUrl: string }
  | { mode: "notify" };

const inputCls =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 aria-[invalid=true]:border-red-600";
const errCls = "mt-1 text-sm font-medium text-red-700";

export function LeadForm({ slug, productName, trialDays, ready, cloud = false, steps = [] }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const sending = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);

  // ฟอร์มถูกแทนที่ด้วยผลลัพธ์: เลื่อนให้เห็นหัวข้อ ไม่ให้ตกอยู่หลังเฮดเดอร์
  useEffect(() => {
    if (done) doneRef.current?.scrollIntoView({ block: "start" });
  }, [done]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending.current) return;

    const local: Errors = {};
    if (!name.trim()) local.name = NAME_REQUIRED_MESSAGE;
    if (!consent) local.consent = CONSENT_REQUIRED_MESSAGE;
    setFormError("");
    if (Object.keys(local).length > 0) {
      setErrors(local);
      return;
    }
    setErrors({});

    sending.current = true;
    setPending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: slug, name, phone, consent: true, website }),
      });
      const data = (await res.json()) as LeadResponse;
      if (data.ok) {
        setDone(data);
      } else {
        setErrors(data.errors ?? {});
        if (data.message || !data.errors) setFormError(data.message ?? site.saveErrorMessage);
      }
    } catch {
      setFormError(site.saveErrorMessage);
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  if (done?.mode === "download") {
    const shareText = `ดาวน์โหลดโปรแกรม ${productName} (ใช้กับคอมพิวเตอร์ Windows): ${done.downloadUrl}
วิธีติดตั้ง: ${site.siteUrl}/install`;
    return (
      <div ref={doneRef} role="status" className="flex scroll-mt-20 flex-col gap-5">
        {/* มือถือ: ส่งลิงก์ไปเปิดบนคอมเป็นปุ่มหลัก (ไฟล์เป็น .exe ใช้บนมือถือไม่ได้) */}
        <div className="order-1 md:hidden">
          <p className="text-base font-bold text-slate-900">
            ไฟล์นี้ใช้กับคอมพิวเตอร์ Windows — ส่งลิงก์ไปเปิดบนคอม
          </p>
          <ShareToDesktop
            url={done.downloadUrl}
            text={shareText}
            inputLabel="ลิงก์ดาวน์โหลดและวิธีติดตั้ง"
            className="mt-3"
          />
        </div>
        <div className="order-2 md:order-1">
          <a
            href={done.downloadUrl}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:rounded-xl md:border-0 md:bg-blue-600 md:px-6 md:py-5 md:text-lg md:font-bold md:text-white md:shadow-md md:shadow-blue-600/25 md:hover:bg-blue-700"
          >
            <Download aria-hidden="true" className="size-5 md:size-6" />
            ดาวน์โหลดไฟล์ติดตั้ง (Windows PC, {done.sizeMb} MB)
          </a>
          <p className="mt-2 text-sm text-slate-600">ไฟล์: {done.fileName} · ใช้กับ Windows เท่านั้น</p>
        </div>
        <div className="order-3">
          <NextSteps trialDays={trialDays} />
        </div>
      </div>
    );
  }

  if (done?.mode === "signup") {
    return (
      <div ref={doneRef} role="status" className="grid scroll-mt-20 gap-5 rounded-xl border border-green-200 bg-white p-6">
        <p className="text-lg font-semibold text-slate-900">
          ขอบคุณครับ ไปสมัครบัญชีบริษัทแล้วเริ่มทดลองใช้ฟรี {trialDays} วันได้ทันที
        </p>
        <a
          href={done.signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Rocket aria-hidden="true" className="size-6" />
          ไปหน้าสมัครทดลองใช้
        </a>
        {steps.length > 0 ? (
          <ol className="grid gap-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-slate-800">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        ) : null}
        <p className="text-sm text-slate-600">ติดขัดตรงไหน แอด LINE {site.lineId} หรือโทร {site.phone}</p>
      </div>
    );
  }

  if (done?.mode === "notify") {
    return (
      <div className="rounded-xl border border-green-200 bg-white p-6" role="status">
        <p className="text-lg font-semibold text-slate-900">
          ลงชื่อเรียบร้อย เราจะติดต่อกลับทางเบอร์ที่ให้ไว้เมื่อโปรแกรมพร้อมให้ทดลองใช้
        </p>
        <div className="mt-4">
          <LineButton />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-slate-600">{productName}</p>
      <div>
        <label htmlFor="lead-name" className="font-semibold text-slate-900">
          ชื่อ
        </label>
        <input
          id="lead-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "lead-name-err" : undefined}
          className={inputCls}
        />
        {errors.name ? (
          <p id="lead-name-err" className={errCls}>
            {errors.name}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="lead-phone" className="font-semibold text-slate-900">
          เบอร์มือถือ
        </label>
        <input
          id="lead-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="081-234-5678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "lead-phone-err" : undefined}
          className={inputCls}
        />
        {errors.phone ? (
          <p id="lead-phone-err" className={errCls}>
            {errors.phone}
          </p>
        ) : null}
      </div>

      {/* honeypot: คนจริงไม่เห็น บอทมักกรอก */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px]"
      />

      <div>
        <div className="flex items-start gap-3">
          {/* aria-label สั้น ๆ: ข้อความยินยอมยาวมีคำว่า "ชื่อ" ซึ่งจะไปปนกับป้ายของช่องชื่อ จึงผูกเป็น description แทน */}
          <input
            id="lead-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-label="ยินยอมการเก็บข้อมูล"
            aria-describedby={errors.consent ? "lead-consent-text lead-consent-err" : "lead-consent-text"}
            aria-invalid={errors.consent ? true : undefined}
            className="mt-1 size-5 shrink-0 accent-blue-600"
          />
          <span
            id="lead-consent-text"
            onClick={() => setConsent((c) => !c)}
            className="cursor-pointer text-sm text-slate-700"
          >
            {site.consentText}{" "}
            <Link
              href="/privacy"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-blue-700 underline hover:text-blue-800"
            >
              นโยบายความเป็นส่วนตัว
            </Link>
          </span>
        </div>
        {errors.consent ? (
          <p id="lead-consent-err" className={errCls}>
            {errors.consent}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {formError}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? (
            "กำลังส่ง…"
          ) : (
            <>
              {!ready ? (
                <BellRing aria-hidden="true" className="size-5" />
              ) : cloud ? (
                <Rocket aria-hidden="true" className="size-5" />
              ) : (
                <Download aria-hidden="true" className="size-5" />
              )}
              {!ready
                ? "ลงชื่อรับแจ้งเมื่อพร้อม"
                : cloud
                  ? `สมัครทดลองใช้ฟรี ${trialDays} วัน`
                  : `ดาวน์โหลดฟรี ทดลองใช้ ${trialDays} วัน`}
            </>
          )}
        </button>
        <p className="mt-2 text-center text-sm text-slate-600">ไม่มีค่าใช้จ่าย · ไม่ต้องใส่บัตรเครดิต</p>
      </div>
    </form>
  );
}

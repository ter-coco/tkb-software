import type { Metadata } from "next";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว",
  description: "นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล (PDPA) ของ TKB Software",
};

export default function PrivacyPage() {
  const h2 = "mt-10 text-xl font-bold text-slate-900";
  const ul = "mt-3 grid list-disc gap-2 pl-6 text-slate-700 marker:text-blue-600";
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">นโยบายความเป็นส่วนตัว</h1>
      <p className="mt-3 text-sm text-slate-600">ปรับปรุงล่าสุด: {site.consentVersion}</p>

      <h2 className={h2}>ผู้เก็บรวบรวมข้อมูล</h2>
      <p className="mt-3 text-slate-700">
        {site.companyName}
        <br />
        ที่อยู่: {site.companyAddress}
      </p>

      <h2 className={h2}>ข้อมูลที่เก็บ</h2>
      <ul className={ul}>
        <li>ชื่อ</li>
        <li>เบอร์โทร</li>
        <li>โปรแกรมที่สนใจ</li>
        <li>วันและเวลาที่กรอกข้อมูล</li>
        <li>ข้อมูลเบราว์เซอร์ที่ใช้</li>
      </ul>

      <h2 className={h2}>วัตถุประสงค์</h2>
      <p className="mt-3 text-slate-700">
        เพื่อส่งลิงก์ดาวน์โหลด แจ้งเมื่อโปรแกรมพร้อม และติดต่อช่วยเหลือการติดตั้ง ตามที่ท่านให้ความยินยอมไว้ดังนี้
      </p>
      <blockquote className="mt-3 border-l-4 border-blue-200 pl-4 text-slate-700">{site.consentText}</blockquote>

      <h2 className={h2}>ระยะเวลาเก็บข้อมูล</h2>
      <p className="mt-3 text-slate-700">{site.retentionText}</p>

      <h2 className={h2}>การเปิดเผยข้อมูล</h2>
      <p className="mt-3 text-slate-700">เราไม่ขายข้อมูลของท่าน และไม่เปิดเผยแก่บุคคลอื่น</p>

      <h2 className={h2}>สิทธิ์ของท่าน</h2>
      <p className="mt-3 text-slate-700">
        ท่านมีสิทธิ์ขอดู แก้ไข หรือลบข้อมูลของท่านได้ทุกเมื่อ ติดต่อทาง LINE {site.lineId} หรือโทร{" "}
        <a href={site.phoneHref} className="text-blue-700 hover:text-blue-800">
          {site.phone}
        </a>
      </p>
    </div>
  );
}

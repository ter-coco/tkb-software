import type { Metadata } from "next";
import { availableProducts } from "@/config/products";
import { site } from "@/config/site";
import { NextSteps } from "@/components/NextSteps";
import { LineButton } from "@/components/LineButton";

export const metadata: Metadata = {
  title: "วิธีติดตั้ง",
  description: "วิธีติดตั้งโปรแกรม TKB Software บน Windows ทีละขั้นตอน รวมวิธีผ่านหน้าจอเตือนของ Windows",
};

// TODO(ก่อนเปิดจริง): เติมเวลาติดตั้งโดยประมาณและพื้นที่ดิสก์ เมื่อวัดจากตัวติดตั้งจริงแล้ว

export default function InstallPage() {
  const h2 = "text-2xl font-bold text-slate-900";
  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">วิธีติดตั้ง</h1>
          <p className="mt-4 text-lg text-slate-600">
            ติดตั้งลงเครื่อง Windows ของร้านได้เอง ถ้าติดขัดตรงไหน แอด LINE {site.lineId} หรือโทร {site.phone}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-4xl gap-14 px-4 py-12 sm:px-6">
        {availableProducts()
          .filter((p) => p.delivery !== "cloud")
          .map((p) => {
          const setup = p.screenshots.find((s) => s.src.endsWith("/setup.png"));
          return (
            <section key={p.slug} id={p.slug} className="scroll-mt-20">
              <h2 className={h2}>{p.fullName}</h2>
              <h3 className="mt-6 text-lg font-bold text-slate-900">ความต้องการของระบบ</h3>
              <ul className="mt-3 grid list-disc gap-2 pl-6 text-slate-700 marker:text-blue-600">
                {p.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <div className="mt-8">
                <NextSteps trialDays={p.trialDays} setupImage={setup} />
              </div>
            </section>
          );
        })}

        <section id="ai" className="scroll-mt-20">
          <h2 className={h2}>ตั้งค่า AI อ่านบิล (ไม่บังคับ)</h2>
          <p className="mt-3 text-slate-700">
            ใช้กับเมนู &quot;อ่านบิลซื้อจากรูป&quot; ของ TKB POS: ถ่ายรูปใบเสร็จหรือเลือกไฟล์ PDF แล้วระบบรับเข้าสต๊อกและอัปเดตต้นทุนให้
            ไม่ตั้งค่าก็ใช้โปรแกรมส่วนอื่นได้ตามปกติ
          </p>
          <ol className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-5">
            {[
              <>
                ในโปรแกรม ไปที่เมนู <strong>ระบบ → ตั้งค่า AI อ่านบิล</strong>
              </>,
              <>
                เลือกผู้ให้บริการ แนะนำ <strong>Google Gemini</strong> (สมัครด้วยบัญชี Google ได้เลย และถูกที่สุด) ·
                OpenAI และ Claude ต้องเติมเงินในบัญชีก่อนใช้
              </>,
              <>
                กด &quot;สร้าง API key ของ Google Gemini&quot; (หรือเปิด{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-700 underline underline-offset-2"
                >
                  Google AI Studio
                </a>
                ) แล้วคัดลอกคีย์มาวางในช่อง <strong>API key</strong>
              </>,
              <>ช่อง &quot;รุ่น (model)&quot; ปล่อยว่างไว้ได้ ระบบใช้รุ่นแนะนำให้เอง</>,
              <>
                กด <strong>ทดสอบการเชื่อมต่อ</strong> แล้วกด <strong>บันทึก</strong>
              </>,
              <>ลองอ่านบิลจริง 1 ใบ ถ้าแถบยอดรวมขึ้นสีเขียว แสดงว่าอ่านบิลของร้านได้แม่น</>,
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-slate-800">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0 pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          <ul className="mt-4 grid list-disc gap-2 pl-6 text-slate-700 marker:text-blue-600">
            <li>
              ค่าใช้จ่ายประมาณ <strong>1–2 บาทต่อบิล</strong> ผู้ให้บริการ AI เรียกเก็บจากร้านโดยตรง ไม่ผ่าน TKB Software
            </li>
            <li>ต้องต่ออินเทอร์เน็ตตอนอ่านบิล</li>
            <li>API key เก็บแบบเข้ารหัสในเครื่องของร้าน พนักงานมองไม่เห็น</li>
          </ul>
        </section>

        <section>
          <h2 className={h2}>ใช้งานจากมือถือในร้าน</h2>
          <p className="mt-3 text-slate-700">
            ให้มือถือหรือแท็บเล็ตเชื่อมต่อ Wi-Fi วงเดียวกับเครื่องหลักที่ติดตั้งโปรแกรม แล้วเปิดเบราว์เซอร์ไปที่{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm break-all">http://&lt;IP เครื่องหลัก&gt;:3000</code>{" "}
            (เปลี่ยน &lt;IP เครื่องหลัก&gt; เป็นเลข IP ของเครื่องหลัก)
          </p>
        </section>

        <section>
          <h2 className={h2}>ข้อมูลอยู่ที่ไหน</h2>
          <ul className="mt-3 grid list-disc gap-2 pl-6 text-slate-700 marker:text-blue-600">
            <li>
              ข้อมูลร้านอยู่ในเครื่องของร้านเอง ที่โฟลเดอร์{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm break-all">C:\ProgramData\TKBRetail</code>
            </li>
            <li>ถอนการติดตั้งโปรแกรมแล้วข้อมูลยังอยู่</li>
            <li>ติดตั้งใหม่แล้วใช้ข้อมูลเดิมต่อได้</li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-lg font-semibold text-slate-900">ติดตั้งแล้วมีปัญหา? ทักมาได้เลย</p>
          <div className="mt-4">
            <LineButton />
          </div>
        </section>
      </div>
    </>
  );
}

import { site } from "@/config/site";

type Props = { trialDays: number };

/** ขั้นตอนหลังดาวน์โหลด (ตัวติดตั้งยังไม่ได้เซ็นโค้ด จึงต้องอธิบายหน้าจอเตือนของ Windows) */
export function NextSteps({ trialDays }: Props) {
  const steps = [
    <>เปิดไฟล์ที่ดาวน์โหลด</>,
    <>
      ถ้า Windows ขึ้น &quot;Windows protected your PC&quot; ให้กด <strong>More info</strong> แล้วกด{" "}
      <strong>Run anyway</strong> (ตัวติดตั้งยังไม่ได้เซ็นโค้ด)
    </>,
    <>
      ติดตั้งเสร็จ เปิด &quot;เปิดโปรแกรม&quot; จากเมนู Start → ตั้งค่าร้านครั้งแรก → กดเริ่มทดลองใช้ {trialDays} วัน
    </>,
    <>
      ครบกำหนดแล้วอยากใช้ต่อ แอด LINE {site.lineId} / โทร {site.phone}
    </>,
  ];
  return (
    <div data-testid="next-steps" className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold text-slate-900">ขั้นตอนต่อไป</h3>
      <ol className="mt-4 grid gap-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-slate-800">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

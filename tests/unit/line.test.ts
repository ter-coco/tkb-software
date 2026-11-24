import { formatLeadMessage } from "@/lib/line";

const lead = { product: "tkb-retail", name: "สมชาย", phone: "0859774474", kind: "download", consentVersion: "x", userAgent: "" } as const;
test("ข้อความดาวน์โหลด", () => expect(formatLeadMessage(lead, "TKB POS", new Date("2026-11-25T07:05:00Z"))).toBe(
  "🔔 มีคนดาวน์โหลดทดลองใช้\nโปรแกรม: TKB POS\nชื่อ: สมชาย\nเบอร์: 085-977-4474\nเวลา: 25/11/2569 14:05"));
test("ข้อความลงชื่อรับแจ้ง", () => expect(formatLeadMessage({ ...lead, kind: "notify" }, "TKB POS", new Date("2026-11-25T07:05:00Z")))
  .toMatch(/^🔔 ลงชื่อรับแจ้งเมื่อพร้อม\n/));

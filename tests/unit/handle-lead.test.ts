import { handleLead, type LeadDeps } from "@/lib/handle-lead";
import type { NewLead } from "@/lib/leads-repo";
import { site } from "@/config/site";

function deps(over: Partial<LeadDeps> = {}) {
  const inserted: NewLead[] = []; const sent: string[] = [];
  const d: LeadDeps = {
    repo: { insert: async l => { inserted.push(l); }, existsRecent: async () => false },
    notify: async t => { sent.push(t); },
    installer: () => ({ url: "https://example.test/TKB-Retail-Setup-1.0.0.exe", fileName: "TKB-Retail-Setup-1.0.0.exe", sizeMb: 90 }),
    now: () => new Date("2026-11-25T07:05:00Z"), ...over,
  };
  return { d, inserted, sent };
}
const body = { product: "pos", name: "สมชาย", phone: "085-977-4474", consent: true, website: "" };

test("พร้อมดาวน์โหลด: บันทึก kind=download ส่ง LINE คืนลิงก์", async () => {
  const { d, inserted, sent } = deps();
  const r = await handleLead(body, "UA", d);
  expect(r).toEqual({ status: 200, body: { ok: true, mode: "download", downloadUrl: "https://example.test/TKB-Retail-Setup-1.0.0.exe", fileName: "TKB-Retail-Setup-1.0.0.exe", sizeMb: 90 } });
  expect(inserted).toEqual([{ product: "tkb-retail", name: "สมชาย", phone: "0859774474", kind: "download", consentVersion: site.consentVersion, userAgent: "UA" }]);
  expect(sent).toHaveLength(1);
});
test("ระบบคลาวด์ (FaceScan): คืนลิงก์หน้าสมัคร บันทึก kind=download ข้อความ LINE ว่าไปสมัคร", async () => {
  const { d, inserted, sent } = deps();
  const r = await handleLead({ ...body, product: "facescan" }, "", d);
  expect(r).toEqual({ status: 200, body: { ok: true, mode: "signup", signupUrl: "https://facescan.tkbcon.com/signup" } });
  expect(inserted[0]).toMatchObject({ product: "tkb-facescan", kind: "download" });
  expect(sent[0]).toMatch(/^🔔 มีคนไปสมัครทดลองใช้\nโปรแกรม: TKB FaceScan\n/);
});
test("ยังไม่มีตัวติดตั้ง: kind=notify ไม่มีลิงก์", async () => {
  const { d, inserted } = deps({ installer: () => null });
  expect((await handleLead(body, "", d)).body).toEqual({ ok: true, mode: "notify" });
  expect(inserted[0].kind).toBe("notify");
});
test("LINE พัง: ยังบันทึกและได้ลิงก์", async () => {
  const { d, inserted } = deps({ notify: async () => { throw new Error("line down"); } });
  const r = await handleLead(body, "", d);
  expect(r.status).toBe(200); expect(r.body).toMatchObject({ mode: "download" }); expect(inserted).toHaveLength(1);
});
test("ส่งซ้ำภายใน 10 นาที: ไม่บันทึก ไม่ส่ง LINE แต่ได้ลิงก์", async () => {
  let asked: unknown[] = [];
  const { d, inserted, sent } = deps();
  d.repo.existsRecent = async (...a) => { asked = a; return true; };
  expect((await handleLead(body, "", d)).body).toMatchObject({ mode: "download" });
  expect(asked).toEqual(["tkb-retail", "0859774474", 10]); expect(inserted).toEqual([]); expect(sent).toEqual([]);
});
test("honeypot มีค่า: ตอบเหมือนสำเร็จ แต่ไม่บันทึก ไม่ส่ง LINE", async () => {
  const { d, inserted, sent } = deps();
  expect((await handleLead({ ...body, website: "http://spam" }, "", d)).status).toBe(200);
  expect(inserted).toEqual([]); expect(sent).toEqual([]);
});
test("ข้อมูลผิด: 400 พร้อม errors ไม่บันทึก", async () => {
  const { d, inserted } = deps();
  const r = await handleLead({ ...body, phone: "123" }, "", d);
  expect(r.status).toBe(400); expect(r.body).toMatchObject({ ok: false, errors: { phone: expect.any(String) } }); expect(inserted).toEqual([]);
});
test("ฐานข้อมูลพัง: 500 พร้อมข้อความไทย ไม่ส่ง LINE ไม่ให้ลิงก์", async () => {
  const { d, sent } = deps({ repo: { insert: async () => { throw new Error("db"); }, existsRecent: async () => false } });
  expect(await handleLead(body, "", d)).toEqual({ status: 500, body: { ok: false, message: site.saveErrorMessage } });
  expect(sent).toEqual([]);
});

test("existsRecent พัง: ถือว่าไม่ซ้ำ บันทึก ส่ง LINE และให้ลิงก์", async () => {
  const { d, inserted, sent } = deps();
  d.repo.existsRecent = async () => { throw new Error("db"); };
  const r = await handleLead(body, "", d);
  expect(r.status).toBe(200); expect(r.body).toMatchObject({ mode: "download" });
  expect(inserted).toHaveLength(1); expect(sent).toHaveLength(1);
});
test("userAgent ยาวเกิน 300 ถูกตัดเหลือ 300", async () => {
  const { d, inserted } = deps();
  await handleLead(body, "x".repeat(500), d);
  expect(inserted[0].userAgent).toHaveLength(300);
});
test("โปรแกรมที่ไม่มี: 400 ไม่บันทึก", async () => {
  const { d, inserted } = deps();
  for (const product of ["nope", "hr"]) {
    const r = await handleLead({ ...body, product }, "", d);
    expect(r.status).toBe(400);
  }
  expect(inserted).toEqual([]);
});

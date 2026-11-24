import { validateLead } from "@/lib/lead";

const ok = { product: "pos", name: "  สมชาย   ใจดี ", phone: "085-977-4474", consent: true, website: "" };
test("ผ่าน: ตัดช่องว่างชื่อ และ normalize เบอร์", () =>
  expect(validateLead(ok)).toEqual({ ok: true, value: { ...ok, name: "สมชาย ใจดี", phone: "0859774474" } }));
test("ข้อความผิดพลาดภาษาไทย", () => {
  const r = validateLead({ product: "hotel", name: "   ", phone: "02-123-4567", consent: false });
  expect(r).toEqual({ ok: false, errors: {
    product: "ไม่พบโปรแกรมนี้", name: "กรุณากรอกชื่อ",
    phone: "กรุณากรอกเบอร์มือถือ 10 หลัก เช่น 081-234-5678", consent: "กรุณาติ๊กยินยอมก่อนส่งข้อมูล",
  } });
});
test("ชื่อยาวเกิน 100", () =>
  expect(validateLead({ ...ok, name: "ก".repeat(101) })).toMatchObject({ ok: false, errors: { name: "ชื่อยาวเกิน 100 ตัวอักษร" } }));
test("body ไม่ใช่ object", () => expect(validateLead(null).ok).toBe(false));

import { getProduct } from "@/config/products";
import { normalizeThaiPhone } from "@/lib/phone";

export type LeadField = "product" | "name" | "phone" | "consent";
export type LeadInput = { product: string; name: string; phone: string; consent: true; website: string };

export function validateLead(
  body: unknown,
): { ok: true; value: LeadInput } | { ok: false; errors: Partial<Record<LeadField, string>> } {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const errors: Partial<Record<LeadField, string>> = {};

  const product = typeof b.product === "string" ? b.product : "";
  if (getProduct(product)?.status !== "available") errors.product = "ไม่พบโปรแกรมนี้";

  const name = typeof b.name === "string" ? b.name.trim().replace(/\s+/g, " ") : "";
  if (!name) errors.name = "กรุณากรอกชื่อ";
  else if (name.length > 100) errors.name = "ชื่อยาวเกิน 100 ตัวอักษร";

  const phone = typeof b.phone === "string" ? normalizeThaiPhone(b.phone) : null;
  if (!phone) errors.phone = "กรุณากรอกเบอร์มือถือ 10 หลัก เช่น 081-234-5678";

  if (b.consent !== true) errors.consent = "กรุณาติ๊กยินยอมก่อนส่งข้อมูล";

  if (Object.keys(errors).length > 0 || !phone) return { ok: false, errors };
  const website = typeof b.website === "string" ? b.website : "";
  return { ok: true, value: { product, name, phone, consent: true, website } };
}

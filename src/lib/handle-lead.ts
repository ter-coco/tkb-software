import { site } from "@/config/site";
import { getProduct } from "@/config/products";
import { validateLead, type LeadField } from "@/lib/lead";
import { formatLeadMessage } from "@/lib/line-format";
import type { LeadsRepo, NewLead } from "@/lib/leads-repo";

export type LeadDeps = {
  repo: LeadsRepo;
  notify: (text: string) => Promise<void>;
  installer: (slug: string) => { url: string; fileName: string; sizeMb: number } | null;
  now: () => Date;
};

export type LeadResponse =
  | { ok: true; mode: "download"; downloadUrl: string; fileName: string; sizeMb: number }
  | { ok: true; mode: "signup"; signupUrl: string }
  | { ok: true; mode: "notify" }
  | { ok: false; errors?: Partial<Record<LeadField, string>>; message?: string };

const DUPLICATE_WINDOW_MINUTES = 10;

export async function handleLead(
  body: unknown,
  userAgent: string,
  deps: LeadDeps,
): Promise<{ status: 200 | 400 | 500; body: LeadResponse }> {
  const v = validateLead(body);
  if (!v.ok) return { status: 400, body: { ok: false, errors: v.errors } };
  const input = v.value;
  const product = getProduct(input.product);
  if (!product) return { status: 400, body: { ok: false, errors: { product: "ไม่พบโปรแกรมนี้" } } };

  const cloud = product.delivery === "cloud";
  const inst = cloud ? null : deps.installer(input.product);
  const signupUrl = cloud ? product.signupUrl : undefined;
  const result: LeadResponse = inst
    ? { ok: true, mode: "download", downloadUrl: inst.url, fileName: inst.fileName, sizeMb: inst.sizeMb }
    : signupUrl
      ? { ok: true, mode: "signup", signupUrl }
      : { ok: true, mode: "notify" };
  const gotTrial = Boolean(inst || signupUrl);

  if (input.website) return { status: 200, body: result };

  // หมายเหตุ: การกันซ้ำ 10 นาทีไม่ atomic (check แล้วค่อย insert); ฝั่ง client กันกดซ้ำพร้อมกันอยู่แล้ว
  let recent = false;
  try {
    recent = await deps.repo.existsRecent(product.code, input.phone, DUPLICATE_WINDOW_MINUTES);
  } catch (e) {
    console.error("existsRecent failed", e);
  }
  if (recent) return { status: 200, body: result };

  const lead: NewLead = {
    product: product.code,
    name: input.name,
    phone: input.phone,
    // "download" = ได้ทางไปทดลองใช้แล้ว (ลิงก์ติดตั้ง หรือหน้าสมัครของระบบคลาวด์)
    kind: gotTrial ? "download" : "notify",
    consentVersion: site.consentVersion,
    userAgent: userAgent.slice(0, 300),
  };
  try {
    await deps.repo.insert(lead);
  } catch (e) {
    console.error("lead insert failed", e);
    return { status: 500, body: { ok: false, message: site.saveErrorMessage } };
  }

  try {
    await deps.notify(formatLeadMessage(lead, product.shortName, deps.now(), { cloud }));
  } catch (e) {
    console.error("LINE notify failed", e);
  }
  return { status: 200, body: result };
}

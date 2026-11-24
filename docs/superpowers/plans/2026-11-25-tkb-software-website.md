# เว็บไซต์ TKB Software — แผนการสร้าง

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เว็บแนะนำโปรแกรมของ TKB Software ที่ให้เจ้าของกิจการดูคลิป/จุดเด่น แล้วกรอกชื่อ+เบอร์เพื่อรับลิงก์ดาวน์โหลดตัวทดลองใช้ โดยบันทึกรายชื่อลง Supabase ของ license-server และแจ้งเข้า LINE ของ KAWIN

**Architecture:** Next.js 15 App Router แยกโปรเจกต์ บน Vercel · ข้อมูลโปรแกรมทั้งหมดอยู่ใน config ในโค้ด (`src/config/`) · ฟอร์มส่งไป Route Handler `POST /api/leads` ซึ่งตรวจข้อมูล → บันทึกลงตาราง `download_leads` ผ่าน `pg` + `DATABASE_URL` (ฝั่งเซิร์ฟเวอร์เท่านั้น แบบเดียวกับ `C:\dev\tkb-license`) → ส่ง LINE (พลาดได้ไม่กระทบ) → คืนลิงก์ไฟล์ติดตั้งจาก GitHub Releases · เว็บไม่เรียก API ของ license-server เลย

**Tech Stack:** Next.js 15.5 · React 19 · TypeScript · Tailwind CSS 4 · `pg` · Vitest (unit) · Playwright (e2e) · `next/font` IBM Plex Sans Thai · lucide-react

**Spec:** `docs/superpowers/specs/2026-11-24-tkb-software-website-design.md`

## Global Constraints

- Next.js `15.5.x` App Router + TypeScript + Tailwind CSS 4, deploy บน Vercel (เวอร์ชันเดียวกับ `grocery store` / `tkb-license`: `next 15.5.29`, `react 19.1.0`)
- ฐานข้อมูล: Supabase โปรเจกต์ **TKB-License** เข้าผ่าน env `DATABASE_URL` (Transaction pooler พอร์ต 6543) ใน server code เท่านั้น · ห้ามมี `NEXT_PUBLIC_*` ที่เกี่ยวกับฐานข้อมูล · ห้ามใช้ anon key · ไฟล์ที่แตะฐานข้อมูลขึ้นต้นด้วย `import "server-only"`
- ตารางใหม่เปิด RLS ไม่มี policy (เหมือน `installs`, `license_events`)
- ภาษาไทยทั้งเว็บ · ใช้ได้ดีตั้งแต่จอกว้าง 360px · โทนแบบ A: พื้นขาว น้ำเงิน (`blue-700` เป็นสีหลัก), ตัวอักษร `slate-900/600`
- ติดต่อ: LINE `@793lptfr` (ลิงก์ `https://line.me/R/ti/p/%40793lptfr`), โทร `085-977-4474`
- เบอร์โทรเก็บเป็นตัวเลขล้วน 10 หลัก รูปแบบ `^0\d{9}$`
- ปุ่มดาวน์โหลดต้องมีข้อความ `ดาวน์โหลดฟรี ทดลองใช้ {trialDays} วัน` · ก่อนตัวติดตั้งพร้อม: `ลงชื่อรับแจ้งเมื่อพร้อม` (ฟอร์มเดียวกัน)
- ส่ง LINE ไม่สำเร็จ → ข้อมูลยังบันทึก และลูกค้ายังได้ลิงก์
- ไม่มีราคา/ตะกร้า/ชำระเงิน/บัญชีลูกค้า/หน้า admin/เดโมออนไลน์
- ไฟล์ติดตั้งเก็บบน **GitHub Releases** (repo สาธารณะแยก `tkb-software-releases`) — ไม่เก็บบน Vercel/Supabase · `TKB-Retail-Setup-1.0.0.exe` ขนาด ~90 MB (`C:\dev\grocery store\standalone\windows\output\`)
- ค่าที่รอคำตอบก่อนเปิดจริง (โดเมน, ข้อความยินยอม PDPA, ชื่อนิติบุคคล/ที่อยู่) แก้ได้จุดเดียวที่ `src/config/site.ts`
- **จำนวนวันทดลอง:** spec เขียน 30 วัน แต่ license-server ตั้ง `tkb-retail` ไว้ **15 วัน** (`products.trial_days`, `brand.ts TRIAL_DAYS`) — เว็บใช้ค่า `trialDays` ต่อโปรแกรมใน `src/config/products.ts` ตั้งเป็น `15` ให้ตรงกับที่โปรแกรมให้จริง · KAWIN ต้องยืนยันก่อนเปิดเว็บ (ถ้าจะเป็น 30 ให้แก้ทั้งหน้าแอดมิน license-server และค่านี้)

## Review Focus

1. **เบอร์หลายรูปแบบ:** `085-977-4474`, `085 977 4474`, `+66 85 977 4474`, `66859774474`, เลขไทย `๐๘๕๙๗๗๔๔๗๔` ต้องได้ `0859774474` ทั้งหมด; เบอร์บ้าน 9 หลัก `02-123-4567` ต้องถูกปฏิเสธพร้อมข้อความบอกว่าต้องเป็นมือถือ 10 หลัก — Task 2
2. **กดส่งซ้ำ / ดับเบิลคลิก:** ได้แถวเดียว และ LINE เดียว ปุ่มถูกปิดระหว่างส่ง และเซิร์ฟเวอร์ไม่บันทึกซ้ำถ้าเบอร์+โปรแกรมเดียวกันภายใน 10 นาที (แต่ยังคืนลิงก์) — Task 3, Task 6
3. **ฐานข้อมูลล่ม:** ลูกค้าเห็นข้อความไทยที่บอกทางไปต่อ (แอด LINE) ไม่ใช่หน้าว่าง/ข้อความ error อังกฤษ — Task 3, Task 6
4. **เปิดจากเบราว์เซอร์ในแอป LINE / http:** `navigator.clipboard` ไม่มีหรือถูกปฏิเสธ → ปุ่มคัดลอกลิงก์ต้องแสดงช่องลิงก์ให้กดค้างคัดลอกเองแทนการเงียบ — Task 6
5. **URL โปรแกรมที่ไม่มี หรือโปรแกรม "เร็ว ๆ นี้":** `/programs/xyz` และ `/programs/hotel` ต้องได้หน้า 404 ภาษาไทย ไม่ใช่หน้าดาวน์โหลด และ `POST /api/leads` ด้วย product ที่ไม่ใช่ available ต้องได้ 400 — Task 2, Task 5

---

## File Structure

```
package.json, next.config.ts, tsconfig.json, postcss.config.mjs, vitest.config.ts, playwright.config.ts, .env.local.example, .gitignore
sql/download_leads.sql            ตาราง download_leads (รันใน SQL Editor ของ TKB-License)
src/config/site.ts                ค่าระดับเว็บ: ชื่อ ติดต่อ บริษัท ข้อความยินยอม PDPA, consentVersion, siteUrl
src/config/products.ts            รายการโปรแกรม (type Product) + getProduct/availableProducts
src/config/installers.ts          (server-only) slug → URL ไฟล์ติดตั้ง + ขนาด · ไม่มี = ยังไม่พร้อม
src/lib/phone.ts                  normalizeThaiPhone, formatThaiPhone
src/lib/lead.ts                   validateLead (pure) + types
src/lib/datetime.ts               formatThaiDateTime
src/lib/db.ts                     (server-only) pg Pool
src/lib/leads-repo.ts             (server-only) LeadsRepo ที่ใช้ pg
src/lib/line.ts                   formatLeadMessage + pushLine (LINE Messaging API)
src/lib/handle-lead.ts            handleLead(input, deps) — ลำดับงานทั้งหมดของฟอร์ม
src/app/api/leads/route.ts        POST → handleLead ด้วย deps จริง
src/app/layout.tsx, globals.css   ฟอนต์ ธีม header/footer
src/app/page.tsx                  หน้าแรก: Hero + การ์ดโปรแกรม + ติดต่อ
src/app/programs/[slug]/page.tsx  หน้ารายละเอียด
src/app/install/page.tsx          วิธีติดตั้ง
src/app/privacy/page.tsx          นโยบายความเป็นส่วนตัว
src/app/not-found.tsx             404 ไทย
src/components/                   SiteHeader, SiteFooter, ProductCard, VideoEmbed, Screenshots, FeatureList,
                                  LeadForm (client), NextSteps, ShareToDesktop (client), LineButton
public/screenshots/pos/           pos-desk.png, setup.png (คัดลอกจาก C:\dev\grocery store\Claude outputs\)
tests/unit/*.test.ts              Vitest
tests/e2e/*.spec.ts               Playwright
```

---

### Task 1: ตั้งโปรเจกต์ + config เว็บและโปรแกรม

**Files:**
- Create: ทั้งโครงจาก `create-next-app`, `vitest.config.ts`, `.env.local.example`, `src/config/site.ts`, `src/config/products.ts`, `src/config/installers.ts`
- Test: `tests/unit/products.test.ts`

**Interfaces:**
- Produces:
  - `site` (const): `{ name: "TKB Software"; lineId: "@793lptfr"; lineUrl: "https://line.me/R/ti/p/%40793lptfr"; phone: "085-977-4474"; phoneHref: "tel:0859774474"; companyName: string; companyAddress: string; siteUrl: string; consentText: string; consentVersion: string; saveErrorMessage: string }`
  - `type ProductStatus = "available" | "coming-soon"`
  - `type Product = { slug: string; code: string; fullName: string; shortName: string; tagline: string; status: ProductStatus; trialDays: number; youtubeId?: string; features: { title: string; detail: string }[]; screenshots: { src: string; alt: string; width: number; height: number }[]; requirements: string[] }`
  - `products: Product[]`, `getProduct(slug: string): Product | undefined`, `availableProducts(): Product[]`
  - `getInstaller(slug: string): { url: string; fileName: string; sizeMb: number } | null` (server-only)

- [ ] **Step 1: สร้างโปรเจกต์**

Run (ใน `C:\dev\tkb-software-web` ซึ่งมี `docs/` อยู่แล้ว):
```
npx create-next-app@15.5.29 . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
npm i pg server-only lucide-react
npm i -D vitest @types/pg @playwright/test
git init
```
Expected: `npm run build` ผ่าน · ตรวจว่า `next` เป็น `15.5.29` และ Tailwind 4 (`@tailwindcss/postcss`)

`vitest.config.ts`: `globals: true` (test ในแผนไม่ import `test/expect`), environment `node`, include `tests/unit/**/*.test.ts`, alias `@` → `src`, alias `server-only` → ไฟล์ว่าง (เพื่อให้ test import โมดูล server ได้). เพิ่ม script `"test": "vitest run"`, `"e2e": "playwright test"`.

`.env.local.example`: `DATABASE_URL=`, `LINE_CHANNEL_ACCESS_TOKEN=`, `LINE_NOTIFY_TO=` (userId ของ KAWIN), `NEXT_PUBLIC_SITE_URL=` · `.gitignore` มี `.env*.local`

- [ ] **Step 2: เขียน test ที่ล้ม**

```ts
// tests/unit/products.test.ts
import { products, getProduct, availableProducts } from "@/config/products";
test("slug และ code ไม่ซ้ำ", () => {
  expect(new Set(products.map(p => p.slug)).size).toBe(products.length);
  expect(new Set(products.map(p => p.code)).size).toBe(products.length);
});
test("code ตรงกับรูปแบบรหัสของ license-server", () => {
  for (const p of products) expect(p.code).toMatch(/^[a-z][a-z0-9-]{1,39}$/);
});
test("โปรแกรมตอนเปิดเว็บ", () => {
  expect(products.map(p => [p.slug, p.code, p.status])).toEqual([
    ["pos", "tkb-retail", "available"],
    ["hotel", "tkb-hotel", "coming-soon"],
    ["hr", "tkb-hr", "coming-soon"],
  ]);
  expect(getProduct("pos")?.fullName).toBe("โปรแกรมร้านค้าปลีก-ขายส่งครบวงจร");
  expect(getProduct("pos")?.trialDays).toBe(15);
  expect(getProduct("nope")).toBeUndefined();
  expect(availableProducts().map(p => p.slug)).toEqual(["pos"]);
});
test("โปรแกรมพร้อมใช้มีจุดเด่นอย่างน้อย 6 ข้อ และภาพหน้าจอมี alt", () => {
  for (const p of availableProducts()) {
    expect(p.features.length).toBeGreaterThanOrEqual(6);
    for (const s of p.screenshots) expect(s.alt.length).toBeGreaterThan(0);
  }
});
```

- [ ] **Step 3: รัน `npx vitest run tests/unit/products.test.ts`** — Expected: FAIL (ไม่มีโมดูล)

- [ ] **Step 4: เขียน config**

`src/config/products.ts` — ค่าที่ spec กำหนด:
- POS: `fullName` "โปรแกรมร้านค้าปลีก-ขายส่งครบวงจร", `shortName` "TKB POS", `tagline` "ขายหน้าร้าน สต๊อก ลูกหนี้ รายงาน ครบในโปรแกรมเดียว ติดตั้งในเครื่อง ขายได้แม้เน็ตหลุด", `youtubeId` ไม่ใส่ (ยังไม่มีคลิป)
- `features` 10 ข้อ (title สั้น + detail หนึ่งประโยค จาก README ของ grocery store): ยิงบาร์โค้ด ราคาปลีก-ส่งปนในบิลเดียว (F4 สลับ) · ขายได้แม้เน็ตหลุด · สต๊อก + ตรวจนับด้วยมือถือหลายคนพร้อมกัน · ลูกค้า ขายเชื่อ วงเงิน ใบแจ้งหนี้ · ซื้อเข้า เจ้าหนี้ แนะนำสั่งซื้อ (คัดลอกส่ง LINE) · รายงาน + Dashboard ส่งออก Excel · ใบเสนอราคา A4 → ออกใบเสร็จ · ชำระพร้อมเพย์ QR ตามยอด · สิทธิ์ผู้ใช้ 5 ระดับ (เจ้าของ ผู้จัดการ แคชเชียร์ คนคุมสต๊อก ฝ่ายขาย) · ฐานสินค้าตั้งต้น 16,880 รายการ
- `screenshots`: `/screenshots/pos/pos-desk.png` (1366×800, alt "หน้าขาย POS: ยิงบาร์โค้ด สลับราคาปลีก/ส่งรายบรรทัด ยอดชำระ") และ `/screenshots/pos/setup.png` (1366×850, alt "ตั้งค่าร้านครั้งแรกหลังติดตั้ง")
- `requirements`: "Windows 10 (รุ่น 1809 ขึ้นไป) หรือ Windows 11 แบบ 64 บิต", "ต้องใช้สิทธิ์ผู้ดูแลเครื่อง (Administrator) ตอนติดตั้ง", "ต่ออินเทอร์เน็ตตอนเปิดใช้ครั้งแรกเพื่อเริ่มทดลองใช้", "มือถือ/แท็บเล็ตในร้านใช้งานผ่าน Wi-Fi วงเดียวกับเครื่องหลัก" — RAM/พื้นที่ดิสก์ยังไม่ใส่จนกว่าจะวัดจากตัวติดตั้งจริง (spec §10)
- Hotel: `fullName` "ระบบบริหารจัดการโรงแรมครบวงจร", `shortName` "TKB Hotel" · HR: `fullName` "ระบบ HR / ลงเวลา", `shortName` "TKB HR" · ทั้งสอง `features`/`screenshots`/`requirements` = `[]`, `trialDays` 15

คัดลอกภาพ: `C:\dev\grocery store\Claude outputs\7-pos-desk.png` → `public/screenshots/pos/pos-desk.png`, `1-setup.png` → `public/screenshots/pos/setup.png`

`src/config/site.ts` — ค่ารอยืนยัน (ใส่คอมเมนต์ `// TODO(ก่อนเปิดจริง)` ทุกตัว): `companyName` "บริษัท ทีเคบี คอน จำกัด (TKB CON Co.,Ltd.)", `companyAddress` "(รอยืนยันที่อยู่)", `siteUrl` = `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"`, `consentText` "ข้าพเจ้ายินยอมให้ TKB Software เก็บชื่อและเบอร์โทรนี้ เพื่อส่งลิงก์ดาวน์โหลด แจ้งเมื่อโปรแกรมพร้อม และติดต่อช่วยเหลือการติดตั้ง" (ขอบเขตแคบ — ไม่รวมการเสนอขาย จนกว่า KAWIN จะตัดสิน), `consentVersion` "2026-11-25", `saveErrorMessage` "ระบบบันทึกขัดข้อง กรุณาลองใหม่อีกครั้ง หรือแอด LINE @793lptfr เพื่อรับลิงก์"

`src/config/installers.ts`: `import "server-only"`; map `{ pos: null }` ตอนนี้ (ยังไม่อัปโหลด) — ใส่ค่าจริงใน Task 7

- [ ] **Step 5: รัน `npm test`** — Expected: PASS
- [ ] **Step 6: Commit** — `git add -A && git commit -m "chore: scaffold Next.js site with product and site config"`

---

### Task 2: เบอร์โทร + ตรวจข้อมูลฟอร์ม

**Files:**
- Create: `src/lib/phone.ts`, `src/lib/lead.ts`, `src/lib/datetime.ts`
- Test: `tests/unit/phone.test.ts`, `tests/unit/lead.test.ts`, `tests/unit/datetime.test.ts`

**Interfaces:**
- Consumes: `getProduct` (Task 1)
- Produces:
  - `normalizeThaiPhone(raw: string): string | null`, `formatThaiPhone(d10: string): string` (`"0859774474"` → `"085-977-4474"`)
  - `type LeadField = "product" | "name" | "phone" | "consent"`
  - `type LeadInput = { product: string; name: string; phone: string; consent: true; website: string }` (`product` = slug, `phone` normalize แล้ว, `website` = honeypot)
  - `validateLead(body: unknown): { ok: true; value: LeadInput } | { ok: false; errors: Partial<Record<LeadField, string>> }`
  - `formatThaiDateTime(d: Date): string`

- [ ] **Step 1: เขียน test ที่ล้ม**

```ts
// tests/unit/phone.test.ts
test.each([
  "085-977-4474", "085 977 4474", "0859774474", "+66 85 977 4474", "+66859774474", "66859774474", "๐๘๕-๙๗๗-๔๔๗๔",
])("normalize %s", raw => expect(normalizeThaiPhone(raw)).toBe("0859774474"));
test.each(["02-123-4567", "12345", "1859774474", "085977447412", "", "abc"])("ปฏิเสธ %s", raw =>
  expect(normalizeThaiPhone(raw)).toBeNull());
test("format", () => expect(formatThaiPhone("0859774474")).toBe("085-977-4474"));

// tests/unit/lead.test.ts
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

// tests/unit/datetime.test.ts
test("เวลาไทย พ.ศ.", () => expect(formatThaiDateTime(new Date("2026-11-25T07:05:00Z"))).toBe("25/11/2569 14:05"));
```

- [ ] **Step 2: รัน `npm test`** — Expected: FAIL (ไม่มีโมดูล)
- [ ] **Step 3: Implement**
  - `normalizeThaiPhone`: แปลงเลขไทย `๐-๙` → `0-9`, ตัดทุกอย่างที่ไม่ใช่ตัวเลข, ถ้าขึ้นต้น `66` และยาว 11 → `"0" + rest`, ผ่านเมื่อ `^0\d{9}$`
  - `validateLead`: product ต้อง `getProduct(slug)?.status === "available"`; name: `trim` + ยุบช่องว่างซ้ำ, ว่าง/เกิน 100 ผิด; consent ต้อง `=== true`; `website` ถ้าไม่ใช่ string ให้เป็น `""`
  - `formatThaiDateTime`: `Intl.DateTimeFormat` `timeZone: "Asia/Bangkok"`, ปี + 543, รูปแบบ `DD/MM/YYYY HH:mm` 24 ชม.
- [ ] **Step 4: รัน `npm test`** — Expected: PASS
- [ ] **Step 5: Commit** — `git commit -am "feat: phone normalization and lead validation"` (add ไฟล์ใหม่ก่อน)

---

### Task 3: บันทึกรายชื่อ + แจ้ง LINE + API

**Files:**
- Create: `sql/download_leads.sql`, `src/lib/db.ts`, `src/lib/leads-repo.ts`, `src/lib/line.ts`, `src/lib/handle-lead.ts`, `src/app/api/leads/route.ts`
- Test: `tests/unit/line.test.ts`, `tests/unit/handle-lead.test.ts`

**Interfaces:**
- Consumes: `validateLead`, `LeadInput`, `formatThaiPhone`, `formatThaiDateTime` (Task 2) · `getProduct`, `site` (Task 1) · `getInstaller` (Task 1)
- Produces:
  - `type LeadKind = "download" | "notify"`
  - `type NewLead = { product: string /* code เช่น tkb-retail */; name: string; phone: string; kind: LeadKind; consentVersion: string; userAgent: string }`
  - `interface LeadsRepo { insert(lead: NewLead): Promise<void>; existsRecent(product: string, phone: string, minutes: number): Promise<boolean> }` · `pgLeadsRepo: LeadsRepo`
  - `formatLeadMessage(lead: NewLead, shortName: string, at: Date): string` · `pushLine(text: string): Promise<void>` (throw เมื่อไม่สำเร็จหรือไม่มี env)
  - `type LeadDeps = { repo: LeadsRepo; notify: (text: string) => Promise<void>; installer: (slug: string) => { url: string; fileName: string; sizeMb: number } | null; now: () => Date }`
  - `type LeadResponse = { ok: true; mode: "download"; downloadUrl: string; fileName: string; sizeMb: number } | { ok: true; mode: "notify" } | { ok: false; errors?: Partial<Record<LeadField, string>>; message?: string }`
  - `handleLead(body: unknown, userAgent: string, deps: LeadDeps): Promise<{ status: 200 | 400 | 500; body: LeadResponse }>`
  - `POST /api/leads` รับ JSON `{ product, name, phone, consent, website }` คืน `LeadResponse` ตาม status

- [ ] **Step 1: เขียน SQL** `sql/download_leads.sql` (รันซ้ำได้):

```sql
create table if not exists public.download_leads (
  id              bigserial primary key,
  product         text not null,                       -- รหัสโปรแกรม เช่น tkb-retail (ตรงกับ installs.product)
  name            text not null check (length(name) between 1 and 100),
  phone           text not null check (phone ~ '^0[0-9]{9}$'),  -- ตัวเลขล้วน 10 หลัก ใช้จับคู่ installs.phone ภายหลัง
  kind            text not null check (kind in ('download','notify')),
  consent_version text not null,
  user_agent      text not null default '',
  created_at      timestamptz not null default now()
);
create index if not exists download_leads_phone on public.download_leads (product, phone, created_at desc);
alter table public.download_leads enable row level security;   -- ไม่มี policy = API สาธารณะเข้าไม่ได้
```
ไม่ทำ FK ไป `products` เพราะเว็บอาจมีโปรแกรมก่อนลงทะเบียนใน license-server

- [ ] **Step 2: เขียน test ที่ล้ม**

```ts
// tests/unit/line.test.ts
const lead = { product: "tkb-retail", name: "สมชาย", phone: "0859774474", kind: "download", consentVersion: "x", userAgent: "" } as const;
test("ข้อความดาวน์โหลด", () => expect(formatLeadMessage(lead, "TKB POS", new Date("2026-11-25T07:05:00Z"))).toBe(
  "🔔 มีคนดาวน์โหลดทดลองใช้\nโปรแกรม: TKB POS\nชื่อ: สมชาย\nเบอร์: 085-977-4474\nเวลา: 25/11/2569 14:05"));
test("ข้อความลงชื่อรับแจ้ง", () => expect(formatLeadMessage({ ...lead, kind: "notify" }, "TKB POS", new Date("2026-11-25T07:05:00Z")))
  .toMatch(/^🔔 ลงชื่อรับแจ้งเมื่อพร้อม\n/));

// tests/unit/handle-lead.test.ts — fake deps
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
```

- [ ] **Step 3: รัน `npm test`** — Expected: FAIL

- [ ] **Step 4: Implement**
  - `db.ts`: `import "server-only"`; `Pool` สร้างครั้งเดียวต่อ instance (`globalThis` cache), `connectionString: process.env.DATABASE_URL`, `max: 3`, `ssl: { rejectUnauthorized: false }` — แบบเดียวกับ `C:\dev\tkb-license\src\lib\db.ts`
  - `leads-repo.ts`: `insert` = parameterized insert; `existsRecent` = `select 1 from public.download_leads where product=$1 and phone=$2 and created_at > now() - make_interval(mins => $3) limit 1`
  - `line.ts`: `pushLine` POST `https://api.line.me/v2/bot/message/push`, header `Authorization: Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`, body `{ to: LINE_NOTIFY_TO, messages: [{ type: "text", text }] }`, `signal: AbortSignal.timeout(5000)`, throw เมื่อ env ขาดหรือ `!res.ok`
  - `handle-lead.ts`: ลำดับ validate → honeypot (คืนผลแบบสำเร็จตาม installer โดยไม่บันทึก) → `existsRecent(code, phone, 10)` → `insert` (พัง = 500 + `console.error`) → `notify` ใน try/catch (`console.error` เมื่อพัง) → คืนผล · `userAgent` ตัดที่ 300 ตัวอักษร · `existsRecent` พังให้ถือว่า `false` แล้วไปต่อ
  - `route.ts`: `export const runtime = "nodejs"`; `req.json()` พัง → 400 `{ ok: false, message: "ข้อมูลไม่ถูกต้อง" }`; เรียก `handleLead(body, req.headers.get("user-agent") ?? "", { repo: pgLeadsRepo, notify: pushLine, installer: getInstaller, now: () => new Date() })` แล้ว `Response.json(body, { status })`
- [ ] **Step 5: รัน `npm test`** — Expected: PASS
- [ ] **Step 6: ทดสอบกับฐานจริง (ทำเมื่อมี `.env.local`)** — รัน `sql/download_leads.sql` ใน Supabase SQL Editor ของ **TKB-License** แล้ว `npm run dev` และ
  `curl -s -X POST localhost:3000/api/leads -H "content-type: application/json" -d "{\"product\":\"pos\",\"name\":\"ทดสอบ\",\"phone\":\"0811111111\",\"consent\":true,\"website\":\"\"}"`
  Expected: `{"ok":true,"mode":"notify"}` และมีแถวใน `download_leads` (ลบแถวทดสอบหลังเช็ก)
- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: lead API with Supabase storage and LINE notification"`

---

### Task 4: โครงหน้า + หน้าแรก

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/components/SiteHeader.tsx`, `SiteFooter.tsx`, `ProductCard.tsx`, `LineButton.tsx`, `src/app/not-found.tsx`
- Test: `tests/e2e/home.spec.ts`, `playwright.config.ts`

**Interfaces:**
- Consumes: `products`, `site`, `Product` (Task 1)
- Produces: `<LineButton label?: string />` (ลิงก์ `site.lineUrl`, ไอคอน + สีเขียว LINE `#06C755`) · `<ProductCard product: Product />` · footer มี `id="contact"`

- [ ] **Step 1: ตั้ง Playwright** — `playwright.config.ts`: `webServer: { command: "npm run build && npm run start", url: "http://localhost:3000" }`, projects `desktop` (1280×800) และ `mobile` (devices["Pixel 7"]) · `npx playwright install chromium`

- [ ] **Step 2: เขียน test ที่ล้ม**

```ts
// tests/e2e/home.spec.ts
test("หน้าแรก: hero การ์ด 3 ใบ และติดต่อ", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "TKB Software" })).toBeVisible();
  await expect(page.getByRole("link", { name: /ดาวน์โหลดทดลองใช้/ }).first()).toHaveAttribute("href", "/programs/pos#download");
  const cards = page.getByTestId("product-card");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText("TKB POS");
  await expect(cards.nth(1)).toContainText("เร็ว ๆ นี้");
  await expect(cards.nth(1).getByRole("link", { name: /LINE/ })).toHaveAttribute("href", "https://line.me/R/ti/p/%40793lptfr");
  await expect(page.locator("#contact")).toContainText("085-977-4474");
});
test("ไม่มีแนวนอนล้นจอ", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
test("404 ภาษาไทย", async ({ page }) => {
  const res = await page.goto("/programs/xyz");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("ไม่พบหน้านี้")).toBeVisible();
});
```

- [ ] **Step 3: รัน `npx playwright test tests/e2e/home.spec.ts`** — Expected: FAIL
- [ ] **Step 4: Implement** ตามแบบ A ใน spec §5:
  - `layout.tsx`: `lang="th"`, ฟอนต์ `IBM_Plex_Sans_Thai` น้ำหนัก 400/600/700 subsets `thai`,`latin`; metadata title template `%s | TKB Software`, `metadataBase` = `site.siteUrl`, OG image = `/screenshots/pos/pos-desk.png`
  - Header: โลโก้ข้อความ "TKB Software" (สี่เหลี่ยมมนน้ำเงิน "TKB" + ชื่อ) ซ้าย · เมนู โปรแกรม (`/#programs`) / วิธีติดตั้ง (`/install`) / ติดต่อ (`/#contact`) ขวา; มือถือเมนูย่อเป็นแถวลิงก์เล็ก (ไม่ต้องมี hamburger)
  - Hero: ซ้าย H1 "โปรแกรมสำหรับเจ้าของกิจการ ติดตั้งในเครื่อง ใช้งานได้จริง" + บรรทัดรอง = tagline ของ POS + ปุ่มหลัก "ดาวน์โหลดทดลองใช้" → `/programs/pos#download` + ลิงก์ "ดูคลิป" → `/programs/pos#video` (แสดงเฉพาะเมื่อ POS มี `youtubeId`); ขวา ภาพ `pos-desk.png` ในกรอบหน้าต่าง (เงา + มุมมน) ด้วย `next/image` `priority`
  - Section `id="programs"`: การ์ด 3 ใบ (`data-testid="product-card"`) — available: กรอบ `border-blue-600` ring, ชื่อสั้น + ชื่อเต็ม + tagline + ลิงก์ "ดูรายละเอียด"; coming-soon: พื้นเทา ข้อความเทา ป้าย "เร็ว ๆ นี้" + `<LineButton label="แอด LINE รับแจ้งเตือน" />` ไม่มีลิงก์ไปหน้ารายละเอียด
  - Footer `id="contact"`: LineButton, ลิงก์โทร `site.phoneHref`, ชื่อบริษัท, ลิงก์ "นโยบายความเป็นส่วนตัว"
  - `not-found.tsx`: "ไม่พบหน้านี้" + ลิงก์กลับหน้าแรก
- [ ] **Step 5: รัน e2e** — Expected: PASS ทั้ง desktop และ mobile
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: layout and home page"`

---

### Task 5: หน้ารายละเอียดโปรแกรม

**Files:**
- Create: `src/app/programs/[slug]/page.tsx`, `src/components/VideoEmbed.tsx`, `Screenshots.tsx`, `FeatureList.tsx`
- Test: `tests/e2e/product.spec.ts`

**Interfaces:**
- Consumes: `getProduct`, `availableProducts`, `Product` (Task 1) · `getInstaller` (Task 1) · `<LineButton>` (Task 4)
- Produces: section `id="download"` ที่ render `<LeadForm slug productName trialDays ready />` (Task 6 สร้างคอมโพเนนต์ — ใน task นี้ใส่ placeholder `<div data-testid="lead-form-slot" />`) · section `id="video"` (มีเมื่อมี `youtubeId`)

- [ ] **Step 1: เขียน test ที่ล้ม**

```ts
// tests/e2e/product.spec.ts
test("หน้า POS มีครบทุกส่วน", async ({ page }) => {
  await page.goto("/programs/pos");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("โปรแกรมร้านค้าปลีก-ขายส่งครบวงจร");
  await expect(page.getByText("by TKB Software")).toBeVisible();
  for (const id of ["features", "screenshots", "download", "requirements", "install"])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#video")).toHaveCount(0);           // ยังไม่มีคลิป → ซ่อน
  await expect(page.locator("#features li")).toHaveCount(10);
  await expect(page.locator("#requirements")).toContainText("Windows 10");
  await expect(page.locator("#install a[href='/install']")).toBeVisible();
  await expect(page.getByRole("link", { name: /LINE/ }).first()).toBeVisible();
});
test("โปรแกรมเร็ว ๆ นี้ไม่มีหน้าดาวน์โหลด", async ({ page }) => {
  expect((await page.goto("/programs/hotel"))?.status()).toBe(404);
});
```

- [ ] **Step 2: รัน** — Expected: FAIL
- [ ] **Step 3: Implement**
  - `generateStaticParams` = `availableProducts()`; `dynamicParams = false`; ถ้า `getProduct(slug)?.status !== "available"` → `notFound()`; `generateMetadata` ใช้ `fullName` + `tagline`
  - ลำดับ section: หัว (H1 fullName, "by TKB Software", tagline, ปุ่มไป `#download` ข้อความ `ดาวน์โหลดฟรี ทดลองใช้ {trialDays} วัน` หรือ `ลงชื่อรับแจ้งเมื่อพร้อม` ตาม `getInstaller(slug) !== null`, LineButton "สอบถาม / ซื้อลิขสิทธิ์") → `#video` (YouTube `youtube-nocookie.com/embed/{id}`, aspect 16:9, `loading="lazy"`) → `#features` (grid 2 คอลัมน์บนจอใหญ่, ไอคอน lucide `CheckCircle2`) → `#screenshots` (`next/image` + caption = alt, คลิกเปิดภาพเต็มในแท็บใหม่) → `#download` (slot) → `#requirements` (ul) → `#install` (สรุป 3 บรรทัด: ดาวน์โหลด → ติดตั้ง → เปิดโปรแกรมแล้วเริ่มทดลองใช้ + ลิงก์ "ดูวิธีติดตั้งแบบละเอียด" `/install`) → แถบติดต่อ "ครบ {trialDays} วันแล้วอยากใช้ต่อ? แอด LINE @793lptfr หรือโทร 085-977-4474"
- [ ] **Step 4: รัน e2e** — Expected: PASS
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: product detail page"`

---

### Task 6: ฟอร์มดาวน์โหลด + ขั้นตอนหลังดาวน์โหลด + ส่งลิงก์ไปคอม

**Files:**
- Create: `src/components/LeadForm.tsx` (client), `NextSteps.tsx`, `ShareToDesktop.tsx` (client)
- Modify: `src/app/programs/[slug]/page.tsx` (แทน slot ด้วย LeadForm)
- Test: `tests/e2e/lead-form.spec.ts`

**Interfaces:**
- Consumes: `POST /api/leads` + `LeadResponse` (Task 3) · `site` (Task 1)
- Produces: `<LeadForm slug: string; productName: string; trialDays: number; ready: boolean />` · `<ShareToDesktop url: string />` · `<NextSteps trialDays: number />`

- [ ] **Step 1: เขียน test ที่ล้ม** (mock API ด้วย `page.route`)

```ts
// tests/e2e/lead-form.spec.ts
const ok = { ok: true, mode: "download", downloadUrl: "https://example.test/TKB-Retail-Setup-1.0.0.exe", fileName: "TKB-Retail-Setup-1.0.0.exe", sizeMb: 90 };
async function fill(page: Page) {
  await page.getByLabel("ชื่อ").fill("สมชาย");
  await page.getByLabel("เบอร์มือถือ").fill("085-977-4474");
  await page.getByRole("checkbox").check();
}
test("ส่งสำเร็จ: ได้ปุ่มดาวน์โหลดและขั้นตอนต่อไป", async ({ page }) => {
  let calls = 0, sent: any;
  await page.route("/api/leads", async r => { calls++; sent = r.request().postDataJSON(); await new Promise(f => setTimeout(f, 300)); await r.fulfill({ json: ok }); });
  await page.goto("/programs/pos#download");
  await fill(page);
  const btn = page.getByRole("button", { name: /ดาวน์โหลดฟรี ทดลองใช้ 15 วัน|ลงชื่อรับแจ้งเมื่อพร้อม/ });
  await btn.dblclick();
  await expect(page.getByRole("link", { name: /ดาวน์โหลดไฟล์ติดตั้ง/ })).toHaveAttribute("href", ok.downloadUrl);
  await expect(page.getByTestId("next-steps")).toContainText("Run anyway");
  expect(calls).toBe(1);
  expect(sent).toMatchObject({ product: "pos", name: "สมชาย", phone: "085-977-4474", consent: true, website: "" });
});
test("โหมดรับแจ้ง", async ({ page }) => {
  await page.route("/api/leads", r => r.fulfill({ json: { ok: true, mode: "notify" } }));
  await page.goto("/programs/pos"); await fill(page);
  await page.getByRole("button", { name: /ดาวน์โหลดฟรี|ลงชื่อรับแจ้ง/ }).click();
  await expect(page.getByText(/ลงชื่อเรียบร้อย/)).toBeVisible();
});
test("แสดง error รายช่องจากเซิร์ฟเวอร์ และข้อความเมื่อระบบขัดข้อง", async ({ page }) => {
  await page.route("/api/leads", r => r.fulfill({ status: 400, json: { ok: false, errors: { phone: "กรุณากรอกเบอร์มือถือ 10 หลัก เช่น 081-234-5678" } } }));
  await page.goto("/programs/pos"); await fill(page);
  await page.getByRole("button", { name: /ดาวน์โหลดฟรี|ลงชื่อรับแจ้ง/ }).click();
  await expect(page.getByText("กรุณากรอกเบอร์มือถือ 10 หลัก เช่น 081-234-5678")).toBeVisible();
  await page.unroute("/api/leads");
  await page.route("/api/leads", r => r.fulfill({ status: 500, json: { ok: false, message: "ระบบบันทึกขัดข้อง กรุณาลองใหม่อีกครั้ง หรือแอด LINE @793lptfr เพื่อรับลิงก์" } }));
  await page.getByRole("button", { name: /ดาวน์โหลดฟรี|ลงชื่อรับแจ้ง/ }).click();
  await expect(page.getByRole("alert")).toContainText("@793lptfr");
});
test("ไม่ติ๊กยินยอม: ไม่ส่ง", async ({ page }) => {
  let calls = 0; await page.route("/api/leads", r => { calls++; return r.fulfill({ json: ok }); });
  await page.goto("/programs/pos");
  await page.getByLabel("ชื่อ").fill("สมชาย"); await page.getByLabel("เบอร์มือถือ").fill("0859774474");
  await page.getByRole("button", { name: /ดาวน์โหลดฟรี|ลงชื่อรับแจ้ง/ }).click();
  await expect(page.getByText("กรุณาติ๊กยินยอมก่อนส่งข้อมูล")).toBeVisible(); expect(calls).toBe(0);
});
test.describe("มือถือ", () => {
  test.skip(({ isMobile }) => !isMobile);
  test("คัดลอกลิงก์ไม่ได้ → แสดงช่องลิงก์ให้คัดลอกเอง", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: undefined }));
    await page.goto("/programs/pos");
    await page.getByRole("button", { name: "คัดลอกลิงก์" }).click();
    await expect(page.getByRole("textbox", { name: "ลิงก์หน้านี้" })).toHaveValue(/\/programs\/pos$/);
    await expect(page.getByRole("link", { name: "ส่งเข้า LINE" })).toHaveAttribute("href", /^https:\/\/line\.me\/R\/share\?text=/);
  });
});
```

- [ ] **Step 2: รัน `npx playwright test tests/e2e/lead-form.spec.ts`** — Expected: FAIL
- [ ] **Step 3: Implement**
  - `LeadForm`: ช่อง "ชื่อ" (`autoComplete="name"`), "เบอร์มือถือ" (`inputMode="tel"`, `autoComplete="tel"`), checkbox ข้อความ `site.consentText` + ลิงก์ "นโยบายความเป็นส่วนตัว" (`/privacy`), honeypot `name="website"` ซ่อนด้วย CSS (`absolute -left-[9999px]`, `tabIndex={-1}`, `aria-hidden`) · ตรวจ consent/ชื่อว่างฝั่ง client ด้วยข้อความเดียวกับ Task 2 ก่อนส่ง (เบอร์ให้เซิร์ฟเวอร์ตัดสิน) · state `pending` ปิดปุ่มและเปลี่ยนข้อความเป็น "กำลังส่ง…" — ป้องกันดับเบิลคลิกด้วย ref guard ไม่ใช่แค่ `disabled` · ปุ่มส่ง: `ready ? \`ดาวน์โหลดฟรี ทดลองใช้ ${trialDays} วัน\` : "ลงชื่อรับแจ้งเมื่อพร้อม"` · ใต้ปุ่ม: "ไม่มีค่าใช้จ่าย · ไม่ต้องใส่บัตรเครดิต"
  - fetch พัง (network) → แสดง `site.saveErrorMessage` ใน `role="alert"`
  - สำเร็จ `download`: แทนฟอร์มด้วยปุ่มใหญ่ `ดาวน์โหลดไฟล์ติดตั้ง ({sizeMb} MB)` (`href=downloadUrl`) + บรรทัด "ไฟล์: {fileName} · ใช้กับ Windows เท่านั้น" + `<NextSteps>` + (มือถือ `md:hidden`) `<ShareToDesktop url={downloadUrl} />` พร้อมข้อความ "กำลังเปิดจากมือถือ? ส่งลิงก์นี้ไปเปิดบนคอมพิวเตอร์"
  - สำเร็จ `notify`: "ลงชื่อเรียบร้อย เราจะติดต่อกลับทางเบอร์ที่ให้ไว้เมื่อโปรแกรมพร้อมดาวน์โหลด" + LineButton
  - `NextSteps` (`data-testid="next-steps"`) 4 ขั้น: 1) เปิดไฟล์ที่ดาวน์โหลด 2) ถ้า Windows ขึ้น "Windows protected your PC" กด **More info** แล้ว **Run anyway** (ตัวติดตั้งยังไม่ได้เซ็นโค้ด) 3) ติดตั้งเสร็จ เปิด "เปิดโปรแกรม" จากเมนู Start → ตั้งค่าร้านครั้งแรก → กดเริ่มทดลองใช้ {trialDays} วัน 4) ครบกำหนดแล้วอยากใช้ต่อ แอด LINE @793lptfr / โทร 085-977-4474
  - `ShareToDesktop`: ปุ่ม "คัดลอกลิงก์" → `navigator.clipboard?.writeText(url)`; ไม่มี/reject → แสดง `<input readOnly aria-label="ลิงก์หน้านี้" value={url}>` แล้ว `select()`; สำเร็จ → "คัดลอกแล้ว" 2 วินาที · ลิงก์ "ส่งเข้า LINE" `https://line.me/R/share?text=${encodeURIComponent(url)}`
  - หน้ารายละเอียด: ใต้ปุ่มหัวหน้า (เฉพาะมือถือ) ใส่ `<ShareToDesktop url={\`${site.siteUrl}/programs/${slug}\`} />`
- [ ] **Step 4: รัน `npx playwright test`** — Expected: PASS ทั้งหมด
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: lead form, next steps and share-to-desktop"`

---

### Task 7: หน้าวิธีติดตั้ง + นโยบายความเป็นส่วนตัว + ขึ้น Vercel

**Files:**
- Create: `src/app/install/page.tsx`, `src/app/privacy/page.tsx`, `README.md`
- Modify: `src/config/installers.ts`, `src/config/site.ts` (เพิ่ม `retentionText`)
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `site`, `availableProducts` (Task 1) · `<NextSteps>` (Task 6)

- [ ] **Step 1: เขียน test ที่ล้ม**

```ts
// tests/e2e/pages.spec.ts
test("วิธีติดตั้ง", async ({ page }) => {
  await page.goto("/install");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("วิธีติดตั้ง");
  await expect(page.getByText("Run anyway").first()).toBeVisible();
  await expect(page.getByRole("img", { name: "ตั้งค่าร้านครั้งแรกหลังติดตั้ง" })).toBeVisible();
});
test("นโยบายความเป็นส่วนตัว", async ({ page }) => {
  await page.goto("/privacy");
  for (const t of ["ชื่อ", "เบอร์โทร", "085-977-4474", "@793lptfr"]) await expect(page.locator("main")).toContainText(t);
});
```

- [ ] **Step 2: รัน** — Expected: FAIL
- [ ] **Step 3: Implement**
  - `/install`: H1 "วิธีติดตั้ง" · ส่วนต่อโปรแกรม (วน `availableProducts()`): สเปกเครื่อง (`requirements`) → `<NextSteps>` แบบขยาย พร้อมภาพ `setup.png` ที่ขั้นตั้งค่าร้าน → หัวข้อ "ใช้งานจากมือถือในร้าน": เปิด `http://<IP เครื่องหลัก>:3000` ใน Wi-Fi เดียวกัน → "ข้อมูลอยู่ที่ไหน": ข้อมูลอยู่ในเครื่อง ถอนโปรแกรมแล้วข้อมูลยังอยู่ ติดตั้งใหม่ใช้ต่อได้ (จาก `standalone/README.md`) · คอมเมนต์ในไฟล์: เติมเวลาติดตั้ง/พื้นที่ดิสก์เมื่อวัดจากตัวติดตั้งจริง
  - `/privacy`: หัวข้อ ผู้เก็บข้อมูล (`companyName`, `companyAddress`) · ข้อมูลที่เก็บ (ชื่อ เบอร์โทร โปรแกรมที่สนใจ เวลา ข้อมูลเบราว์เซอร์) · วัตถุประสงค์ (ตรงกับ `consentText`) · ระยะเวลาเก็บ (2 ปีนับจากวันที่กรอก แล้วลบ — ตั้งไว้ให้ KAWIN ยืนยัน ใน `site.ts` เป็น `retentionText`) · ไม่ขาย/ไม่เปิดเผยแก่บุคคลอื่น · สิทธิ์ขอดู/แก้/ลบ ติดต่อ LINE/โทร · วันที่ปรับปรุง = `consentVersion`
- [ ] **Step 4: รัน `npm test && npx playwright test && npm run lint && npm run build`** — Expected: ผ่านทั้งหมด
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: install guide and privacy policy pages"`
- [ ] **Step 6: เผยแพร่ (KAWIN ทำเอง หรือยืนยันก่อนทุกข้อ — เป็นการเผยแพร่สู่สาธารณะ)**
  1. รัน `sql/download_leads.sql` ใน Supabase **TKB-License**
  2. LINE Developers: ใช้ Messaging API channel ของ LINE OA `@793lptfr` → ออก Channel access token (long-lived) · หา userId ของ KAWIN (Basic settings → Your user ID)
  3. สร้าง repo สาธารณะ `tkb-software-releases` → Release tag `tkb-retail-v1.0.0` → แนบ `TKB-Retail-Setup-1.0.0.exe`
  4. แก้ `src/config/installers.ts`: `pos: { url: "https://github.com/<owner>/tkb-software-releases/releases/download/tkb-retail-v1.0.0/TKB-Retail-Setup-1.0.0.exe", fileName: "TKB-Retail-Setup-1.0.0.exe", sizeMb: 90 }` → commit
  5. Vercel: โปรเจกต์ใหม่ `tkb-software-web` · env `DATABASE_URL` (ค่าเดียวกับ tkb-license), `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_NOTIFY_TO`, `NEXT_PUBLIC_SITE_URL` (= URL ของ Vercel จนกว่าจะมีโดเมน)
  6. ทดสอบบนเว็บจริง: กรอกฟอร์มด้วยมือถือ → ได้ลิงก์, มีแถวใน `download_leads`, LINE เด้งเข้า KAWIN · ดาวน์โหลดไฟล์บนคอมแล้วติดตั้งได้
- [ ] **Step 7: เขียน `README.md`** — วิธีรัน, env, วิธีเพิ่มโปรแกรมใหม่ (เพิ่มใน `products.ts` → ภาพใน `public/screenshots/<slug>/` → ใส่ installer ใน `installers.ts`), วิธีปล่อยตัวติดตั้งรุ่นใหม่ (Release ใหม่ + แก้ `installers.ts`), ค่าที่ต้องยืนยันก่อนเปิดจริงใน `site.ts` → commit

# TKB Software — เว็บไซต์แนะนำและดาวน์โหลดโปรแกรม

Next.js 15 (App Router) + Tailwind 4 · เก็บรายชื่อผู้ดาวน์โหลดลง Postgres (Supabase) · แจ้งเตือนเข้า LINE

## วิธีรัน

```bash
npm install
cp .env.local.example .env.local   # แล้วกรอกค่าด้านล่าง
npm run dev        # http://localhost:3000
npm test           # unit test (vitest)
npm run e2e        # Playwright (build + start เองบนพอร์ต 3100)
npx tsc --noEmit && npm run lint && npm run build
```

Playwright รันเซิร์ฟเวอร์ทดสอบบนพอร์ต **3100** (ตั้งเองได้ด้วย `E2E_PORT`) เพื่อไม่ชนกับ `npm run dev` ที่พอร์ต 3000

## Environment variables

| ตัวแปร | ความหมาย |
| --- | --- |
| `DATABASE_URL` | Postgres ของ Supabase โปรเจกต์ TKB-License (ค่าเดียวกับ tkb-license) |
| `LINE_CHANNEL_ACCESS_TOKEN` | Channel access token (long-lived) ของ LINE OA `@793lptfr` |
| `LINE_NOTIFY_TO` | userId ของ KAWIN ที่จะรับแจ้งเตือน |
| `NEXT_PUBLIC_SITE_URL` | URL ของเว็บ (ใช้ Vercel URL จนกว่าจะมีโดเมน) |

ลำดับการหา URL ของเว็บ: `NEXT_PUBLIC_SITE_URL` → `https://$VERCEL_PROJECT_PRODUCTION_URL` → `http://localhost:3000` (ค่าว่างถือว่าไม่ได้ตั้ง, ถ้าไม่มี `https://` จะเติมให้, ตัด `/` ท้ายออก)

ค่า `NEXT_PUBLIC_*` ถูกฝังลงในโค้ดตอน build ดังนั้นเมื่อเปลี่ยนโดเมนหรือแก้ค่านี้ ต้อง **redeploy** ใหม่ถึงจะมีผล

## การแจ้งเตือนเจ้าของ และการเฝ้าระวัง

- แจ้งเตือนเข้า LINE ใช้ Messaging API push message ซึ่งนับโควตาข้อความรายเดือนของ LINE OA (แพ็กเกจฟรีโควตาน้อย ตรวจโควตาปัจจุบันใน LINE OA Manager) เมื่อโควตาหมด การ push จะล้มเหลวแบบเงียบ ๆ (เห็นเฉพาะใน Vercel logs)
- ตาราง Supabase `download_leads` คือแหล่งข้อมูลจริง (source of truth) ให้เปิดตรวจเป็นประจำ ห้ามพึ่งแต่ LINE
- ป้องกันการยิงถี่: ตั้ง rate limit ที่ Vercel Firewall (ไม่มีโค้ด rate limit ในแอป) ดูขั้นตอนในรายการเปิดเว็บจริง

## วิธีเพิ่มโปรแกรมใหม่

1. เพิ่มรายการใน `src/config/products.ts` (`status: "available"` เมื่อพร้อมให้ดาวน์โหลด)
2. ใส่ภาพหน้าจอใน `public/screenshots/<slug>/` แล้วอ้างใน `screenshots`
3. ใส่ตัวติดตั้งใน `src/config/installers.ts` (ถ้ายังเป็น `null` ฟอร์มจะเป็นแบบ "ลงชื่อรับแจ้งเมื่อพร้อม")

## วิธีปล่อยตัวติดตั้งรุ่นใหม่

1. สร้าง Release ใหม่ใน repo `tkb-software-releases` (tag เช่น `tkb-retail-v1.0.1`) แล้วแนบไฟล์ `.exe`
2. แก้ `url`, `fileName`, `sizeMb` ใน `src/config/installers.ts`
3. commit และ push ให้ Vercel deploy

## ค่าที่ต้องยืนยันก่อนเปิดจริง

ค้นหา `TODO(ก่อนเปิดจริง)` ใน `src/config/` และตรวจรายการเหล่านี้:

- `site.ts`: `companyName`, `companyAddress` (ตอนนี้ยังเป็น "รอยืนยันที่อยู่"), `siteUrl`, `consentText` (ขอบเขตแคบ ไม่รวมการเสนอขาย), `consentVersion` (เปลี่ยนทุกครั้งที่แก้ `consentText`), `retentionText` (2 ปี), `saveErrorMessage`
- หน้า `/privacy`: ให้เจ้าของตรวจถ้อยคำ (หรือให้ผู้เชี่ยวชาญด้านกฎหมายตรวจ) ก่อนเปิดจริง
- `products.ts`: `trialDays` = 15 วัน (เจ้าของยืนยันแล้ว 25/11/2569 · ตรงกับ license server) — ถ้าเปลี่ยนวันทดลองใน license server ต้องแก้ค่านี้ด้วย
- ข้อความหน้าจอเตือนใน `NextSteps.tsx` (คำเตือนของ Edge/Chrome "ไม่ได้ดาวน์โหลดโดยทั่วไป", เก็บไว้ / เก็บไว้ต่อไป, "Windows ปกป้องพีซีของคุณ", ข้อมูลเพิ่มเติม, เรียกใช้ต่อไป): เจ้าของต้องยืนยันข้อความภาษาไทยที่แน่นอนบนเครื่อง Windows ภาษาไทยจริง
- `products.ts` `requirements` และหน้า `/install`: เติม RAM, พื้นที่ดิสก์ และเวลาติดตั้งเมื่อวัดจากตัวติดตั้งจริง

## ขั้นตอนเปิดเว็บจริง (เจ้าของทำเอง เป็นการเผยแพร่สู่สาธารณะ)

- [ ] 1. รัน `sql/download_leads.sql` ใน Supabase โปรเจกต์ **TKB-License**
- [ ] 2. LINE Developers: ใช้ Messaging API channel ของ LINE OA `@793lptfr` → ออก Channel access token (long-lived) และหา userId ของ KAWIN (Basic settings → Your user ID)
- [ ] 3. สร้าง repo สาธารณะ `tkb-software-releases` → Release tag `tkb-retail-v1.0.0` → แนบ `TKB-Retail-Setup-1.0.0.exe`
- [ ] 4. แก้ `src/config/installers.ts` แล้ว commit:
  ```ts
  pos: { url: "https://github.com/<owner>/tkb-software-releases/releases/download/tkb-retail-v1.0.0/TKB-Retail-Setup-1.0.0.exe", fileName: "TKB-Retail-Setup-1.0.0.exe", sizeMb: 90 }
  ```
  (แก้เฉพาะค่า `pos` และตรวจ `sizeMb` ให้ตรงกับไฟล์จริง)
- [ ] 5. Vercel: สร้างโปรเจกต์ใหม่ `tkb-software-web` ใส่ env ทั้ง 4 ตัวด้านบน (`NEXT_PUBLIC_SITE_URL` = URL ของ Vercel จนกว่าจะมีโดเมน)
- [ ] 6. ทดสอบบนเว็บจริง: กรอกฟอร์มด้วยมือถือ → ได้ลิงก์ดาวน์โหลด, มีแถวใน `download_leads`, LINE เด้งเข้า KAWIN · ดาวน์โหลดไฟล์บนคอมแล้วติดตั้งได้
- [ ] 7. Vercel Firewall: สร้าง rate-limit rule ที่ path `/api/leads` (เช่น 5 requests ต่อนาทีต่อ IP)
- [ ] 8. ตรวจโควตา push ของ LINE OA ใน LINE OA Manager และตั้งนิสัยเปิดตาราง `download_leads` ตรวจเป็นประจำ

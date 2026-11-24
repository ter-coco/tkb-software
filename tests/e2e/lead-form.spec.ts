import { test, expect, type Page } from "@playwright/test";

const ok = { ok: true, mode: "download", downloadUrl: "https://example.test/TKB-Retail-Setup-1.0.0.exe", fileName: "TKB-Retail-Setup-1.0.0.exe", sizeMb: 90 };
async function fill(page: Page) {
  await page.getByLabel("ชื่อ").fill("สมชาย");
  await page.getByLabel("เบอร์มือถือ").fill("085-977-4474");
  await page.getByRole("checkbox").check();
}
test("ส่งสำเร็จ: ได้ปุ่มดาวน์โหลดและขั้นตอนต่อไป", async ({ page }) => {
  let calls = 0, sent: unknown;
  await page.route("/api/leads", async r => { calls++; sent = r.request().postDataJSON(); await new Promise(f => setTimeout(f, 300)); await r.fulfill({ json: ok }); });
  await page.goto("/programs/pos#download");
  await fill(page);
  const btn = page.getByRole("button", { name: /ดาวน์โหลดฟรี ทดลองใช้ 15 วัน|ลงชื่อรับแจ้งเมื่อพร้อม/ });
  await btn.dblclick();
  await expect(page.getByRole("link", { name: /ดาวน์โหลดไฟล์ติดตั้ง/ })).toHaveAttribute("href", ok.downloadUrl);
  await expect(page.getByTestId("next-steps")).toContainText("Run anyway");
  expect(calls).toBe(1);
  expect(sent as object).toMatchObject({ product: "pos", name: "สมชาย", phone: "085-977-4474", consent: true, website: "" });
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
  // Next.js มี route announcer (role=alert ว่าง) อยู่แล้ว จึงต้องกรองเอาเฉพาะข้อความของฟอร์ม
  await expect(page.getByRole("alert").filter({ hasText: "@793lptfr" })).toBeVisible();
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

import { test, expect } from "@playwright/test";

test("วิธีติดตั้ง", async ({ page }) => {
  await page.goto("/install");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("วิธีติดตั้ง");
  await expect(page.getByText("Run anyway").first()).toBeVisible();
  await expect(page.getByRole("img", { name: "ตั้งค่าร้านครั้งแรกหลังติดตั้ง" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ใช้งานจากมือถือในร้าน" })).toBeVisible();
  await expect(page.locator("main")).toContainText("http://<IP เครื่องหลัก>:3000");
  await expect(page.getByRole("heading", { name: "ข้อมูลอยู่ที่ไหน" })).toBeVisible();
  await expect(page.locator("main")).toContainText("Windows 10");
  const ai = page.locator("#ai");
  await expect(ai.getByRole("heading", { name: "ตั้งค่า AI อ่านบิล (ไม่บังคับ)" })).toBeVisible();
  await expect(ai).toContainText("ระบบ → ตั้งค่า AI อ่านบิล");
  await expect(ai).toContainText("1–2 บาทต่อบิล");
  await expect(ai.getByRole("link", { name: "Google AI Studio" })).toHaveAttribute("href", "https://aistudio.google.com/app/apikey");
});

test("นโยบายความเป็นส่วนตัว", async ({ page }) => {
  await page.goto("/privacy");
  for (const t of ["ชื่อ", "เบอร์โทร", "085-977-4474", "@793lptfr", "2 ปี", "2026-11-25", "Supabase", "Vercel", "LINE (แจ้งเตือน", "โดยสมัครใจ", "ถอนความยินยอม", "สคส."])
    await expect(page.locator("main")).toContainText(t);
});

for (const path of ["/install", "/privacy"]) {
  test(`${path} ไม่มีแนวนอนล้นจอ`, async ({ page }) => {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

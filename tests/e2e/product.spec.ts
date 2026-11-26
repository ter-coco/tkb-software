import { test, expect } from "@playwright/test";

test("หน้า POS มีครบทุกส่วน", async ({ page }) => {
  await page.goto("/programs/pos");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("โปรแกรมร้านค้าปลีก-ขายส่งครบวงจร");
  await expect(page.getByText("by TKB Software")).toBeVisible();
  for (const id of ["features", "screenshots", "download", "requirements", "install"])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#video")).toHaveCount(0); // ยังไม่มีคลิป → ซ่อน
  await expect(page.locator("#features li")).toHaveCount(11);
  await expect(page.locator("#features").getByRole("link", { name: /วิธีตั้งค่า AI อ่านบิล/ })).toHaveAttribute("href", "/install#ai");
  await expect(page.locator("#requirements")).toContainText("Windows 10");
  await expect(page.locator("#install a[href='/install']")).toBeVisible();
  await expect(page.getByRole("link", { name: /LINE/ }).first()).toBeVisible();
  // installers.ts มีตัวติดตั้ง POS แล้ว → ปุ่มหัวหน้าเป็นโหมดดาวน์โหลด
  await expect(page.getByRole("link", { name: "ดาวน์โหลดฟรี ทดลองใช้ 15 วัน" })).toHaveAttribute("href", "#download");
  await expect(page.locator("#download form")).toHaveCount(1);
  await expect(page.locator("#screenshots a[target='_blank']")).toHaveCount(2);
});

test("หน้า FaceScan: ระบบคลาวด์ สมัครทดลองใช้ ไม่มีขั้นตอน Windows", async ({ page }) => {
  await page.goto("/programs/facescan");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ระบบสแกนหน้าลงเวลาพนักงาน");
  await expect(page.locator("#features li")).toHaveCount(10);
  await expect(page.locator("#screenshots")).toHaveCount(0); // ยังไม่มีภาพ → ซ่อน
  await expect(page.getByRole("link", { name: "ทดลองใช้ฟรี 15 วัน" })).toHaveAttribute("href", "#download");
  await expect(page.locator("#download h2")).toHaveText("สมัครทดลองใช้ฟรี 15 วัน");
  await expect(page.locator("#download").getByRole("button", { name: "สมัครทดลองใช้ฟรี 15 วัน" })).toBeVisible();
  await expect(page.locator("#install")).toContainText("เริ่มใช้งานใน 3 ขั้นตอน");
  await expect(page.locator("#install a[href='/install']")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("Windows");
});

test("FaceScan: ส่งฟอร์มแล้วได้ปุ่มไปหน้าสมัคร", async ({ page }) => {
  await page.route("/api/leads", (r) =>
    r.fulfill({ json: { ok: true, mode: "signup", signupUrl: "https://facescan.tkbcon.com/signup" } }),
  );
  await page.goto("/programs/facescan");
  await page.getByLabel("ชื่อ").fill("สมชาย");
  await page.getByLabel("เบอร์มือถือ").fill("085-977-4474");
  await page.getByRole("checkbox").check();
  await page.locator("#download").getByRole("button", { name: "สมัครทดลองใช้ฟรี 15 วัน" }).click();
  await expect(page.getByRole("link", { name: "ไปหน้าสมัครทดลองใช้" })).toHaveAttribute("href", "https://facescan.tkbcon.com/signup");
  await expect(page.locator("#download")).toContainText("เพิ่มพนักงาน");
});

test("หน้า /install แสดงเฉพาะโปรแกรมที่ต้องติดตั้ง", async ({ page }) => {
  await page.goto("/install");
  await expect(page.locator("#facescan")).toHaveCount(0);
  await expect(page.locator("#pos")).toHaveCount(1);
});

test("ไม่มีแนวนอนล้นจอ", async ({ page }) => {
  await page.goto("/programs/pos");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("TKB Hotel เปิดหน้ารายละเอียดแบบคลาวด์", async ({ page }) => {
  expect((await page.goto("/programs/hotel"))?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ระบบบริหารจัดการโรงแรมครบวงจร");
});

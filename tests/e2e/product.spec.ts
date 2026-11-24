import { test, expect } from "@playwright/test";

test("หน้า POS มีครบทุกส่วน", async ({ page }) => {
  await page.goto("/programs/pos");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("โปรแกรมร้านค้าปลีก-ขายส่งครบวงจร");
  await expect(page.getByText("by TKB Software")).toBeVisible();
  for (const id of ["features", "screenshots", "download", "requirements", "install"])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#video")).toHaveCount(0); // ยังไม่มีคลิป → ซ่อน
  await expect(page.locator("#features li")).toHaveCount(10);
  await expect(page.locator("#requirements")).toContainText("Windows 10");
  await expect(page.locator("#install a[href='/install']")).toBeVisible();
  await expect(page.getByRole("link", { name: /LINE/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "ลงชื่อรับแจ้งเมื่อพร้อม" })).toHaveAttribute("href", "#download");
  await expect(page.locator("#download form")).toHaveCount(1);
  await expect(page.locator("#screenshots a[target='_blank']")).toHaveCount(2);
});

test("ไม่มีแนวนอนล้นจอ", async ({ page }) => {
  await page.goto("/programs/pos");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("โปรแกรมเร็ว ๆ นี้ไม่มีหน้าดาวน์โหลด", async ({ page }) => {
  expect((await page.goto("/programs/hotel"))?.status()).toBe(404);
});

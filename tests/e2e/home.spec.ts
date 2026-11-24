import { test, expect } from "@playwright/test";

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

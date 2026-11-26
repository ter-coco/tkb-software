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
    ["facescan", "tkb-facescan", "available"],
    ["hotel", "tkb-hotel", "available"],
  ]);
  expect(getProduct("pos")?.fullName).toBe("โปรแกรมร้านค้าปลีก-ขายส่งครบวงจร");
  expect(getProduct("pos")?.trialDays).toBe(15);
  expect(getProduct("facescan")?.fullName).toBe("ระบบสแกนหน้าลงเวลาพนักงาน");
  expect(getProduct("facescan")?.delivery).toBe("cloud");
  expect(getProduct("hotel")?.delivery).toBe("cloud");
  expect(getProduct("hotel")?.signupUrl).toBe("https://hotel.tkbcon.com/#trial");
  expect(getProduct("nope")).toBeUndefined();
  expect(availableProducts().map(p => p.slug)).toEqual(["pos", "facescan", "hotel"]);
});
test("โปรแกรมพร้อมใช้มีจุดเด่นอย่างน้อย 6 ข้อ และภาพหน้าจอมี alt", () => {
  for (const p of availableProducts()) {
    expect(p.features.length).toBeGreaterThanOrEqual(6);
    for (const s of p.screenshots) expect(s.alt.length).toBeGreaterThan(0);
    expect(p.startSteps.length).toBeGreaterThan(0);
  }
});

import { resolveSiteUrl } from "@/config/site-url";

test("ค่าว่างถือว่าไม่มี", () => expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "" })).toBe("http://localhost:3000"));
test("ไม่ตั้งค่า", () => expect(resolveSiteUrl({})).toBe("http://localhost:3000"));
test("ไม่มี scheme → เติม https://", () =>
  expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "tkb.example.com" })).toBe("https://tkb.example.com"));
test("ตัด / ท้าย", () =>
  expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://tkb.example.com//" })).toBe("https://tkb.example.com"));
test("ใช้ Vercel production URL เมื่อไม่มี NEXT_PUBLIC_SITE_URL", () =>
  expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "tkb.vercel.app" })).toBe(
    "https://tkb.vercel.app",
  ));
test("NEXT_PUBLIC_SITE_URL มาก่อน Vercel", () =>
  expect(
    resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://a.test", VERCEL_PROJECT_PRODUCTION_URL: "tkb.vercel.app" }),
  ).toBe("http://a.test"));

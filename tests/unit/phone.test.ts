import { normalizeThaiPhone, formatThaiPhone } from "@/lib/phone";

test.each([
  "085-977-4474", "085 977 4474", "0859774474", "+66 85 977 4474", "+66859774474", "66859774474", "๐๘๕-๙๗๗-๔๔๗๔",
])("normalize %s", raw => expect(normalizeThaiPhone(raw)).toBe("0859774474"));
test.each(["02-123-4567", "0212345678", "0000000000", "12345", "1859774474", "085977447412", "", "abc"])("ปฏิเสธ %s", raw =>
  expect(normalizeThaiPhone(raw)).toBeNull());
test("format", () => expect(formatThaiPhone("0859774474")).toBe("085-977-4474"));

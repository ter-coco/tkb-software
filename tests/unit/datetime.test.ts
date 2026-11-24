import { formatThaiDateTime } from "@/lib/datetime";

test("เวลาไทย พ.ศ.", () => expect(formatThaiDateTime(new Date("2026-11-25T07:05:00Z"))).toBe("25/11/2569 14:05"));

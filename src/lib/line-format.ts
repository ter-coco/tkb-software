import type { NewLead } from "@/lib/leads-repo";
import { formatThaiPhone } from "@/lib/phone";
import { formatThaiDateTime } from "@/lib/datetime";

export function formatLeadMessage(
  lead: NewLead,
  shortName: string,
  at: Date,
  opts: { cloud?: boolean } = {},
): string {
  const title =
    lead.kind === "notify"
      ? "🔔 ลงชื่อรับแจ้งเมื่อพร้อม"
      : opts.cloud
        ? "🔔 มีคนไปสมัครทดลองใช้"
        : "🔔 มีคนดาวน์โหลดทดลองใช้";
  return [
    title,
    `โปรแกรม: ${shortName}`,
    `ชื่อ: ${lead.name}`,
    `เบอร์: ${formatThaiPhone(lead.phone)}`,
    `เวลา: ${formatThaiDateTime(at)}`,
  ].join("\n");
}

import type { NewLead } from "@/lib/leads-repo";
import { formatThaiPhone } from "@/lib/phone";
import { formatThaiDateTime } from "@/lib/datetime";

export function formatLeadMessage(lead: NewLead, shortName: string, at: Date): string {
  const title = lead.kind === "download" ? "🔔 มีคนดาวน์โหลดทดลองใช้" : "🔔 ลงชื่อรับแจ้งเมื่อพร้อม";
  return [
    title,
    `โปรแกรม: ${shortName}`,
    `ชื่อ: ${lead.name}`,
    `เบอร์: ${formatThaiPhone(lead.phone)}`,
    `เวลา: ${formatThaiDateTime(at)}`,
  ].join("\n");
}

import "server-only";
export { formatLeadMessage } from "@/lib/line-format";

export async function pushLine(text: string): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_NOTIFY_TO;
  if (!token || !to) throw new Error("LINE env missing");
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ to, messages: [{ type: "text", text }] }),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`LINE push failed: ${res.status}`);
}

import { handleLead } from "@/lib/handle-lead";
import { pgLeadsRepo } from "@/lib/leads-repo";
import { pushLine } from "@/lib/line";
import { getInstaller } from "@/config/installers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  const { status, body: out } = await handleLead(body, req.headers.get("user-agent") ?? "", {
    repo: pgLeadsRepo,
    notify: pushLine,
    installer: getInstaller,
    now: () => new Date(),
  });
  return Response.json(out, { status });
}

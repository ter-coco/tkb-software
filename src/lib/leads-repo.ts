import "server-only";
import { db } from "@/lib/db";

export type LeadKind = "download" | "notify";
export type NewLead = {
  product: string;
  name: string;
  phone: string;
  kind: LeadKind;
  consentVersion: string;
  userAgent: string;
};
export interface LeadsRepo {
  insert(lead: NewLead): Promise<void>;
  existsRecent(product: string, phone: string, minutes: number): Promise<boolean>;
}

export const pgLeadsRepo: LeadsRepo = {
  async insert(l) {
    await db().query(
      "insert into public.download_leads (product, name, phone, kind, consent_version, user_agent) values ($1, $2, $3, $4, $5, $6)",
      [l.product, l.name, l.phone, l.kind, l.consentVersion, l.userAgent],
    );
  },
  async existsRecent(product, phone, minutes) {
    const r = await db().query(
      "select 1 from public.download_leads where product = $1 and phone = $2 and created_at > now() - make_interval(mins => $3) limit 1",
      [product, phone, minutes],
    );
    return r.rowCount !== null && r.rowCount > 0;
  },
};

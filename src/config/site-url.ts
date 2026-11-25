/** หา URL ของเว็บ: NEXT_PUBLIC_SITE_URL → Vercel production URL → localhost (ค่าว่างถือว่าไม่มี) */
export function resolveSiteUrl(env: {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
}): string {
  const raw =
    env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL.trim()}` : "") ||
    "http://localhost:3000";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}

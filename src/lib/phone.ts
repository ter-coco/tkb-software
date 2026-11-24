export function normalizeThaiPhone(raw: string): string | null {
  let digits = raw
    .replace(/[๐-๙]/g, c => String(c.charCodeAt(0) - 0x0e50))
    .replace(/\D/g, "");
  if (digits.startsWith("66") && digits.length === 11) digits = "0" + digits.slice(2);
  return /^0\d{9}$/.test(digits) ? digits : null;
}

export function formatThaiPhone(d10: string): string {
  return `${d10.slice(0, 3)}-${d10.slice(3, 6)}-${d10.slice(6)}`;
}

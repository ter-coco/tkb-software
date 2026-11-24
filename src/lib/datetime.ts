const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Bangkok",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatThaiDateTime(d: Date): string {
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(d)) p[part.type] = part.value;
  return `${p.day}/${p.month}/${Number(p.year) + 543} ${p.hour}:${p.minute}`;
}

import { site } from "@/config/site";

type Props = { label?: string };

/** ปุ่มแอด LINE ของร้าน (สีเขียว LINE #06C755) */
export function LineButton({ label = `แอด LINE ${site.lineId}` }: Props) {
  return (
    <a
      href={site.lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-line px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-line-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line"
    >
      <LineIcon />
      <span>{label}</span>
    </a>
  );
}

/** ไอคอนกรอบคำพูดแบบ LINE (วาดเอง ไม่ใช้ไฟล์โลโก้) */
function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0">
      <path
        fill="currentColor"
        d="M12 3C6.48 3 2 6.6 2 11.05c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.25.07.65.03.9l-.14.85c-.04.25-.2.98.86.53 1.06-.45 5.73-3.37 7.82-5.78C21.24 14.43 22 12.82 22 11.05 22 6.6 17.52 3 12 3Z"
      />
      <path
        fill="#06C755"
        d="M6.6 9.1h.9v3.6h1.95v.9H6.6V9.1Zm3.45 0h.9v4.5h-.9V9.1Zm1.8 0h.86l1.9 2.84V9.1h.9v4.5h-.86l-1.9-2.84v2.84h-.9V9.1Zm4.55 0h2.75V10h-1.85v.9h1.85v.9h-1.85v.9h1.85v.9H16.4V9.1Z"
      />
    </svg>
  );
}

export const site = {
  name: "TKB Software",
  lineId: "@793lptfr",
  lineUrl: "https://line.me/R/ti/p/%40793lptfr",
  phone: "085-977-4474",
  phoneHref: "tel:0859774474",
  // TODO(ก่อนเปิดจริง): ยืนยันชื่อนิติบุคคล
  companyName: "บริษัท ทีเคบี คอน จำกัด (TKB CON Co.,Ltd.)",
  // TODO(ก่อนเปิดจริง): ใส่ที่อยู่จริง
  companyAddress: "(รอยืนยันที่อยู่)",
  // TODO(ก่อนเปิดจริง): ตั้ง NEXT_PUBLIC_SITE_URL เป็นโดเมนจริง
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // TODO(ก่อนเปิดจริง): ขอบเขตแคบ ไม่รวมการเสนอขาย จนกว่า KAWIN จะตัดสิน
  consentText:
    "ข้าพเจ้ายินยอมให้ TKB Software เก็บชื่อและเบอร์โทรนี้ เพื่อส่งลิงก์ดาวน์โหลด แจ้งเมื่อโปรแกรมพร้อม และติดต่อช่วยเหลือการติดตั้ง",
  // TODO(ก่อนเปิดจริง): เปลี่ยนเลขเวอร์ชันทุกครั้งที่แก้ consentText
  consentVersion: "2026-11-25",
  // TODO(ก่อนเปิดจริง): ตรวจข้อความแจ้งข้อผิดพลาด
  saveErrorMessage:
    "ระบบบันทึกขัดข้อง กรุณาลองใหม่อีกครั้ง หรือแอด LINE @793lptfr เพื่อรับลิงก์",
} as const;

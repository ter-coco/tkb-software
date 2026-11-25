export type ProductStatus = "available" | "coming-soon";

export type Product = {
  slug: string;
  code: string;
  fullName: string;
  shortName: string;
  tagline: string;
  status: ProductStatus;
  trialDays: number;
  youtubeId?: string;
  features: { title: string; detail: string; link?: { href: string; label: string } }[];
  screenshots: { src: string; alt: string; width: number; height: number }[];
  requirements: string[];
};

export const products: Product[] = [
  {
    slug: "pos",
    code: "tkb-retail",
    fullName: "โปรแกรมร้านค้าปลีก-ขายส่งครบวงจร",
    shortName: "TKB POS",
    tagline:
      "ขายหน้าร้าน สต๊อก ลูกหนี้ รายงาน ครบในโปรแกรมเดียว ติดตั้งในเครื่อง ขายได้แม้เน็ตหลุด",
    status: "available",
    trialDays: 15,
    features: [
      { title: "ยิงบาร์โค้ด ราคาปลีก-ส่งในบิลเดียว", detail: "ยิงบาร์โค้ดขายได้ทันที และกด F4 สลับราคาปลีก/ส่งรายบรรทัดในบิลเดียวกัน" },
      { title: "ขายได้แม้เน็ตหลุด", detail: "โปรแกรมติดตั้งในเครื่อง ข้อมูลอยู่ที่ร้าน จึงเปิดบิลขายต่อได้แม้อินเทอร์เน็ตล่ม" },
      { title: "อ่านบิลซื้อ/PDF รับเข้าสต๊อกอัตโนมัติ", detail: "ถ่ายรูปใบเสร็จหรือเลือกไฟล์ PDF ระบบอ่านรายการ จับคู่สินค้าในร้าน และอัปเดตต้นทุนให้เอง แค่ตรวจทานแล้วกดรับเข้า ไม่ต้องคีย์ทีละรายการ · ใช้ AI ของ Gemini/OpenAI/Claude ด้วย API key ของร้าน (ประมาณ 1–2 บาท/บิล)", link: { href: "/install#ai", label: "วิธีตั้งค่า AI อ่านบิล" } },
      { title: "สต๊อกและตรวจนับด้วยมือถือ", detail: "ตรวจนับสต๊อกด้วยมือถือได้หลายคนพร้อมกัน ยอดรวมเข้าระบบทันที" },
      { title: "ลูกค้า ขายเชื่อ ใบแจ้งหนี้", detail: "จัดการข้อมูลลูกค้า ขายเชื่อ กำหนดวงเงิน และออกใบแจ้งหนี้ได้ในตัว" },
      { title: "ซื้อเข้า เจ้าหนี้ แนะนำสั่งซื้อ", detail: "บันทึกซื้อเข้าและเจ้าหนี้ พร้อมรายการแนะนำสั่งซื้อที่คัดลอกส่งทาง LINE ได้" },
      { title: "รายงานและ Dashboard", detail: "ดูยอดขายและกำไรผ่าน Dashboard และส่งออกรายงานเป็น Excel ได้" },
      { title: "ใบเสนอราคา A4 ออกใบเสร็จต่อได้", detail: "ทำใบเสนอราคาขนาด A4 แล้วแปลงเป็นใบเสร็จได้โดยไม่ต้องคีย์ซ้ำ" },
      { title: "ชำระพร้อมเพย์ QR ตามยอด", detail: "สร้าง QR พร้อมเพย์ตามยอดบิลให้ลูกค้าสแกนจ่ายได้ทันที" },
      { title: "สิทธิ์ผู้ใช้ 5 ระดับ", detail: "กำหนดสิทธิ์เจ้าของ ผู้จัดการ แคชเชียร์ คนคุมสต๊อก และฝ่ายขายแยกกัน" },
      { title: "ฐานสินค้าตั้งต้น 16,880 รายการ", detail: "มีฐานสินค้าตั้งต้นให้ 16,880 รายการ เริ่มขายได้เร็วโดยไม่ต้องคีย์สินค้าเอง" },
    ],
    screenshots: [
      { src: "/screenshots/pos/pos-desk.png", alt: "หน้าขาย POS: ยิงบาร์โค้ด สลับราคาปลีก/ส่งรายบรรทัด ยอดชำระ", width: 1366, height: 800 },
      { src: "/screenshots/pos/setup.png", alt: "ตั้งค่าร้านครั้งแรกหลังติดตั้ง", width: 1366, height: 850 },
    ],
    // RAM/พื้นที่ดิสก์ยังไม่ใส่ จนกว่าจะวัดจากตัวติดตั้งจริง (spec §10)
    requirements: [
      "Windows 10 (รุ่น 1809 ขึ้นไป) หรือ Windows 11 แบบ 64 บิต",
      "ต้องใช้สิทธิ์ผู้ดูแลเครื่อง (Administrator) ตอนติดตั้ง",
      "ต่ออินเทอร์เน็ตตอนเปิดใช้ครั้งแรกเพื่อเริ่มทดลองใช้",
      "มือถือ/แท็บเล็ตในร้านใช้งานผ่าน Wi-Fi วงเดียวกับเครื่องหลัก",
    ],
  },
  {
    slug: "hotel",
    code: "tkb-hotel",
    fullName: "ระบบบริหารจัดการโรงแรมครบวงจร",
    shortName: "TKB Hotel",
    tagline: "กำลังพัฒนา แอด LINE ไว้ แล้วเราจะแจ้งเมื่อเปิดให้ทดลองใช้",
    status: "coming-soon",
    trialDays: 15,
    features: [],
    screenshots: [],
    requirements: [],
  },
  {
    slug: "hr",
    code: "tkb-hr",
    fullName: "ระบบ HR / ลงเวลา",
    shortName: "TKB HR",
    tagline: "กำลังพัฒนา แอด LINE ไว้ แล้วเราจะแจ้งเมื่อเปิดให้ทดลองใช้",
    status: "coming-soon",
    trialDays: 15,
    features: [],
    screenshots: [],
    requirements: [],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function availableProducts(): Product[] {
  return products.filter((p) => p.status === "available");
}

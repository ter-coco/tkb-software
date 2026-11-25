import "server-only";

export type Installer = { url: string; fileName: string; sizeMb: number };

// ตัวติดตั้งบน GitHub Releases (ter-coco/tkb-software) · รุ่นใหม่: สร้าง Release ใหม่แล้วแก้ค่าที่นี่
// sha256 ของ 1.0.0: f2c67a21d93619eb967ab69e205bdc4cf6eca8dc8a224a43e29148d1665f9fba
const installers: Record<string, Installer | null> = {
  pos: {
    url: "https://github.com/ter-coco/tkb-software/releases/download/tkb-retail-v1.0.0/TKB-Retail-Setup-1.0.0.exe",
    fileName: "TKB-Retail-Setup-1.0.0.exe",
    sizeMb: 90,
  },
};

export function getInstaller(slug: string): Installer | null {
  return installers[slug] ?? null;
}

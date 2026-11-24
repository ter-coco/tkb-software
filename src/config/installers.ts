import "server-only";

export type Installer = { url: string; fileName: string; sizeMb: number };

// TODO(Task 7): ใส่ลิงก์ตัวติดตั้งจริงหลังอัปโหลด
const installers: Record<string, Installer | null> = {
  pos: null,
};

export function getInstaller(slug: string): Installer | null {
  return installers[slug] ?? null;
}

import { defineConfig, devices } from "@playwright/test";

// พอร์ต 3000 ในเครื่องนี้มีแอปอื่นใช้อยู่ จึงให้ e2e รันบนพอร์ตแยก (ตั้ง E2E_PORT ได้)
const port = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${port}`,
    url: baseURL,
    // ไม่ใช้ server ที่รันค้างอยู่ เพื่อไม่ให้เผลอทดสอบกับแอปอื่นบนพอร์ตเดียวกัน
    reuseExistingServer: false,
    timeout: 180_000,
  },
});

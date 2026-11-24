import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  weight: ["400", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-plex-thai",
});

const description =
  "โปรแกรมสำหรับเจ้าของกิจการ ติดตั้งในเครื่อง Windows ใช้งานได้จริง ดาวน์โหลดไปทดลองใช้ฟรี";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} — โปรแกรมสำหรับเจ้าของกิจการ`,
    template: `%s | ${site.name}`,
  },
  description,
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: site.name,
    description,
    images: [{ url: "/screenshots/pos/pos-desk.png", width: 1366, height: 800 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={plexThai.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

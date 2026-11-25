import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, BellRing, Phone, Rocket } from "lucide-react";
import { availableProducts, getProduct } from "@/config/products";
import { getInstaller } from "@/config/installers";
import { site } from "@/config/site";
import { LineButton } from "@/components/LineButton";
import { VideoEmbed } from "@/components/VideoEmbed";
import { FeatureList } from "@/components/FeatureList";
import { Screenshots } from "@/components/Screenshots";
import { LeadForm } from "@/components/LeadForm";
import { ShareToDesktop } from "@/components/ShareToDesktop";

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams() {
  return availableProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.status !== "available") return {};
  return { title: product.fullName, description: product.tagline };
}

export default async function ProgramPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.status !== "available") notFound();

  const cloud = product.delivery === "cloud";
  const ready = cloud ? Boolean(product.signupUrl) : getInstaller(slug) !== null;
  const ctaLabel = !ready
    ? "ลงชื่อรับแจ้งเมื่อพร้อม"
    : cloud
      ? `ทดลองใช้ฟรี ${product.trialDays} วัน`
      : `ดาวน์โหลดฟรี ทดลองใช้ ${product.trialDays} วัน`;
  const steps = product.startSteps;
  const h2 = "text-2xl font-bold text-slate-900 sm:text-3xl";
  const section = "mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6";

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <h1 className="max-w-3xl text-3xl leading-snug font-bold text-slate-900 sm:text-4xl lg:leading-[1.3]">
            {product.fullName}
          </h1>
          <p className="mt-2 text-sm font-semibold text-blue-700">by TKB Software</p>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">{product.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="#download"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-600/25 transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {!ready ? (
                <BellRing aria-hidden="true" className="size-5" />
              ) : cloud ? (
                <Rocket aria-hidden="true" className="size-5" />
              ) : (
                <Download aria-hidden="true" className="size-5" />
              )}
              {ctaLabel}
            </Link>
            <LineButton label="สอบถาม / ซื้อลิขสิทธิ์" />
          </div>
          {cloud ? null : (
            <ShareToDesktop
              url={`${site.siteUrl}/programs/${slug}`}
              hint="เปิดจากมือถือ? ส่งลิงก์ไปเปิดบนคอมพิวเตอร์"
            />
          )}
        </div>
      </section>

      {product.youtubeId ? (
        <section id="video" className={section}>
          <h2 className={h2}>ดูคลิปแนะนำโปรแกรม</h2>
          <div className="mt-6 max-w-4xl">
            <VideoEmbed youtubeId={product.youtubeId} title={`คลิปแนะนำ ${product.shortName}`} />
          </div>
        </section>
      ) : null}

      <section id="features" className={section}>
        <h2 className={h2}>สิ่งที่ {product.shortName} ทำได้</h2>
        <div className="mt-6">
          <FeatureList features={product.features} />
        </div>
      </section>

      {product.screenshots.length > 0 ? (
        <section id="screenshots" className={`${section} border-t border-slate-200`}>
          <h2 className={h2}>หน้าตาโปรแกรม</h2>
          <p className="mt-2 text-slate-600">คลิกที่ภาพเพื่อดูขนาดเต็ม</p>
          <div className="mt-6">
            <Screenshots screenshots={product.screenshots} />
          </div>
        </section>
      ) : null}

      <section id="download" className="scroll-mt-20 border-y border-blue-100 bg-blue-50/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className={h2}>
            {ready
              ? cloud
                ? `สมัครทดลองใช้ฟรี ${product.trialDays} วัน`
                : `ดาวน์โหลดฟรี ทดลองใช้ ${product.trialDays} วัน`
              : cloud
                ? "ลงชื่อรับแจ้งเมื่อเปิดให้ทดลองใช้"
                : "ลงชื่อรับแจ้งเมื่อพร้อมดาวน์โหลด"}
          </h2>
          <div className="mt-6 max-w-xl">
            <LeadForm
              slug={slug}
              productName={product.fullName}
              trialDays={product.trialDays}
              ready={ready}
              cloud={cloud}
              steps={product.startSteps}
            />
          </div>
        </div>
      </section>

      <section id="requirements" className={section}>
        <h2 className={h2}>ความต้องการของระบบ</h2>
        <ul className="mt-6 grid max-w-3xl list-disc gap-2 pl-6 text-slate-700 marker:text-blue-600">
          {product.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section id="install" className={`${section} border-t border-slate-200`}>
        <h2 className={h2}>
          {cloud ? "เริ่มใช้งาน" : "ติดตั้งง่าย"}ใน {steps.length} ขั้นตอน
        </h2>
        <ol className="mt-6 grid max-w-3xl gap-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-4 text-slate-800">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-600 font-bold text-white">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        {cloud ? (
          <p className="mt-6 max-w-3xl text-slate-600">ไม่ต้องติดตั้งโปรแกรม ใช้งานผ่านเว็บเบราว์เซอร์ได้ทันที</p>
        ) : (
          <Link href="/install" className="mt-6 inline-block font-semibold text-blue-700 hover:text-blue-800">
            ดูวิธีติดตั้งแบบละเอียด
          </Link>
        )}
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p className="flex items-start gap-2 text-lg font-semibold text-slate-900">
            <Phone aria-hidden="true" className="mt-1 size-5 shrink-0 text-blue-600" />
            <span>
              ครบ {product.trialDays} วันแล้วอยากใช้ต่อ? แอด LINE {site.lineId} หรือโทร{" "}
              <a href={site.phoneHref} className="text-blue-700 hover:text-blue-800">
                {site.phone}
              </a>
            </span>
          </p>
          <LineButton />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Geist, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import SiteShell from "@/components/SiteShell";
import { createSeoMetadata, defaultDescription, siteUrl } from "@/lib/seo";
import "@/styles/globals.css";
import "@/styles/tunnel.css";
import "@/styles/admissions.css";
import "@/styles/portal.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const dmMono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-dm", display: "swap" });

export const metadata: Metadata = {
  ...createSeoMetadata({ path: "/" }),
  metadataBase: new URL(siteUrl),
  title: { default: "SYNAPSE — Investigación que transforma", template: "%s | SYNAPSE" },
  applicationName: "SYNAPSE",
  keywords: [
    "SYNAPSE", "semillero de investigación", "Uniclaretiana", "Fundación Universitaria Claretiana",
    "Quibdó", "Chocó", "investigación aplicada", "inteligencia artificial",
    "desarrollo de software", "ciencia de datos", "innovación tecnológica",
  ],
  authors: [{ name: "Semillero de investigación SYNAPSE" }],
  category: "educación e investigación",
  robots: {
    index: process.env.VERCEL_ENV !== "preview",
    follow: process.env.VERCEL_ENV !== "preview",
    googleBot: { index: process.env.VERCEL_ENV !== "preview", follow: process.env.VERCEL_ENV !== "preview" },
  },
  icons: { icon: "/favicon.ico" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SYNAPSE",
  alternateName: "Semillero de investigación SYNAPSE",
  url: siteUrl,
  logo: new URL("/synapse-brandmark-v3.png", siteUrl).toString(),
  description: defaultDescription,
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "Fundación Universitaria Claretiana — Uniclaretiana",
  },
  areaServed: { "@type": "Place", name: "Quibdó, Chocó, Colombia" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${dmMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }} />
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <SiteShell>{children}</SiteShell>
        <Toaster richColors position="bottom-right" closeButton />
      </body>
    </html>
  );
}

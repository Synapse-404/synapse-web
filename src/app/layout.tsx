import type { Metadata } from "next";
import { Geist, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const dmMono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-dm", display: "swap" });

export const metadata: Metadata = {
  title: { default: "SYNAPSE — Investigación que transforma", template: "%s · SYNAPSE" },
  description: "Semillero de investigación de Uniclaretiana en Quibdó, Chocó. Investigación, software, datos e inteligencia artificial con propósito territorial.",
  openGraph: {
    title: "SYNAPSE — Investigación que transforma",
    description: "Investigamos, desarrollamos e impactamos. Tecnología con propósito desde el Chocó.",
    images: [{ url: "/metal-human.jpg", width: 1200, height: 896, alt: "Visual tecnológico de SYNAPSE" }],
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${dmMono.variable}`}>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
        <Toaster richColors position="bottom-right" closeButton />
        <SpeedInsights />
      </body>
    </html>
  );
}

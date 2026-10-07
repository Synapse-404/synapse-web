import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const dmMono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-dm" });

export const metadata: Metadata = {
    title: "SYNAPSE · Semillero de Investigación",
    description: "Semillero de investigación de Uniclaretiana Quibdó. Innovación y tecnología desde el Chocó para el mundo.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} ${dmMono.variable} font-body antialiased`}>
                <Navbar />
                <main className="pt-[var(--navbar-height)]">{children}</main>
                <Footer />
                <Toaster richColors position="bottom-right" closeButton />
                <SpeedInsights />
            </body>
        </html>
    );
}

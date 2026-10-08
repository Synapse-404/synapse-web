"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <main id="contenido">{children}</main>;
  }
  return <><Navbar /><main id="contenido">{children}</main><Footer />{!pathname.startsWith("/seguimiento/") && <SpeedInsights />}</>;
}

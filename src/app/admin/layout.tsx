import type { Metadata } from "next";
import "@/styles/admin.css";
import "@/styles/auth-v2.css";

export const metadata: Metadata = { title: "Administración | SYNAPSE", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }

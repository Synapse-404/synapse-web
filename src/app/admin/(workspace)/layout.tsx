import { requireAdmin } from "@/lib/auth/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <div className="adm-app"><AdminSidebar adminName={admin.fullName}/><div className="adm-workspace"><div className="adm-mobile-top"><span>SYNAPSE / ADMIN</span><form action="/api/admin/auth/logout" method="post"><button type="submit">Salir ↗</button></form></div>{children}</div></div>;
}

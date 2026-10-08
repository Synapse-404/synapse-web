"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AdmissionStatus } from "@/generated/prisma/client";
import { selectableStatuses, statusLabels } from "@/lib/admissions/status";

export default function StatusEditor({ id, current }: { id: string; current: AdmissionStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState<AdmissionStatus>(current);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => setStatus(current), [current]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();if (saving || status === current) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/admisiones/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, note }) });
      const result: { message?: string } = await res.json();
      if (!res.ok) { toast.error(result.message ?? "No se pudo actualizar");router.refresh();return; }
      toast.success("Estado actualizado correctamente");setNote("");router.refresh();
    } catch { toast.error("Error de conexión"); }
    finally { setSaving(false); }
  }
  return <form onSubmit={submit} className="adm-status-editor"><label htmlFor="adm-select-status">Nuevo estado</label><select id="adm-select-status" value={status} onChange={e => setStatus(e.target.value as AdmissionStatus)}>{selectableStatuses.map(value => <option key={value} value={value}>{statusLabels[value]}</option>)}</select><label htmlFor="adm-review-note">Nota interna (opcional)</label><textarea id="adm-review-note" value={note} onChange={e => setNote(e.target.value)} maxLength={500} rows={4} placeholder="Observaciones de la revisión…"/><button className="adm-primary" disabled={saving || status===current}>{saving ? "Guardando…" : "Guardar decisión ↗"}</button><p>El nuevo estado aparecerá automáticamente en el enlace privado de seguimiento del aspirante.</p></form>;
}

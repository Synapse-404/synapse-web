"use client";
import Image from "next/image";
import { useState } from "react";
import type { TeamMember } from "@/types";

export default function TeamAvatar({ member, size = "card" }: { member: Pick<TeamMember, "name" | "image">; size?: "card" | "profile" }) {
  const [failed, setFailed] = useState<string | null>(null);
  const src = member.image?.trim();
  const initials = member.name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();
  return (
    <div className={`member-avatar ${size === "profile" ? "member-avatar-profile" : ""}`}>
      {src && src !== failed ? <Image src={src} alt={`Retrato de ${member.name}`} fill sizes={size === "profile" ? "(max-width: 640px) 100vw, (max-width: 1200px) 42vw, 550px" : "(max-width: 640px) 80vw, 360px"} className="object-cover" unoptimized={src.startsWith("https://")} onError={() => setFailed(src)} /> : <span aria-label={`Iniciales de ${member.name}`}>{initials}</span>}
    </div>
  );
}

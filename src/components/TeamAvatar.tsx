"use client";

import Image from "next/image";
import { useState } from "react";
import type { TeamMember } from "@/types";

interface Props {
    member: Pick<TeamMember, "name" | "image">;
    size?: "card" | "profile";
}

export default function TeamAvatar({ member, size = "card" }: Props) {
    const [failedSource, setFailedSource] = useState<string | null>(null);
    const source = member.image?.trim();
    const hasImage = source && source !== failedSource;
    const initials = member.name.split(/\s+/).filter(Boolean).slice(0, 2)
        .map((part) => part[0]).join("").toUpperCase();

    return (
        <div className={`relative mx-auto flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-mono text-gray-600 ${size === "profile" ? "mb-6 h-44 w-44 text-5xl" : "mb-4 h-40 w-40 text-4xl"}`}>
            {hasImage ? (
                <Image
                    src={source}
                    alt={`Retrato de ${member.name}`}
                    fill
                    sizes={size === "profile" ? "400px" : "400px"}
                    className="object-cover"
                    unoptimized={source.startsWith("https://")}
                    onError={() => setFailedSource(source)}
                />
            ) : (
                <span role="img" aria-label={`${member.name}: sin fotografía`}>{initials}</span>
            )}
        </div>
    );
}

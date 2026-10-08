import type { Metadata } from "next";

/**
 * Configura SITE_URL o NEXT_PUBLIC_SITE_URL con el dominio público definitivo.
 * En Vercel se utiliza automáticamente el dominio de producción, si existe.
 */
function getSiteUrl(): string {
  const configured =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";

  try {
    const candidate = /^https?:\/\//i.test(configured)
      ? configured
      : `https://${configured}`;
    return new URL(candidate).origin;
  } catch {
    // Fallback para desarrollo local. Configurar SITE_URL antes de publicar.
    return "http://localhost:3000";
  }
}

export const siteUrl = getSiteUrl();
export const siteName = "SYNAPSE";
export const defaultTitle = "SYNAPSE — Investigación que transforma";
export const defaultDescription =
  "Semillero de investigación de la Fundación Universitaria Claretiana (Uniclaretiana), en Quibdó, Chocó. Desarrollamos conocimiento, software, datos e inteligencia artificial con impacto territorial.";

export interface SeoOptions {
  title?: string;
  description?: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
}

export function createSeoMetadata({
  title,
  description = defaultDescription,
  path,
  type = "website",
  publishedTime,
}: SeoOptions): Metadata {
  const socialTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const images = [
    {
      url: "/opengraph-image.png",
      width: 1200,
      height: 630,
      alt: "Identidad del semillero de investigación SYNAPSE",
    },
  ];

  const openGraphBase = {
    title: socialTitle,
    description,
    url: path,
    siteName,
    locale: "es_CO",
    images,
  };

  const openGraph: Metadata["openGraph"] = type === "article"
    ? { ...openGraphBase, type: "article", ...(publishedTime ? { publishedTime } : {}) }
    : { ...openGraphBase, type: "website" };

  return {
    title: title ?? defaultTitle,
    description,
    alternates: { canonical: path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/twitter-image.png"],
    },
  };
}

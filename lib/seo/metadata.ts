import type { Metadata } from "next"

import { siteConfig } from "@/lib/site"

type CreatePageMetadataOptions = {
  title: string
  description: string
  path: string
  noIndex?: boolean
  absoluteTitle?: boolean
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  absoluteTitle = false,
}: CreatePageMetadataOptions): Metadata {
  const canonicalUrl = new URL(path, siteConfig.url).toString()

  return {
    title: absoluteTitle
      ? {
          absolute: title,
        }
      : title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_DK",
      siteName: siteConfig.name,
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

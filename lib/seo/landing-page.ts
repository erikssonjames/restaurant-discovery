import type { Metadata } from "next"

import { getStrapiMediaUrl } from "@/lib/strapi/media"
import type { LandingPageFields } from "@/lib/strapi/landing-pages"
import type { StrapiDocument } from "@/lib/strapi/types"

type CreateLandingPageMetadataOptions = {
  entry: StrapiDocument<LandingPageFields>
  defaultTitle: string
  defaultDescription: string
  basePath: string
  page: number
  hasFilter: boolean
}

export function createLandingPageMetadata({
  entry,
  defaultTitle,
  defaultDescription,
  basePath,
  page,
  hasFilter,
}: CreateLandingPageMetadataOptions): Metadata {
  const seo = entry.seo

  const baseTitle = seo?.metaTitle || defaultTitle

  const title = page > 1 ? `${baseTitle} – Page ${page}` : baseTitle

  const description = seo?.metaDescription || defaultDescription

  const canonical =
    hasFilter || page === 1 ? basePath : `${basePath}?page=${page}`

  const ogImage = getStrapiMediaUrl(seo?.ogImage?.url)

  const twitterImage = getStrapiMediaUrl(
    seo?.twitterImage?.url || seo?.ogImage?.url
  )

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: !hasFilter && !(seo?.preventIndexing ?? false),
      follow: true,
    },
    openGraph: {
      type: "website",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonical,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: entry.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterImage ? "summary_large_image" : "summary",
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  }
}

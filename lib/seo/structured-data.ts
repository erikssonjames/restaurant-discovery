import { getStrapiMediaUrl } from "@/lib/strapi/media"
import type {
  RestaurantDetailFields,
  RestaurantFields,
} from "@/lib/strapi/restaurants"
import { siteConfig } from "@/lib/site"
import type {
  StrapiCollectionResponse,
  StrapiDocument,
} from "@/lib/strapi/types"

type BreadcrumbEntry = {
  label: string
  href: string
}

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function normalizeWebsite(website: string | null): string | null {
  if (!website) {
    return null
  }

  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website
  }

  return `https://${website}`
}

const priceRanges: Record<RestaurantDetailFields["priceRange"], string> = {
  budget: "$",
  moderate: "$$",
  upscale: "$$$",
  fine_dining: "$$$$",
}

export function createSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}#website`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        publisher: {
          "@id": `${siteConfig.url}#organization`,
        },
      },
    ],
  }
}

export function createBreadcrumbStructuredData(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  }
}

export function createRestaurantStructuredData(
  restaurant: StrapiDocument<RestaurantDetailFields>
) {
  const pageUrl = absoluteUrl(`/restaurants/${restaurant.slug}`)

  const storedData = isRecord(restaurant.seo?.structuredData)
    ? restaurant.seo.structuredData
    : {}

  const images = restaurant.images
    .map((entry) => getStrapiMediaUrl(entry.image?.url))
    .filter((url): url is string => Boolean(url))

  const website = normalizeWebsite(restaurant.website)

  const reviews = restaurant.reviews.filter(
    (review) =>
      Number.isFinite(review.rating) && review.rating >= 1 && review.rating <= 5
  )

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : null

  return {
    ...storedData,
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${pageUrl}#restaurant`,
    name: restaurant.name,
    url: pageUrl,
    ...(images.length > 0 && {
      image: images,
    }),
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address,
      ...(restaurant.city && {
        addressLocality: restaurant.city.name,
      }),
      ...(restaurant.postalCode && {
        postalCode: restaurant.postalCode,
      }),
      addressCountry: "DK",
    },
    servesCuisine: restaurant.cuisines.map((cuisine) => cuisine.name),
    priceRange: priceRanges[restaurant.priceRange],
    ...(restaurant.phoneNumber && {
      telephone: restaurant.phoneNumber,
    }),
    ...(website && {
      sameAs: [website],
    }),
    ...(averageRating !== null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(averageRating.toFixed(1)),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.authorName,
        },
        datePublished: review.date,
        ...(review.comment && {
          reviewBody: review.comment,
        }),
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
      })),
    }),
  }
}

export function createRestaurantListStructuredData({
  title,
  restaurants,
}: {
  title: string
  restaurants: StrapiCollectionResponse<RestaurantFields>
}) {
  const pagination = restaurants.meta.pagination

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: pagination.total,
    itemListElement: restaurants.data.map((restaurant, index) => {
      const url = absoluteUrl(`/restaurants/${restaurant.slug}`)

      return {
        "@type": "ListItem",
        position: (pagination.page - 1) * pagination.pageSize + index + 1,
        item: {
          "@type": "Restaurant",
          "@id": `${url}#restaurant`,
          name: restaurant.name,
          url,
          ...(restaurant.city && {
            address: {
              "@type": "PostalAddress",
              addressLocality: restaurant.city.name,
              addressCountry: "DK",
            },
          }),
          servesCuisine: restaurant.cuisines.map((cuisine) => cuisine.name),
        },
      }
    }),
  }
}

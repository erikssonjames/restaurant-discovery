import type {
  StrapiCollectionResponse,
  StrapiDocument,
} from "@/lib/strapi/types"

import { fetchFromStrapi } from "@/lib/strapi/api"

export type CitySummary = StrapiDocument<{
  name: string
  slug: string
}>

export type CuisineSummary = StrapiDocument<{
  name: string
  slug: string
}>

export type StrapiMedia = {
  id: number
  documentId: string
  url: string
  alternativeText: string | null
  width: number | null
  height: number | null
}

export type RestaurantImageSummary = StrapiDocument<{
  altText: string
  image: StrapiMedia | null
}>

export type RestaurantFields = {
  name: string
  slug: string
  address: string
  postalCode: string | null
  priceRange: "budget" | "moderate" | "upscale" | "fine_dining"
  city: CitySummary | null
  cuisines: CuisineSummary[]
  images: RestaurantImageSummary[]
}

export type GetRestaurantsOptions = {
  page?: number
  pageSize?: number
  citySlug?: string
  cuisineSlug?: string
}

export async function getRestaurants({
  page = 1,
  pageSize = 6,
  citySlug,
  cuisineSlug,
}: GetRestaurantsOptions): Promise<StrapiCollectionResponse<RestaurantFields>> {
  const filters: Record<string, unknown> = {}

  if (citySlug) {
    filters.city = {
      slug: {
        $eq: citySlug,
      },
    }
  }

  if (cuisineSlug) {
    filters.cuisines = {
      slug: {
        $eq: cuisineSlug,
      },
    }
  }

  return fetchFromStrapi<StrapiCollectionResponse<RestaurantFields>>(
    "restaurants",
    {
      query: {
        fields: ["name", "slug", "address", "postalCode", "priceRange"],
        populate: {
          city: {
            fields: ["name", "slug"],
          },
          cuisines: {
            fields: ["name", "slug"],
          },
          images: {
            fields: ["altText"],
            populate: {
              image: {
                fields: ["url", "alternativeText", "width", "height"],
              },
            },
          },
        },
        ...(Object.keys(filters).length > 0 ? { filters } : {}),
        pagination: {
          page,
          pageSize,
        },
        sort: ["name:asc"],
      },
      next: {
        revalidate: 3600,
        tags: ["restaurants"],
      },
    }
  )
}

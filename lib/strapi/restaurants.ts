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

export type RestaurantFields = {
  name: string
  slug: string
  address: string
  postalCode: string | null
  priceRange: "budget" | "moderate" | "upscale" | "fine_dining"
  city: CitySummary | null
  cuisines: CuisineSummary[]
}

export async function getRestaurants(
  page = 1,
  pageSize = 10
): Promise<StrapiCollectionResponse<RestaurantFields>> {
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
        },
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

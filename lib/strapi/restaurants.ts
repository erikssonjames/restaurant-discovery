import type {
  StrapiCollectionResponse,
  StrapiDocument,
} from "@/lib/strapi/types"
import type { BlocksContent } from "@strapi/blocks-react-renderer"
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

export type SeoFields = {
  id: number
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: StrapiMedia | null
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: StrapiMedia | null
  structuredData: unknown
  preventIndexing: boolean
}

export type AggregateRatingFields = {
  id: number
  ratingValue: number
  reviewCount: number
}

export type MenuItemSummary = StrapiDocument<{
  name: string
  description: string | null
  price: number | string
  category: "starter" | "main" | "side" | "dessert" | "drink" | "other"
  availability: boolean
  image: StrapiMedia | null
}>

export type ReviewSummary = StrapiDocument<{
  authorName: string
  rating: number
  comment: string | null
  date: string
}>

export type RestaurantDetailFields = RestaurantFields & {
  description: BlocksContent
  website: string | null
  phoneNumber: string | null
  isOpen: boolean
  menuItems: MenuItemSummary[]
  reviews: ReviewSummary[]
  aggregateRating: AggregateRatingFields | null
  seo: SeoFields | null
}

export type GetRestaurantsOptions = {
  page?: number
  pageSize?: number
  citySlug?: string
  cuisineSlug?: string
  search?: string
  priceRange?: RestaurantFields["priceRange"]
  openOnly?: boolean
  fresh?: boolean
}

export async function getRestaurants({
  page = 1,
  pageSize = 6,
  citySlug,
  cuisineSlug,
  search,
  priceRange,
  openOnly = false,
  fresh = false,
}: GetRestaurantsOptions = {}): Promise<
  StrapiCollectionResponse<RestaurantFields>
> {
  const conditions: Array<Record<string, unknown>> = []

  if (citySlug) {
    conditions.push({
      city: {
        slug: {
          $eq: citySlug,
        },
      },
    })
  }

  if (cuisineSlug) {
    conditions.push({
      cuisines: {
        slug: {
          $eq: cuisineSlug,
        },
      },
    })
  }

  if (priceRange) {
    conditions.push({
      priceRange: {
        $eq: priceRange,
      },
    })
  }

  if (openOnly) {
    conditions.push({
      isOpen: {
        $eq: true,
      },
    })
  }

  const searchTerm = search?.trim()

  if (searchTerm) {
    conditions.push({
      $or: [
        {
          name: {
            $containsi: searchTerm,
          },
        },
        {
          address: {
            $containsi: searchTerm,
          },
        },
        {
          city: {
            name: {
              $containsi: searchTerm,
            },
          },
        },
        {
          cuisines: {
            name: {
              $containsi: searchTerm,
            },
          },
        },
        {
          menuItems: {
            name: {
              $containsi: searchTerm,
            },
          },
        },
        {
          menuItems: {
            description: {
              $containsi: searchTerm,
            },
          },
        },
      ],
    })
  }

  const caching = fresh
    ? {
        cache: "no-store" as const,
      }
    : {
        next: {
          revalidate: 3600,
          tags: ["restaurants"],
        },
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
        ...(conditions.length > 0
          ? {
              filters: {
                $and: conditions,
              },
            }
          : {}),
        pagination: {
          page,
          pageSize,
          withCount: true,
        },
        sort: ["name:asc"],
      },
      ...caching,
    }
  )
}

export async function getRestaurantSlugs(): Promise<string[]> {
  const response = await fetchFromStrapi<
    StrapiCollectionResponse<{ slug: string }>
  >("restaurants", {
    query: {
      fields: ["slug"],
      pagination: {
        page: 1,
        pageSize: 100,
      },
      sort: ["slug:asc"],
    },
    next: {
      revalidate: 3600,
      tags: ["restaurant-slugs"],
    },
  })

  return response.data.map((restaurant) => restaurant.slug)
}

export async function getRestaurantBySlug(
  slug: string
): Promise<StrapiDocument<RestaurantDetailFields> | null> {
  const response = await fetchFromStrapi<
    StrapiCollectionResponse<RestaurantDetailFields>
  >("restaurants", {
    query: {
      fields: [
        "name",
        "slug",
        "address",
        "postalCode",
        "description",
        "priceRange",
        "website",
        "phoneNumber",
        "isOpen",
      ],
      filters: {
        slug: {
          $eq: slug,
        },
      },
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
        menuItems: {
          fields: ["name", "description", "price", "category", "availability"],
          populate: {
            image: {
              fields: ["url", "alternativeText", "width", "height"],
            },
          },
        },
        reviews: {
          fields: ["authorName", "rating", "comment", "date"],
        },
        aggregateRating: true,
        seo: {
          populate: {
            ogImage: {
              fields: ["url", "alternativeText", "width", "height"],
            },
            twitterImage: {
              fields: ["url", "alternativeText", "width", "height"],
            },
          },
        },
      },
      pagination: {
        page: 1,
        pageSize: 1,
      },
    },
    next: {
      revalidate: 3600,
      tags: ["restaurants", `restaurant:${slug}`],
    },
  })

  return response.data[0] ?? null
}

import type { BlocksContent } from "@strapi/blocks-react-renderer"

import { fetchFromStrapi } from "@/lib/strapi/api"
import type { SeoFields } from "@/lib/strapi/restaurants"
import type {
  StrapiCollectionResponse,
  StrapiDocument,
} from "@/lib/strapi/types"

export type LandingPageFields = {
  name: string
  slug: string
  description: BlocksContent
  seo: SeoFields | null
}

type LandingPageEndpoint = "cities" | "cuisines"

async function getLandingPageSlugs(
  endpoint: LandingPageEndpoint
): Promise<string[]> {
  const response = await fetchFromStrapi<
    StrapiCollectionResponse<{ slug: string }>
  >(endpoint, {
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
      tags: [`${endpoint}-slugs`],
    },
  })

  return response.data.map((entry) => entry.slug)
}

async function getLandingPageBySlug(
  endpoint: LandingPageEndpoint,
  slug: string
): Promise<StrapiDocument<LandingPageFields> | null> {
  const response = await fetchFromStrapi<
    StrapiCollectionResponse<LandingPageFields>
  >(endpoint, {
    query: {
      fields: ["name", "slug", "description"],
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
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
      tags: [endpoint, `${endpoint}:${slug}`],
    },
  })

  return response.data[0] ?? null
}

export function getCitySlugs() {
  return getLandingPageSlugs("cities")
}

export function getCuisineSlugs() {
  return getLandingPageSlugs("cuisines")
}

export function getCityBySlug(slug: string) {
  return getLandingPageBySlug("cities", slug)
}

export function getCuisineBySlug(slug: string) {
  return getLandingPageBySlug("cuisines", slug)
}

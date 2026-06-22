import "server-only"

import { fetchFromStrapi } from "@/lib/strapi/api"
import type {
  StrapiCollectionResponse,
  StrapiDocument,
} from "@/lib/strapi/types"

export type SitemapEntryFields = {
  slug: string
}

type SitemapEndpoint = "restaurants" | "cities" | "cuisines"

const PAGE_SIZE = 100

async function getSitemapPage(
  endpoint: SitemapEndpoint,
  page: number
): Promise<StrapiCollectionResponse<SitemapEntryFields>> {
  return fetchFromStrapi<StrapiCollectionResponse<SitemapEntryFields>>(
    endpoint,
    {
      query: {
        fields: ["slug", "updatedAt"],
        pagination: {
          page,
          pageSize: PAGE_SIZE,
          withCount: true,
        },
        sort: ["updatedAt:desc"],
      },
      next: {
        revalidate: 3600,
        tags: [`sitemap:${endpoint}`],
      },
    }
  )
}

async function getAllSitemapEntries(
  endpoint: SitemapEndpoint
): Promise<Array<StrapiDocument<SitemapEntryFields>>> {
  const firstPage = await getSitemapPage(endpoint, 1)
  const pageCount = firstPage.meta.pagination.pageCount

  if (pageCount <= 1) {
    return firstPage.data
  }

  const remainingPages = await Promise.all(
    Array.from(
      {
        length: pageCount - 1,
      },
      (_, index) => getSitemapPage(endpoint, index + 2)
    )
  )

  return [...firstPage.data, ...remainingPages.flatMap((page) => page.data)]
}

export async function getSitemapContent() {
  const [restaurants, cities, cuisines] = await Promise.all([
    getAllSitemapEntries("restaurants"),
    getAllSitemapEntries("cities"),
    getAllSitemapEntries("cuisines"),
  ])

  return {
    restaurants,
    cities,
    cuisines,
  }
}

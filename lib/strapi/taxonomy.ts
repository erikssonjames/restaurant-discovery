import type { StrapiCollectionResponse } from "@/lib/strapi/types"

import { fetchFromStrapi } from "@/lib/strapi/api"

export type TaxonomyFields = {
  name: string
  slug: string
}

export async function getCities(): Promise<
  StrapiCollectionResponse<TaxonomyFields>
> {
  return fetchFromStrapi<StrapiCollectionResponse<TaxonomyFields>>("cities", {
    query: {
      fields: ["name", "slug"],
      pagination: {
        page: 1,
        pageSize: 100,
      },
      sort: ["name:asc"],
    },
    next: {
      revalidate: 3600,
      tags: ["cities"],
    },
  })
}

export async function getCuisines(): Promise<
  StrapiCollectionResponse<TaxonomyFields>
> {
  return fetchFromStrapi<StrapiCollectionResponse<TaxonomyFields>>("cuisines", {
    query: {
      fields: ["name", "slug"],
      pagination: {
        page: 1,
        pageSize: 100,
      },
      sort: ["name:asc"],
    },
    next: {
      revalidate: 3600,
      tags: ["cuisines"],
    },
  })
}

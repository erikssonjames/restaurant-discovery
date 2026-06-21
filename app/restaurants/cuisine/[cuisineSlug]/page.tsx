import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { TaxonomyLandingPage } from "@/components/restaurants/taxonomy-landing-page"
import { getCuisineBySlug, getCuisineSlugs } from "@/lib/strapi/landing-pages"
import { getRestaurants } from "@/lib/strapi/restaurants"
import { createLandingPageMetadata } from "@/lib/seo/landing-page"
import { siteConfig } from "@/lib/site"
import { getCities } from "@/lib/strapi/taxonomy"

export const revalidate = 3600
export const dynamicParams = true

const PAGE_SIZE = 6

type CuisinePageProps = {
  params: Promise<{
    cuisineSlug: string
  }>
  searchParams: Promise<{
    page?: string | string[]
    city?: string | string[]
  }>
}

function readParameter(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function readPage(value: string | string[] | undefined): number {
  const parsed = Number.parseInt(readParameter(value), 10)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export async function generateStaticParams() {
  const slugs = await getCuisineSlugs()

  return slugs.map((cuisineSlug) => ({
    cuisineSlug,
  }))
}

export async function generateMetadata({
  params,
  searchParams,
}: CuisinePageProps): Promise<Metadata> {
  const [{ cuisineSlug }, parameters] = await Promise.all([
    params,
    searchParams,
  ])

  const cuisine = await getCuisineBySlug(cuisineSlug)

  if (!cuisine) {
    return {
      title: {
        absolute: `Cuisine not found | ${siteConfig.name}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const page = readPage(parameters.page)
  const city = readParameter(parameters.city)

  return createLandingPageMetadata({
    entry: cuisine,
    defaultTitle: `${cuisine.name} restaurants | ${siteConfig.name}`,
    defaultDescription: `Browse ${cuisine.name.toLowerCase()} restaurants by city and price range.`,
    basePath: `/restaurants/cuisine/${cuisine.slug}`,
    page,
    hasFilter: Boolean(city),
  })
}

export default async function CuisinePage({
  params,
  searchParams,
}: CuisinePageProps) {
  const [{ cuisineSlug }, parameters] = await Promise.all([
    params,
    searchParams,
  ])

  const page = readPage(parameters.page)
  const citySlug = readParameter(parameters.city)

  const [cuisine, cities, restaurants] = await Promise.all([
    getCuisineBySlug(cuisineSlug),
    getCities(),
    getRestaurants({
      page,
      pageSize: PAGE_SIZE,
      cuisineSlug,
      citySlug,
    }),
  ])

  if (!cuisine) {
    notFound()
  }

  const pagination = restaurants.meta.pagination

  if (
    (!citySlug && page === 1 && pagination.total === 0) ||
    (page > 1 && (pagination.pageCount === 0 || page > pagination.pageCount))
  ) {
    notFound()
  }

  return (
    <TaxonomyLandingPage
      title={`${cuisine.name} restaurants`}
      description={cuisine.description}
      breadcrumbs={[
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Restaurants",
          href: "/restaurants",
        },
        {
          label: cuisine.name,
          href: `/restaurants/cuisine/${cuisine.slug}`,
        },
      ]}
      restaurants={restaurants}
      basePath={`/restaurants/cuisine/${cuisine.slug}`}
      filterLabel="City"
      filterParameter="city"
      filterOptions={cities.data.map((city) => ({
        label: city.name,
        value: city.slug,
      }))}
      selectedFilter={citySlug}
    />
  )
}

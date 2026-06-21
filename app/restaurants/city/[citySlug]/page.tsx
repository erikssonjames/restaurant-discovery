import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { TaxonomyLandingPage } from "@/components/restaurants/taxonomy-landing-page"
import { getCityBySlug, getCitySlugs } from "@/lib/strapi/landing-pages"
import { getRestaurants } from "@/lib/strapi/restaurants"
import { getCuisines } from "@/lib/strapi/taxonomy"
import { createLandingPageMetadata } from "@/lib/seo/landing-page"
import { siteConfig } from "@/lib/site"

export const revalidate = 3600
export const dynamicParams = true

const PAGE_SIZE = 6

type CityPageProps = {
  params: Promise<{
    citySlug: string
  }>
  searchParams: Promise<{
    page?: string | string[]
    cuisine?: string | string[]
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
  const slugs = await getCitySlugs()

  return slugs.map((citySlug) => ({
    citySlug,
  }))
}

export async function generateMetadata({
  params,
  searchParams,
}: CityPageProps): Promise<Metadata> {
  const [{ citySlug }, parameters] = await Promise.all([params, searchParams])

  const city = await getCityBySlug(citySlug)

  if (!city) {
    return {
      title: {
        absolute: `City not found | ${siteConfig.name}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const page = readPage(parameters.page)
  const cuisine = readParameter(parameters.cuisine)

  return createLandingPageMetadata({
    entry: city,
    defaultTitle: `Restaurants in ${city.name} | ${siteConfig.name}`,
    defaultDescription: `Browse restaurants in ${city.name} by cuisine and price range.`,
    basePath: `/restaurants/city/${city.slug}`,
    page,
    hasFilter: Boolean(cuisine),
  })
}

export default async function CityPage({
  params,
  searchParams,
}: CityPageProps) {
  const [{ citySlug }, parameters] = await Promise.all([params, searchParams])

  const page = readPage(parameters.page)
  const cuisineSlug = readParameter(parameters.cuisine)

  const [city, cuisines, restaurants] = await Promise.all([
    getCityBySlug(citySlug),
    getCuisines(),
    getRestaurants({
      page,
      pageSize: PAGE_SIZE,
      citySlug,
      cuisineSlug,
    }),
  ])

  if (!city) {
    notFound()
  }

  const pagination = restaurants.meta.pagination

  if (
    (!cuisineSlug && page === 1 && pagination.total === 0) ||
    (page > 1 && (pagination.pageCount === 0 || page > pagination.pageCount))
  ) {
    notFound()
  }

  return (
    <TaxonomyLandingPage
      title={`Restaurants in ${city.name}`}
      description={city.description}
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
          label: city.name,
          href: `/restaurants/city/${city.slug}`,
        },
      ]}
      restaurants={restaurants}
      basePath={`/restaurants/city/${city.slug}`}
      filterLabel="Cuisine"
      filterParameter="cuisine"
      filterOptions={cuisines.data.map((cuisine) => ({
        label: cuisine.name,
        value: cuisine.slug,
      }))}
      selectedFilter={cuisineSlug}
    />
  )
}

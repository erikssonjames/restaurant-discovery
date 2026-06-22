import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { PaginationControls } from "@/components/restaurants/pagination-controls"
import { RestaurantFilters } from "@/components/restaurants/restaurant-filters"
import { RestaurantList } from "@/components/restaurants/restaurant-list"
import { getRestaurants } from "@/lib/strapi/restaurants"
import { getCities, getCuisines } from "@/lib/strapi/taxonomy"
import { createPageMetadata } from "@/lib/seo/metadata"

const PAGE_SIZE = 2

type RestaurantSearchParams = {
  page?: string | string[]
  city?: string | string[]
  cuisine?: string | string[]
}

type RestaurantsPageProps = {
  searchParams: Promise<RestaurantSearchParams>
}

function readParameter(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

function readPage(value: string | string[] | undefined): number {
  const parsed = Number.parseInt(readParameter(value), 10)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export async function generateMetadata({
  searchParams,
}: RestaurantsPageProps): Promise<Metadata> {
  const parameters = await searchParams

  const page = readPage(parameters.page)
  const city = readParameter(parameters.city)
  const cuisine = readParameter(parameters.cuisine)
  const hasFilters = Boolean(city || cuisine)

  const title = page > 1 ? `Restaurants – Page ${page}` : "Restaurants"

  const canonicalPath =
    hasFilters || page === 1 ? "/restaurants" : `/restaurants?page=${page}`

  return createPageMetadata({
    title,
    description:
      "Browse restaurants by city and cuisine and find somewhere new to eat.",
    path: canonicalPath,
    noIndex: hasFilters,
  })
}

export default async function RestaurantsPage({
  searchParams,
}: RestaurantsPageProps) {
  const parameters = await searchParams

  const page = readPage(parameters.page)
  const citySlug = readParameter(parameters.city)
  const cuisineSlug = readParameter(parameters.cuisine)

  const [restaurants, cities, cuisines] = await Promise.all([
    getRestaurants({
      page,
      pageSize: PAGE_SIZE,
      citySlug,
      cuisineSlug,
    }),
    getCities(),
    getCuisines(),
  ])

  const pagination = restaurants.meta.pagination

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Breadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Restaurants",
            href: "/restaurants",
          },
        ]}
      />

      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight">Restaurants</h1>

        <p className="mt-4 text-muted-foreground">
          Browse restaurants by city and cuisine.
        </p>
      </div>

      <div className="mt-8">
        <RestaurantFilters
          cities={cities.data.map((city) => ({
            label: city.name,
            value: city.slug,
          }))}
          cuisines={cuisines.data.map((cuisine) => ({
            label: cuisine.name,
            value: cuisine.slug,
          }))}
          selectedCity={citySlug}
          selectedCuisine={cuisineSlug}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {pagination.total}{" "}
          {pagination.total === 1 ? "restaurant" : "restaurants"}
        </p>
      </div>

      <div className="mt-6">
        <RestaurantList restaurants={restaurants.data} />
      </div>

      <div className="mt-10">
        <PaginationControls
          page={pagination.page}
          pageCount={pagination.pageCount}
          city={citySlug}
          cuisine={cuisineSlug}
        />
      </div>
    </section>
  )
}

import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { PaginationControls } from "@/components/restaurants/pagination-controls"
import { RestaurantList } from "@/components/restaurants/restaurant-list"
import { SearchFilters } from "@/components/search/search-filters"
import { getRestaurants, type RestaurantFields } from "@/lib/strapi/restaurants"
import { getCities, getCuisines } from "@/lib/strapi/taxonomy"
import { createPageMetadata } from "@/lib/seo/metadata"

export const dynamic = "force-dynamic"

export const metadata = createPageMetadata({
  title: "Search restaurants",
  description:
    "Search and filter restaurants by city, cuisine, price, menu item, and availability.",
  path: "/search",
  noIndex: true,
})

const PAGE_SIZE = 6

type SearchPageParameters = {
  q?: string | string[]
  city?: string | string[]
  cuisine?: string | string[]
  price?: string | string[]
  open?: string | string[]
  page?: string | string[]
}

type SearchPageProps = {
  searchParams: Promise<SearchPageParameters>
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

function readPriceRange(
  value: string | string[] | undefined
): RestaurantFields["priceRange"] | undefined {
  const priceRange = readParameter(value)

  const validValues: RestaurantFields["priceRange"][] = [
    "budget",
    "moderate",
    "upscale",
    "fine_dining",
  ]

  return validValues.includes(priceRange as RestaurantFields["priceRange"])
    ? (priceRange as RestaurantFields["priceRange"])
    : undefined
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const parameters = await searchParams

  const query = readParameter(parameters.q).trim()
  const citySlug = readParameter(parameters.city)
  const cuisineSlug = readParameter(parameters.cuisine)
  const priceRange = readPriceRange(parameters.price)
  const openOnly = readParameter(parameters.open) === "true"
  const page = readPage(parameters.page)

  const [restaurants, cities, cuisines] = await Promise.all([
    getRestaurants({
      page,
      pageSize: PAGE_SIZE,
      search: query,
      citySlug,
      cuisineSlug,
      priceRange,
      openOnly,
      fresh: true,
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
            label: "Search",
            href: "/search",
          },
        ]}
      />

      <header className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Search restaurants
        </h1>

        <p className="mt-4 text-muted-foreground">
          Search by name, location, cuisine, or menu item.
        </p>
      </header>

      <div className="mt-8">
        <SearchFilters
          key={[
            query,
            citySlug,
            cuisineSlug,
            priceRange ?? "",
            String(openOnly),
          ].join(":")}
          cities={cities.data.map((city) => ({
            label: city.name,
            value: city.slug,
          }))}
          cuisines={cuisines.data.map((cuisine) => ({
            label: cuisine.name,
            value: cuisine.slug,
          }))}
          selectedQuery={query}
          selectedCity={citySlug}
          selectedCuisine={cuisineSlug}
          selectedPriceRange={priceRange ?? ""}
          selectedOpenOnly={openOnly}
        />
      </div>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {pagination.total}{" "}
          {pagination.total === 1 ? "restaurant" : "restaurants"} found
        </p>
      </div>

      <div className="mt-6">
        <RestaurantList restaurants={restaurants.data} />
      </div>

      <div className="mt-10">
        <PaginationControls
          basePath="/search"
          page={pagination.page}
          pageCount={pagination.pageCount}
          query={query}
          city={citySlug}
          cuisine={cuisineSlug}
          priceRange={priceRange ?? ""}
          openOnly={openOnly}
        />
      </div>
    </section>
  )
}

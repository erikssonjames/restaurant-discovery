import type { BlocksContent } from "@strapi/blocks-react-renderer"

import {
  Breadcrumbs,
  type BreadcrumbEntry,
} from "@/components/navigation/breadcrumbs"
import { RestaurantDescription } from "@/components/restaurants/restaurant-description"
import { LandingPageFilter } from "@/components/restaurants/landing-page-filter"
import { PaginationControls } from "@/components/restaurants/pagination-controls"
import { RestaurantList } from "@/components/restaurants/restaurant-list"
import type { RestaurantFields } from "@/lib/strapi/restaurants"
import type { StrapiCollectionResponse } from "@/lib/strapi/types"
import { createRestaurantListStructuredData } from "@/lib/seo/structured-data"
import { JsonLd } from "../seo/json-ld"

type FilterOption = {
  label: string
  value: string
}

type TaxonomyLandingPageProps = {
  title: string
  description: BlocksContent
  breadcrumbs: BreadcrumbEntry[]
  restaurants: StrapiCollectionResponse<RestaurantFields>
  basePath: string
  filterLabel: string
  filterParameter: "city" | "cuisine"
  filterOptions: FilterOption[]
  selectedFilter: string
}

export function TaxonomyLandingPage({
  title,
  description,
  breadcrumbs,
  restaurants,
  basePath,
  filterLabel,
  filterParameter,
  filterOptions,
  selectedFilter,
}: TaxonomyLandingPageProps) {
  const pagination = restaurants.meta.pagination

  const itemList = createRestaurantListStructuredData({
    title,
    restaurants,
  })

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Breadcrumbs items={breadcrumbs} />

      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>

        <div className="mt-5">
          <RestaurantDescription content={description} />
        </div>
      </header>

      <div className="mt-8">
        <LandingPageFilter
          label={filterLabel}
          parameter={filterParameter}
          options={filterOptions}
          selectedValue={selectedFilter}
        />
      </div>

      <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
        {pagination.total}{" "}
        {pagination.total === 1 ? "restaurant" : "restaurants"}
      </p>

      <div className="mt-6">
        <RestaurantList restaurants={restaurants.data} />
      </div>

      <div className="mt-10">
        <PaginationControls
          basePath={basePath}
          page={pagination.page}
          pageCount={pagination.pageCount}
          city={filterParameter === "city" ? selectedFilter : ""}
          cuisine={filterParameter === "cuisine" ? selectedFilter : ""}
        />
      </div>

      <JsonLd data={itemList} />
    </section>
  )
}

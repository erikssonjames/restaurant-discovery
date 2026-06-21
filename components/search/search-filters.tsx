"use client"

import { FormEvent, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { RestaurantFields } from "@/lib/strapi/restaurants"

type FilterOption = {
  label: string
  value: string
}

type SearchFiltersProps = {
  cities: FilterOption[]
  cuisines: FilterOption[]
  selectedQuery: string
  selectedCity: string
  selectedCuisine: string
  selectedPriceRange: RestaurantFields["priceRange"] | ""
  selectedOpenOnly: boolean
}

type FilterState = {
  query: string
  city: string
  cuisine: string
  priceRange: RestaurantFields["priceRange"] | ""
  openOnly: boolean
}

export function SearchFilters({
  cities,
  cuisines,
  selectedQuery,
  selectedCity,
  selectedCuisine,
  selectedPriceRange,
  selectedOpenOnly,
}: SearchFiltersProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [filters, setFilters] = useState<FilterState>({
    query: selectedQuery,
    city: selectedCity,
    cuisine: selectedCuisine,
    priceRange: selectedPriceRange,
    openOnly: selectedOpenOnly,
  })

  function createDestination(values: FilterState) {
    const params = new URLSearchParams()
    const query = values.query.trim()

    if (query) {
      params.set("q", query)
    }

    if (values.city) {
      params.set("city", values.city)
    }

    if (values.cuisine) {
      params.set("cuisine", values.cuisine)
    }

    if (values.priceRange) {
      params.set("price", values.priceRange)
    }

    if (values.openOnly) {
      params.set("open", "true")
    }

    const queryString = params.toString()

    return queryString ? `${pathname}?${queryString}` : pathname
  }

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(() => {
      router.replace(createDestination(filters), {
        scroll: false,
      })
    })
  }

  function clearFilters() {
    const emptyFilters: FilterState = {
      query: "",
      city: "",
      cuisine: "",
      priceRange: "",
      openOnly: false,
    }

    setFilters(emptyFilters)

    startTransition(() => {
      router.replace(pathname, {
        scroll: false,
      })
    })
  }

  const hasFilters = Boolean(
    filters.query ||
    filters.city ||
    filters.cuisine ||
    filters.priceRange ||
    filters.openOnly
  )

  return (
    <form
      onSubmit={submitFilters}
      className="grid gap-5 rounded-xl border bg-muted/30 p-5"
      aria-busy={isPending}
    >
      <div className="space-y-2">
        <label htmlFor="restaurant-search" className="text-sm font-medium">
          Search
        </label>

        <Input
          id="restaurant-search"
          type="search"
          value={filters.query}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              query: event.target.value,
            }))
          }
          placeholder="Restaurant, cuisine, city, or menu item"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="search-city" className="text-sm font-medium">
            City
          </label>

          <Select
            value={filters.city || "all"}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                city: value === "all" ? "" : value,
              }))
            }
            disabled={isPending}
          >
            <SelectTrigger id="search-city" className="w-full">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>

              {cities.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="search-cuisine" className="text-sm font-medium">
            Cuisine
          </label>

          <Select
            value={filters.cuisine || "all"}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                cuisine: value === "all" ? "" : value,
              }))
            }
            disabled={isPending}
          >
            <SelectTrigger id="search-cuisine" className="w-full">
              <SelectValue placeholder="All cuisines" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All cuisines</SelectItem>

              {cuisines.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="search-price" className="text-sm font-medium">
            Price range
          </label>

          <Select
            value={filters.priceRange || "all"}
            onValueChange={(value) =>
              setFilters((current) => ({
                ...current,
                priceRange:
                  value === "all"
                    ? ""
                    : (value as RestaurantFields["priceRange"]),
              }))
            }
            disabled={isPending}
          >
            <SelectTrigger id="search-price" className="w-full">
              <SelectValue placeholder="All prices" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All prices</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="upscale">Upscale</SelectItem>
              <SelectItem value="fine_dining">Fine dining</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="search-open"
          checked={filters.openOnly}
          disabled={isPending}
          onCheckedChange={(checked) =>
            setFilters((current) => ({
              ...current,
              openOnly: checked === true,
            }))
          }
        />

        <label htmlFor="search-open" className="text-sm font-medium">
          Open now
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          disabled={!hasFilters || isPending}
        >
          Clear filters
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  )
}

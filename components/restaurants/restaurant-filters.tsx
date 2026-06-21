"use client"

import { useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FilterOption = {
  label: string
  value: string
}

type RestaurantFiltersProps = {
  cities: FilterOption[]
  cuisines: FilterOption[]
  selectedCity: string
  selectedCuisine: string
}

export function RestaurantFilters({
  cities,
  cuisines,
  selectedCity,
  selectedCuisine,
}: RestaurantFiltersProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function navigate(city: string, cuisine: string) {
    const params = new URLSearchParams()

    if (city) {
      params.set("city", city)
    }

    if (cuisine) {
      params.set("cuisine", cuisine)
    }

    const query = params.toString()
    const destination = query ? `${pathname}?${query}` : pathname

    startTransition(() => {
      router.push(destination, {
        scroll: false,
      })
    })
  }

  function updateCity(value: string) {
    navigate(value === "all" ? "" : value, selectedCuisine)
  }

  function updateCuisine(value: string) {
    navigate(selectedCity, value === "all" ? "" : value)
  }

  function resetFilters() {
    navigate("", "")
  }

  const hasFilters = Boolean(selectedCity || selectedCuisine)

  return (
    <div
      className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"
      aria-busy={isPending}
    >
      <div className="space-y-2">
        <label htmlFor="city-filter" className="text-sm font-medium">
          City
        </label>

        <Select
          value={selectedCity || "all"}
          onValueChange={updateCity}
          disabled={isPending}
        >
          <SelectTrigger id="city-filter" className="w-full">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>

            {cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="cuisine-filter" className="text-sm font-medium">
          Cuisine
        </label>

        <Select
          value={selectedCuisine || "all"}
          onValueChange={updateCuisine}
          disabled={isPending}
        >
          <SelectTrigger id="cuisine-filter" className="w-full">
            <SelectValue placeholder="All cuisines" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All cuisines</SelectItem>

            {cuisines.map((cuisine) => (
              <SelectItem key={cuisine.value} value={cuisine.value}>
                {cuisine.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button
          type="button"
          variant="outline"
          onClick={resetFilters}
          disabled={!hasFilters || isPending}
          className="w-full lg:w-auto"
        >
          Clear filters
        </Button>
      </div>
    </div>
  )
}

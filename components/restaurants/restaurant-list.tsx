import { RestaurantCard } from "@/components/restaurants/restaurant-card"
import type { RestaurantFields } from "@/lib/strapi/restaurants"
import type { StrapiDocument } from "@/lib/strapi/types"

type RestaurantListProps = {
  restaurants: Array<StrapiDocument<RestaurantFields>>
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  if (restaurants.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-6 py-16 text-center">
        <h2 className="text-lg font-semibold">No restaurants found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Try changing or clearing the filters.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <li key={restaurant.documentId}>
          <RestaurantCard restaurant={restaurant} />
        </li>
      ))}
    </ul>
  )
}

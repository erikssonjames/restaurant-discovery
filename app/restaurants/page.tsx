import type { Metadata } from "next"

import { getRestaurants } from "@/lib/strapi/restaurants"

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Browse restaurants by city and cuisine.",
}

export default async function RestaurantsPage() {
  const response = await getRestaurants()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Restaurants</h1>

        <p className="mt-4 text-muted-foreground">
          Browse restaurants from the Strapi CMS.
        </p>
      </div>

      {response.data.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          No restaurants have been published.
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {response.data.map((restaurant) => (
            <li key={restaurant.documentId} className="rounded-lg border p-5">
              <h2 className="text-xl font-semibold">{restaurant.name}</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {restaurant.city?.name ?? "City not assigned"}
              </p>

              <p className="mt-3">
                {restaurant.cuisines.length > 0
                  ? restaurant.cuisines
                      .map((cuisine) => cuisine.name)
                      .join(", ")
                  : "Cuisine not assigned"}
              </p>

              <p className="mt-2 text-sm text-muted-foreground capitalize">
                {restaurant.priceRange.replace("_", " ")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <details className="mt-12">
        <summary className="cursor-pointer font-medium">
          View API response
        </summary>

        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-xs">
          {JSON.stringify(response, null, 2)}
        </pre>
      </details>
    </section>
  )
}

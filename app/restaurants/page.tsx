import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Browse all restaurants.",
}

export default function RestaurantsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Restaurants</h1>
      <p className="mt-4 text-muted-foreground">
        Restaurant listings will be added in a later phase.
      </p>
    </section>
  )
}

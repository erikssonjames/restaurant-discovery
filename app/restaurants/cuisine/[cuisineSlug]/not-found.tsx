import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function CuisineNotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Cuisine not found</h1>

      <p className="mt-4 text-muted-foreground">
        This cuisine does not exist or has no published restaurants.
      </p>

      <Button asChild className="mt-8">
        <Link href="/restaurants">Browse restaurants</Link>
      </Button>
    </section>
  )
}

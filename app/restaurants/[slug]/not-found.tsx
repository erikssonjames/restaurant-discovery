import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function RestaurantNotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Restaurant not found
      </h1>

      <p className="mt-4 text-muted-foreground">
        This restaurant does not exist or is no longer published.
      </p>

      <Button asChild className="mt-8">
        <Link href="/restaurants">Browse restaurants</Link>
      </Button>
    </section>
  )
}

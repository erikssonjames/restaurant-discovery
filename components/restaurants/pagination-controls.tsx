import Link from "next/link"

import { Button } from "@/components/ui/button"

type PaginationControlsProps = {
  basePath?: string
  page: number
  pageCount: number
  city?: string
  cuisine?: string
  query?: string
  priceRange?: string
  openOnly?: boolean
}

function createPageHref({
  basePath,
  page,
  city,
  cuisine,
  query,
  priceRange,
  openOnly,
}: {
  basePath: string
  page: number
  city: string
  cuisine: string
  query: string
  priceRange: string
  openOnly: boolean
}) {
  const params = new URLSearchParams()

  if (page > 1) {
    params.set("page", String(page))
  }

  if (query) {
    params.set("q", query)
  }

  if (city) {
    params.set("city", city)
  }

  if (cuisine) {
    params.set("cuisine", cuisine)
  }

  if (priceRange) {
    params.set("price", priceRange)
  }

  if (openOnly) {
    params.set("open", "true")
  }

  const queryString = params.toString()

  return queryString ? `${basePath}?${queryString}` : basePath
}

export function PaginationControls({
  basePath = "/restaurants",
  page,
  pageCount,
  city = "",
  cuisine = "",
  query = "",
  priceRange = "",
  openOnly = false,
}: PaginationControlsProps) {
  if (pageCount <= 1) {
    return null
  }

  const sharedParameters = {
    basePath,
    city,
    cuisine,
    query,
    priceRange,
    openOnly,
  }

  return (
    <nav
      aria-label="Restaurant pages"
      className="flex items-center justify-between gap-4"
    >
      {page > 1 ? (
        <Button variant="outline" asChild>
          <Link
            href={createPageHref({
              ...sharedParameters,
              page: page - 1,
            })}
          >
            Previous
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          Previous
        </Button>
      )}

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Page {page} of {pageCount}
      </p>

      {page < pageCount ? (
        <Button variant="outline" asChild>
          <Link
            href={createPageHref({
              ...sharedParameters,
              page: page + 1,
            })}
          >
            Next
          </Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          Next
        </Button>
      )}
    </nav>
  )
}

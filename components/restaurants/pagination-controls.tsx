import Link from "next/link"

import { Button } from "@/components/ui/button"

type PaginationControlsProps = {
  basePath?: string
  page: number
  pageCount: number
  city?: string
  cuisine?: string
}

function createPageHref({
  basePath,
  page,
  city,
  cuisine,
}: {
  basePath: string
  page: number
  city: string
  cuisine: string
}) {
  const params = new URLSearchParams()

  if (page > 1) {
    params.set("page", String(page))
  }

  if (city) {
    params.set("city", city)
  }

  if (cuisine) {
    params.set("cuisine", cuisine)
  }

  const query = params.toString()

  return query ? `${basePath}?${query}` : basePath
}

export function PaginationControls({
  basePath = "/restaurants",
  page,
  pageCount,
  city = "",
  cuisine = "",
}: PaginationControlsProps) {
  if (pageCount <= 1) {
    return null
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
              basePath,
              page: page - 1,
              city,
              cuisine,
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
              basePath,
              page: page + 1,
              city,
              cuisine,
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

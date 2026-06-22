"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function ApplicationError({
  error,
  unstable_retry,
}: {
  error: Error & {
    digest?: string
  }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Something went wrong
      </h1>

      <p className="mt-4 text-muted-foreground">
        The page could not be loaded.
      </p>

      <Button type="button" className="mt-8" onClick={unstable_retry}>
        Try again
      </Button>
    </section>
  )
}

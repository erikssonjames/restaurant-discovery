"use client"

export default function RestaurantsError({
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold">Restaurants unavailable</h1>

      <p className="mt-4 text-muted-foreground">
        The restaurant data could not be loaded.
      </p>

      <button
        type="button"
        onClick={unstable_retry}
        className="mt-6 rounded-md border px-4 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </section>
  )
}

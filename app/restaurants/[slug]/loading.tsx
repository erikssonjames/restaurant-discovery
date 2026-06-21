import { Skeleton } from "@/components/ui/skeleton"

export default function RestaurantLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Skeleton className="h-5 w-64" />

      <div className="mt-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-4 h-12 w-96 max-w-full" />
        <Skeleton className="mt-4 h-5 w-40" />
      </div>

      <Skeleton className="mt-8 aspect-video w-full rounded-xl" />

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        <Skeleton className="h-72 rounded-xl" />
      </div>
    </section>
  )
}

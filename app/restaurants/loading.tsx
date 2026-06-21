import { Skeleton } from "@/components/ui/skeleton"

export default function RestaurantsLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Skeleton className="h-5 w-44" />

      <div className="mt-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-4 h-5 w-80 max-w-full" />
      </div>

      <div className="mt-8 grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10 w-full lg:w-28" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border">
            <Skeleton className="aspect-16/10 w-full rounded-none" />

            <div className="space-y-4 p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />

              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

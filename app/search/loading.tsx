import { Skeleton } from "@/components/ui/skeleton"

export default function SearchLoading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Skeleton className="h-5 w-36" />

      <div className="mt-8">
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="mt-4 h-5 w-96 max-w-full" />
      </div>

      <div className="mt-8 space-y-5 rounded-xl border p-5">
        <Skeleton className="h-10 w-full" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>

        <Skeleton className="h-6 w-32" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border">
            <Skeleton className="aspect-[16/10] rounded-none" />

            <div className="space-y-4 p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

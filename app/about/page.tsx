import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "About Restaurant Discovery.",
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Breadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "About",
            href: "/about",
          },
        ]}
      />

      <h1 className="mt-8 text-4xl font-bold tracking-tight">About</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Restaurant Discovery helps people browse restaurants by city and
        cuisine.
      </p>
    </section>
  )
}

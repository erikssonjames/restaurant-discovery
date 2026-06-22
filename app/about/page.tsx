import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { createPageMetadata } from "@/lib/seo/metadata"

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn how Restaurant Discovery helps people find restaurants by city, cuisine, price, and menu.",
  path: "/about",
})

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

import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { createPageMetadata } from "@/lib/seo/metadata"

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Restaurant Discovery with questions, corrections, or restaurant information.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Breadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Contact",
            href: "/contact",
          },
        ]}
      />

      <h1 className="mt-8 text-4xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-muted-foreground">
        Contact details will be added in a later phase.
      </p>
    </section>
  )
}

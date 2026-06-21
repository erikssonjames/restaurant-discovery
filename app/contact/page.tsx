import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Restaurant Discovery.",
}

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

      <h1 className="text-4xl font-bold tracking-tight mt-8">Contact</h1>
      <p className="mt-4 text-muted-foreground">
        Contact details will be added in a later phase.
      </p>
    </section>
  )
}

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Restaurant Discovery.",
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-muted-foreground">
        Contact details will be added in a later phase.
      </p>
    </section>
  )
}

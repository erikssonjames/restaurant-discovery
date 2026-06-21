import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const features = [
  {
    title: "Browse by city",
    description: "Find restaurants in the cities you are visiting.",
  },
  {
    title: "Explore cuisines",
    description: "Discover restaurants serving the food you enjoy.",
  },
  {
    title: "View restaurant details",
    description: "Check descriptions, menus and contact information.",
  },
]

export default function HomePage() {
  return (
    <>
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <Badge variant="secondary">Restaurant Discovery</Badge>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Find your next restaurant.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Browse restaurants by city and cuisine and find somewhere worth
            visiting.
          </p>

          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/restaurants">Browse restaurants</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}

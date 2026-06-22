import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLink, MapPin, Phone, Star } from "lucide-react"

import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { RestaurantDescription } from "@/components/restaurants/restaurant-description"
import { RestaurantGallery } from "@/components/restaurants/restaurant-gallery"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStrapiMediaUrl } from "@/lib/strapi/media"
import {
  getRestaurantBySlug,
  getRestaurantSlugs,
  type RestaurantDetailFields,
} from "@/lib/strapi/restaurants"
import { siteConfig } from "@/lib/site"
import { createRestaurantStructuredData } from "@/lib/seo/structured-data"
import { JsonLd } from "@/components/seo/json-ld"

export const revalidate = 3600
export const dynamicParams = true

type RestaurantPageProps = {
  params: Promise<{
    slug: string
  }>
}

const priceLabels: Record<RestaurantDetailFields["priceRange"], string> = {
  budget: "Budget",
  moderate: "Moderate",
  upscale: "Upscale",
  fine_dining: "Fine dining",
}

const currencyFormatter = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
  maximumFractionDigits: 0,
})

export async function generateStaticParams() {
  const slugs = await getRestaurantSlugs()

  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: RestaurantPageProps): Promise<Metadata> {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)

  if (!restaurant) {
    return {
      title: {
        absolute: `Restaurant not found | ${siteConfig.name}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const seo = restaurant.seo

  const title =
    seo?.metaTitle ||
    `${restaurant.name}${
      restaurant.city ? `, ${restaurant.city.name}` : ""
    } | ${siteConfig.name}`

  const description =
    seo?.metaDescription ||
    `View the menu, location, and details for ${restaurant.name}.`

  const canonical = seo?.canonicalUrl || `/restaurants/${restaurant.slug}`

  const firstImage = restaurant.images[0]?.image

  const ogImage = getStrapiMediaUrl(seo?.ogImage?.url || firstImage?.url)

  const twitterImage = getStrapiMediaUrl(
    seo?.twitterImage?.url || seo?.ogImage?.url || firstImage?.url
  )

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: !seo?.preventIndexing,
      follow: true,
    },
    openGraph: {
      type: "website",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: canonical,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: restaurant.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterImage ? "summary_large_image" : "summary",
      title: seo?.twitterTitle || seo?.ogTitle || title,
      description: seo?.twitterDescription || seo?.ogDescription || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  }
}

function normalizeWebsite(website: string | null): string | null {
  if (!website) {
    return null
  }

  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website
  }

  return `https://${website}`
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurantBySlug(slug)

  if (!restaurant) {
    notFound()
  }

  const website = normalizeWebsite(restaurant.website)

  const menuItems = [...restaurant.menuItems].sort(
    (first, second) =>
      first.category.localeCompare(second.category) ||
      first.name.localeCompare(second.name)
  )

  const reviews = [...restaurant.reviews].sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime()
  )

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : null

  const structuredData = createRestaurantStructuredData(restaurant)

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Breadcrumbs
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Restaurants",
            href: "/restaurants",
          },
          ...(restaurant.city
            ? [
                {
                  label: restaurant.city.name,
                  href: `/restaurants/city/${restaurant.city.slug}`,
                },
              ]
            : []),
          {
            label: restaurant.name,
            href: `/restaurants/${restaurant.slug}`,
          },
        ]}
      />

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {priceLabels[restaurant.priceRange]}
          </Badge>

          <Badge variant={restaurant.isOpen ? "default" : "outline"}>
            {restaurant.isOpen ? "Open" : "Closed"}
          </Badge>

          {restaurant.cuisines.map((cuisine) => (
            <Link
              key={cuisine.documentId}
              href={`/restaurants/cuisine/${cuisine.slug}`}
            >
              <Badge variant="outline" className="hover:bg-muted">
                {cuisine.name}
              </Badge>
            </Link>
          ))}
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {restaurant.name}
        </h1>

        {restaurant.city && (
          <p className="mt-3 flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" />

            <Link
              href={`/restaurants/city/${restaurant.city.slug}`}
              className="hover:text-foreground hover:underline"
            >
              {restaurant.city.name}
            </Link>
          </p>
        )}

        {averageRating !== null && (
          <p className="mt-3 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-current" aria-hidden="true" />

            <span>
              {averageRating.toFixed(1)} from {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </p>
        )}
      </header>

      <div className="mt-8">
        <RestaurantGallery name={restaurant.name} images={restaurant.images} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div>
          <section aria-labelledby="about-restaurant">
            <h2 id="about-restaurant" className="text-2xl font-semibold">
              About
            </h2>

            <div className="mt-4">
              <RestaurantDescription content={restaurant.description} />
            </div>
          </section>

          <Separator className="my-10" />

          <Tabs defaultValue="menu">
            <TabsList>
              <TabsTrigger value="menu">Menu</TabsTrigger>

              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="mt-6">
              {menuItems.length === 0 ? (
                <p className="text-muted-foreground">
                  No menu items are available.
                </p>
              ) : (
                <ul className="space-y-4">
                  {menuItems.map((item) => {
                    const imageUrl = getStrapiMediaUrl(item.image?.url)

                    return (
                      <li
                        key={item.documentId}
                        className="flex gap-4 rounded-lg border p-4"
                      >
                        {imageUrl && (
                          <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-md bg-muted sm:block">
                            <Image
                              src={imageUrl}
                              alt={item.image?.alternativeText || item.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>

                              <p className="mt-1 text-xs text-muted-foreground capitalize">
                                {item.category}
                              </p>
                            </div>

                            <p className="shrink-0 font-medium">
                              {currencyFormatter.format(Number(item.price))}
                            </p>
                          </div>

                          {item.description && (
                            <p className="mt-3 text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          )}

                          {!item.availability && (
                            <Badge variant="outline" className="mt-3">
                              Currently unavailable
                            </Badge>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">
                  No reviews have been added.
                </p>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((review) => (
                    <li
                      key={review.documentId}
                      className="rounded-lg border p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-semibold">{review.authorName}</h3>

                        <p
                          aria-label={`${review.rating} out of 5 stars`}
                          className="text-sm"
                        >
                          {"★".repeat(review.rating)}
                          {"☆".repeat(Math.max(0, 5 - review.rating))}
                        </p>
                      </div>

                      <time
                        dateTime={review.date}
                        className="mt-1 block text-xs text-muted-foreground"
                      >
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "medium",
                        }).format(new Date(review.date))}
                      </time>

                      {review.comment && (
                        <p className="mt-4 text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Restaurant details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0" aria-hidden="true" />

                <address className="text-sm text-muted-foreground not-italic">
                  <span className="block">{restaurant.address}</span>

                  <span className="block">
                    {restaurant.postalCode ? `${restaurant.postalCode} ` : ""}
                    {restaurant.city?.name}
                  </span>
                </address>
              </div>

              {restaurant.phoneNumber && (
                <div className="flex gap-3">
                  <Phone
                    className="mt-0.5 size-5 shrink-0"
                    aria-hidden="true"
                  />

                  <a
                    href={`tel:${restaurant.phoneNumber.replace(/\s+/g, "")}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {restaurant.phoneNumber}
                  </a>
                </div>
              )}

              {website && (
                <div className="flex gap-3">
                  <ExternalLink
                    className="mt-0.5 size-5 shrink-0"
                    aria-hidden="true"
                  />

                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm break-all text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm font-medium">Cuisines</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {restaurant.cuisines.map((cuisine) => (
                    <Link
                      key={cuisine.documentId}
                      href={`/restaurants/cuisine/${cuisine.slug}`}
                    >
                      <Badge variant="outline" className="hover:bg-muted">
                        {cuisine.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              <Separator />

              <Link
                href="/restaurants"
                className="inline-flex text-sm font-medium underline-offset-4 hover:underline"
              >
                Back to all restaurants
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>

      <JsonLd data={structuredData} />
    </article>
  )
}

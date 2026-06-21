import Image from "next/image"
import { MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getStrapiMediaUrl } from "@/lib/strapi/media"
import type { RestaurantFields } from "@/lib/strapi/restaurants"
import type { StrapiDocument } from "@/lib/strapi/types"
import Link from "next/link"

const priceLabels: Record<RestaurantFields["priceRange"], string> = {
  budget: "Budget",
  moderate: "Moderate",
  upscale: "Upscale",
  fine_dining: "Fine dining",
}

type RestaurantCardProps = {
  restaurant: StrapiDocument<RestaurantFields>
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const restaurantImage = restaurant.images?.[0]
  const imageUrl = getStrapiMediaUrl(restaurantImage?.image?.url)

  const imageAlt =
    restaurantImage?.altText ||
    restaurantImage?.image?.alternativeText ||
    `${restaurant.name} restaurant`

  return (
    <Card className="overflow-hidden pt-0">
      <div className="relative aspect-16/10 bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt + " ~ " + imageUrl}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle>
            <Link
              href={`/restaurants/${restaurant.slug}`}
              className="underline-offset-4 hover:underline"
            >
              {restaurant.name}
            </Link>
          </CardTitle>

          <Badge variant="secondary">
            {priceLabels[restaurant.priceRange]}
          </Badge>
        </div>

        <CardDescription className="flex items-center gap-1">
          <MapPin className="size-4" aria-hidden="true" />

          {restaurant.city ? (
            <Link
              href={`/restaurants/city/${restaurant.city.slug}`}
              className="hover:text-foreground hover:underline"
            >
              {restaurant.city.name}
            </Link>
          ) : (
            <span>City not assigned</span>
          )}
        </CardDescription>

        <p className="text-sm text-muted-foreground">
          {restaurant.address}
          {restaurant.postalCode ? `, ${restaurant.postalCode}` : ""}
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2" aria-label="Cuisines">
          {restaurant.cuisines.length > 0 ? (
            restaurant.cuisines.map((cuisine) => (
              <Link
                key={cuisine.documentId}
                href={`/restaurants/cuisine/${cuisine.slug}`}
              >
                <Badge variant="outline" className="hover:bg-muted">
                  {cuisine.name}
                </Badge>
              </Link>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No cuisine assigned
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

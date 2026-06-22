import type { MetadataRoute } from "next"

import { getSitemapContent } from "@/lib/strapi/sitemap"
import { siteConfig } from "@/lib/site"

export const revalidate = 3600

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { restaurants, cities, cuisines } = await getSitemapContent()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/restaurants"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/contact"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ]

  const restaurantPages: MetadataRoute.Sitemap = restaurants.map(
    (restaurant) => ({
      url: absoluteUrl(`/restaurants/${restaurant.slug}`),
      lastModified: restaurant.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  )

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: absoluteUrl(`/restaurants/city/${city.slug}`),
    lastModified: city.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const cuisinePages: MetadataRoute.Sitemap = cuisines.map((cuisine) => ({
    url: absoluteUrl(`/restaurants/cuisine/${cuisine.slug}`),
    lastModified: cuisine.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticPages, ...restaurantPages, ...cityPages, ...cuisinePages]
}

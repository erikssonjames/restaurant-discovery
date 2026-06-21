import Image from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getStrapiMediaUrl } from "@/lib/strapi/media"
import type { RestaurantImageSummary } from "@/lib/strapi/restaurants"

type RestaurantGalleryProps = {
  name: string
  images: RestaurantImageSummary[]
}

export function RestaurantGallery({ name, images }: RestaurantGalleryProps) {
  const slides = images.flatMap((entry) => {
    const src = getStrapiMediaUrl(entry.image?.url)

    if (!src) {
      return []
    }

    return [
      {
        src,
        alt:
          entry.altText || entry.image?.alternativeText || `${name} restaurant`,
      },
    ]
  })

  if (slides.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
        No images available
      </div>
    )
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={`${slide.src}-${index}`}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 1152px, 100vw"
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {slides.length > 1 && (
        <>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </>
      )}
    </Carousel>
  )
}

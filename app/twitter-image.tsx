import { createSocialImage } from "@/lib/seo/social-image"

export const alt = "Restaurant Discovery — find your next restaurant"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function TwitterImage() {
  return createSocialImage()
}

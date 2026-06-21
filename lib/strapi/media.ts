import "server-only"

export function getStrapiMediaUrl(
  path: string | null | undefined
): string | null {
  if (!path) {
    return null
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const baseUrl = process.env.STRAPI_API_URL ?? "http://localhost:1337"

  return new URL(path, baseUrl).toString()
}

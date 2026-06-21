import "server-only"

import qs from "qs"

export type StrapiFetchOptions = RequestInit & {
  query?: Record<string, unknown>
  next?: {
    revalidate?: number | false
    tags?: string[]
  }
}

export class StrapiApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
    public readonly responseBody: string
  ) {
    super(message)
    this.name = "StrapiApiError"
  }
}

function getRequiredEnvironmentVariable(
  name: "STRAPI_API_URL" | "STRAPI_API_TOKEN"
): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

export async function fetchFromStrapi<T>(
  endpoint: string,
  options: StrapiFetchOptions = {}
): Promise<T> {
  const apiUrl = getRequiredEnvironmentVariable("STRAPI_API_URL").replace(
    /\/+$/,
    ""
  )

  const apiToken = getRequiredEnvironmentVariable("STRAPI_API_TOKEN")

  const { query, headers, ...requestOptions } = options

  const normalizedEndpoint = endpoint.replace(/^\/+/, "")

  const queryString = query
    ? qs.stringify(query, {
        encodeValuesOnly: true,
        skipNulls: true,
      })
    : ""

  const url = `${apiUrl}/api/${normalizedEndpoint}${
    queryString ? `?${queryString}` : ""
  }`

  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")
  requestHeaders.set("Authorization", `Bearer ${apiToken}`)

  let response: Response

  try {
    response = await fetch(url, {
      ...requestOptions,
      headers: requestHeaders,
    })
  } catch (error) {
    throw new Error(`Could not connect to Strapi at ${url}`, {
      cause: error,
    })
  }

  if (!response.ok) {
    const responseBody = await response.text()

    throw new StrapiApiError(
      `Strapi request failed with status ${response.status}`,
      response.status,
      url,
      responseBody
    )
  }

  return (await response.json()) as T
}

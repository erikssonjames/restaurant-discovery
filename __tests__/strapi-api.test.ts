/** @jest-environment node */

import { fetchFromStrapi, StrapiApiError } from "@/lib/strapi/api"

describe("fetchFromStrapi", () => {
  const originalApiUrl = process.env.STRAPI_API_URL
  const originalApiToken = process.env.STRAPI_API_TOKEN

  beforeEach(() => {
    process.env.STRAPI_API_URL = "http://localhost:1337"
    process.env.STRAPI_API_TOKEN = "test-token"

    jest.restoreAllMocks()
  })

  afterAll(() => {
    if (originalApiUrl === undefined) {
      delete process.env.STRAPI_API_URL
    } else {
      process.env.STRAPI_API_URL = originalApiUrl
    }

    if (originalApiToken === undefined) {
      delete process.env.STRAPI_API_TOKEN
    } else {
      process.env.STRAPI_API_TOKEN = originalApiToken
    }
  })

  it("sends the API token and serializes query parameters", async () => {
    const payload = {
      data: [],
      meta: {},
    }

    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
      text: async () => JSON.stringify(payload),
    } as Response)

    const result = await fetchFromStrapi("restaurants", {
      query: {
        filters: {
          name: {
            $containsi: "ramen",
          },
        },
        pagination: {
          page: 2,
        },
      },
    })

    expect(result).toEqual(payload)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, options] = fetchMock.mock.calls[0]
    const headers = new Headers(options?.headers)

    expect(String(url)).toContain("http://localhost:1337/api/restaurants?")
    expect(String(url)).toContain("filters[name][$containsi]=ramen")
    expect(String(url)).toContain("pagination[page]=2")

    expect(headers.get("Authorization")).toBe("Bearer test-token")
    expect(headers.get("Accept")).toBe("application/json")
    expect(options?.next?.tags).toContain("strapi-content")
  })

  it("throws StrapiApiError for unsuccessful responses", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    } as Response)

    await expect(fetchFromStrapi("restaurants")).rejects.toMatchObject<
      Partial<StrapiApiError>
    >({
      name: "StrapiApiError",
      status: 401,
      responseBody: "Unauthorized",
    })
  })

  it("throws when the API token is missing", async () => {
    delete process.env.STRAPI_API_TOKEN

    await expect(fetchFromStrapi("restaurants")).rejects.toThrow(
      "Missing environment variable: STRAPI_API_TOKEN"
    )
  })

  it("reports connection failures", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValue(new Error("Connection refused"))

    await expect(fetchFromStrapi("restaurants")).rejects.toThrow(
      "Could not connect to Strapi"
    )
  })
})

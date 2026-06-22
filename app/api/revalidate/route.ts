import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

import { STRAPI_CACHE_TAG } from "@/lib/strapi/api"

export async function POST(request: Request) {
  const secret = process.env.STRAPI_REVALIDATION_SECRET

  if (!secret) {
    return NextResponse.json(
      { error: "STRAPI_REVALIDATION_SECRET is not configured" },
      { status: 500 }
    )
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // `expire: 0` makes the next request fetch fresh content instead of serving
  // stale data while it is regenerated.
  revalidateTag(STRAPI_CACHE_TAG, { expire: 0 })

  return NextResponse.json({ revalidated: true })
}

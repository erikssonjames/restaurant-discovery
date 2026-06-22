import { ImageResponse } from "next/og"

import { siteConfig } from "@/lib/site"

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#111111",
        color: "#fafafa",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        {siteConfig.name}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: 950,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          }}
        >
          Find your next restaurant.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#b5b5b5",
          }}
        >
          Discover restaurants by city and cuisine.
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}

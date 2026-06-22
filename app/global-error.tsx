"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & {
    digest?: string
  }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <title>Something went wrong</title>

        <main
          style={{
            maxWidth: "48rem",
            margin: "0 auto",
            padding: "5rem 1rem",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          <h1>Something went wrong</h1>

          <p>The application could not be loaded.</p>

          <button
            type="button"
            onClick={unstable_retry}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}

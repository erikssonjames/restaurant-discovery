import Link from "next/link"

import { siteConfig } from "@/lib/site"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="landing-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="landing-display text-2xl tracking-[-0.05em]">
            BiteAtlas
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            A more delicious way to know a place.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="landing-shell py-4 text-sm text-muted-foreground">
          © {new Date().getFullYear()} BiteAtlas
        </div>
      </div>
    </footer>
  )
}

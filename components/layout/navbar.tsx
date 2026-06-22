import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig } from "@/lib/site"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-foreground backdrop-blur">
      <div className="landing-shell flex h-16 items-center justify-between">
        <Link
          href="/"
          className="landing-display text-[1.65rem] tracking-[-0.055em]"
          aria-label={`${siteConfig.name} home`}
        >
          BiteAtlas
        </Link>
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-10 text-sm md:flex"
        >
          <Link
            href="/restaurants"
            className="transition-opacity hover:opacity-55"
          >
            Discover
          </Link>
          <Link href="/search" className="transition-opacity hover:opacity-55">
            Cities
          </Link>
          <Link href="/about" className="transition-opacity hover:opacity-55">
            About
          </Link>
        </nav>
        <Button asChild className="hidden md:inline-flex">
          <Link href="/restaurants">Explore restaurants</Link>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="lg:hidden"
            >
              <Menu aria-hidden="true" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-background">
            <SheetHeader>
              <SheetTitle className="landing-display text-2xl">
                BiteAtlas
              </SheetTitle>
            </SheetHeader>
            <nav
              aria-label="Mobile navigation"
              className="mt-8 flex flex-col gap-2"
            >
              {[
                { href: "/restaurants", label: "Discover" },
                { href: "/search", label: "Cities" },
                { href: "/about", label: "About" },
              ].map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="border-b border-border py-4 text-lg"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

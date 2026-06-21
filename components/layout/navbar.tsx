import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";
import { LinkActiveButton } from "./link-active-button";

export function Navbar() {

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-semibold tracking-tight"
          aria-label={`${siteConfig.name} home`}
        >
          {siteConfig.name}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {siteConfig.navigation.map((item) => (
            <LinkActiveButton key={item.href} item={item} />
          ))}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu aria-hidden="true" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>

            <nav
              aria-label="Mobile navigation"
              className="mt-8 flex flex-col gap-2"
            >
              <SheetClose asChild>
                <Link
                  href="/"
                  className="rounded-md px-3 py-3 font-semibold hover:bg-muted"
                >
                  Home
                </Link>
              </SheetClose>

              {siteConfig.navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <LinkActiveButton item={item} />
                  </SheetClose>
                )
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
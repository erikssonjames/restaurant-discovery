import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Compass, MapPin } from "lucide-react"

import { JsonLd } from "@/components/seo/json-ld"
import { Button } from "@/components/ui/button"
import { createSiteStructuredData } from "@/lib/seo/structured-data"
import { createPageMetadata } from "@/lib/seo/metadata"

const companies = [
  { name: "Northstar", className: "tracking-[0.32em] text-[0.8rem]" },
  { name: "Monocle", className: "font-serif text-2xl" },
  {
    name: "Field Notes",
    className:
      "max-w-20 text-center text-sm font-black leading-3 tracking-[0.18em]",
  },
  {
    name: "The Table",
    className: "font-serif text-2xl underline decoration-1 underline-offset-8",
  },
  { name: "Atlas", className: "font-serif text-2xl tracking-[0.35em]" },
]

export const metadata = createPageMetadata({
  title: "Discover remarkable restaurants",
  description:
    "Discover restaurants by city and cuisine and find somewhere worth visiting.",
  path: "/",
})

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="landing-shell grid min-h-[650px] items-center gap-10 py-14 lg:grid-cols-[0.86fr_1.14fr] lg:py-12">
          <div className="relative z-10 max-w-xl lg:py-12">
            <h1 className="landing-display text-5xl leading-[0.94] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[5.65rem]">
              Find your next unforgettable table.
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
              Considered restaurant recommendations, gathered from the cities
              that know how to eat.
            </p>
            <Button asChild size="lg" className="mt-9">
              <Link href="/restaurants">
                Explore restaurants <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </Button>
          </div>

          <div className="hero-image-wrap relative min-h-[360px] overflow-hidden sm:min-h-[480px] lg:min-h-[620px]">
            <Image
              src="/images/hero-scallops.png"
              alt="Seared scallops with mushrooms and seasonal vegetables"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-[62%_center]"
            />
          </div>
        </div>
      </section>

      <section
        className="border-b border-border bg-background py-6"
        aria-label="Featured in"
      >
        <div className="landing-shell flex items-center gap-8 overflow-hidden">
          <p className="shrink-0 text-sm text-muted-foreground">
            Loved by diners in
          </p>
          <div
            className="company-fade relative min-w-0 flex-1 overflow-hidden"
            aria-hidden="true"
          >
            <div className="company-track flex w-max items-center gap-10 sm:gap-16">
              {[...companies, ...companies].map((company, index) => (
                <span
                  key={`${company.name}-${index}`}
                  className={`flex min-w-[118px] items-center justify-center whitespace-nowrap text-foreground ${company.className}`}
                >
                  {company.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-shell grid border-b border-border bg-background text-foreground lg:grid-cols-2">
        <div className="flex min-h-[410px] flex-col justify-center border-b border-border py-16 lg:border-r lg:border-b-0 lg:pr-16">
          <Compass className="mb-8 text-primary" strokeWidth={1.5} size={36} />
          <h2 className="landing-display max-w-md text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
            Discover with local insight.
          </h2>
          <p className="mt-5 max-w-sm leading-7 text-muted-foreground">
            Follow the places people return to: neighborhood rituals, long
            lunches and late-night rooms worth crossing town for.
          </p>
          <Button
            asChild
            variant="link"
            className="mt-6 w-fit px-0 text-primary"
          >
            <Link href="/restaurants">
              See what&apos;s nearby <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </Button>
        </div>

        <div className="flex min-h-[410px] flex-col justify-center py-16 lg:pl-16">
          <MapPin className="mb-8 text-primary" strokeWidth={1.5} size={36} />
          <h2 className="landing-display max-w-md text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
            Explore cities, one bite at a time.
          </h2>
          <p className="mt-5 max-w-sm leading-7 text-muted-foreground">
            From a reliable counter seat to a destination dining room, find the
            places that make a city taste like itself.
          </p>
          <Button
            asChild
            variant="link"
            className="mt-6 w-fit px-0 text-primary"
          >
            <Link href="/search">
              Start exploring <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="landing-shell grid gap-10 py-16 md:grid-cols-[1.2fr_0.9fr_auto] md:items-center md:py-20">
          <h2 className="landing-display max-w-xl text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
            Your next great meal is closer than you think.
          </h2>
          <p className="max-w-sm border-l border-background/50 pl-7 leading-7 text-background/75">
            Save your favorites, follow your appetite and make every plan a
            little more delicious.
          </p>
          <Button asChild>
            <Link href="/restaurants">
              Find a table <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </Button>
        </div>
      </section>

      <JsonLd data={createSiteStructuredData()} />
    </>
  )
}

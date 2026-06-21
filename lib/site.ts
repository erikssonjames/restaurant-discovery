export const siteConfig = {
  name: "Restaurant Discovery",
  description: "Discover restaurants by city and cuisine.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  navigation: [
    {
      label: "Restaurants",
      href: "/restaurants",
    },
    {
      label: "Search",
      href: "/search",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
} as const

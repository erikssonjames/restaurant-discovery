# Restaurant Discovery

A restaurant discovery website built with Next.js and Strapi.

Users can browse restaurants, filter results, and explore dedicated pages for cities, cuisines, and individual restaurants.

## Tech stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Strapi
* Supabase PostgreSQL

## Project structure

* `/app` — Pages and routes
* `/components` — Shared interface components
* `/lib/strapi` — Strapi API client and content queries
* `/lib/seo` — Metadata helpers
* `/cms` — Strapi CMS

## Running locally

Install dependencies:

```bash
npm install
npm --prefix cms install
```

Create `.env.local` and `cms/.env` from the matching example files.

Start the frontend:

```bash
npm run dev
```

Start the CMS in another terminal:

```bash
npm run cms:dev
```

The frontend runs at `http://localhost:3000`.

The Strapi admin panel runs at `http://localhost:1337/admin`.

## Refreshing CMS content

CMS responses are cached by Next.js for performance. To refresh them as soon as
content changes, set a long random value for `STRAPI_REVALIDATION_SECRET` in
the frontend environment, then create a Strapi webhook:

* **URL:** `https://your-site.example/api/revalidate`
* **Events:** entry create, update, publish, unpublish, and delete for the
  restaurant, city, cuisine, and menu-item content types
* **Header:** `Authorization: Bearer <STRAPI_REVALIDATION_SECRET>`

The webhook invalidates the shared Strapi cache tag. The next request then
renders the page with the updated CMS content; no frontend redeploy is needed.

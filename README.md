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

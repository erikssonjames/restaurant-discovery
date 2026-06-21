# Restaurant Discovery

A restaurant discovery website built with Next.js and Strapi.

Users can browse restaurants by city and cuisine, view restaurant details, and search using filters.

## Tech stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Strapi
* Supabase PostgreSQL

## Project structure

* `/app` — Pages and layouts
* `/components` — Shared frontend components
* `/cms` — Strapi CMS
* `/cms/src/api` — Content types
* `/cms/src/components` — Reusable CMS fields

## Content

The CMS stores cities, cuisines, restaurants, menu items, images, and SEO metadata. Local development data includes restaurants in Copenhagen and Aarhus.

## Running locally

Install dependencies:

```bash
npm install
npm --prefix cms install
```

Create `.env.local` and `cms/.env` using the matching example files.

Start the frontend:

```bash
npm run dev
```

Start Strapi in another terminal:

```bash
npm run cms:dev
```

The frontend runs at `http://localhost:3000`.

The Strapi admin panel runs at `http://localhost:1337/admin`.

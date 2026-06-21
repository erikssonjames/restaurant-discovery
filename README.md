# Restaurant Discovery

A restaurant discovery website built with Next.js and Strapi.

Users will be able to browse restaurants by city and cuisine, view restaurant details, and search using filters.

## Tech stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Strapi
* Supabase PostgreSQL

## Project structure

* `/` — Next.js frontend
* `/cms` — Strapi CMS

## Getting started

Install the frontend dependencies:

```bash
npm install
```

Install the CMS dependencies:

```bash
npm --prefix cms install
```

Create `.env.local` for the frontend and `cms/.env` for Strapi. Use the matching `.env.example` files as templates.

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

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run format
npm run cms:dev
npm run cms:build
```

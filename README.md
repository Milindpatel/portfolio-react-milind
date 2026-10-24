# Portfolio & Blog – Milind Patel

A personal website with a work-history portfolio and a blog, including a rich-text editor for writing posts. Visitors can browse; the site owner logs in with Auth0 to manage portfolio entries and blog posts.

![CI](https://github.com/Milindpatel/portfolio-react-milind/actions/workflows/ci.yml/badge.svg)

## Features

- Home page with animated hero, About and CV pages.
- **Portfolio:** work-history cards with a details modal; the owner can create, edit and delete entries.
- **Blog:** public list of published posts and post pages; the owner gets a dashboard to publish/unpublish/delete posts and a Slate-based editor (select text for the formatting toolbar, Ctrl/Cmd+S to save).
- Auth0 login. API routes check the JWT and a `siteOwner` role claim.
- Blog HTML is sanitized on the server; draft posts are only visible to the owner.

## Tech stack

Next.js 16 (Pages Router) + React 19, Express 5 API on the same server, MongoDB with Mongoose 9, Auth0 (auth0-js + jose / express-jwt), Bootstrap 5 via reactstrap, Formik, Slate, Vitest + Supertest + mongodb-memory-server.

## Getting started

Requires Node.js 20.9+ and a MongoDB database (local or Atlas).

```bash
cp .env.example .env      # then fill in DB_URI and Auth0 values
npm install
npm run dev               # http://localhost:3000
```

Load the variables from `.env` into your shell (or your host's settings) before starting; for example `set -a; source .env; set +a`.

### Auth0 setup

1. Create a **Single Page Application** in Auth0. Add `http://localhost:3000/callback` to *Allowed Callback URLs* and `http://localhost:3000` to *Allowed Logout URLs* and *Allowed Web Origins*.
2. Add an Action/Rule that puts the user's role in the ID token under `<NAMESPACE>/role`, and give your own account the role `siteOwner`.
3. Put the domain, client ID and namespace in `.env`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Express + Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm test` | Unit tests, plus API tests against an in-memory MongoDB |

## API

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/v1/portfolios`, `/api/v1/portfolios/:id` | public |
| POST/PATCH/DELETE | `/api/v1/portfolios[/:id]` | site owner |
| GET | `/api/v1/blogs`, `/api/v1/blogs/s/:slug` | public (published only) |
| GET | `/api/v1/blogs/me`, `/api/v1/blogs/:id` | site owner |
| POST/PATCH/DELETE | `/api/v1/blogs[/:id]` | site owner |

## Project layout

```
pages/              Next.js pages (file-based routes)
components/         layout, forms, portfolio cards, Slate editor
lib/                API client, Auth0 helpers, shared config, utils
server/             Express app, routes, controllers, Mongoose models
styles/             Sass
test/               Vitest tests
```

## Credits

Based on the "Real World Portfolio" course project; updated to current Next.js, React and Node in 2026. Illustrations from [vecteezy.com](https://www.vecteezy.com/).

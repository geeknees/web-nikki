# web-nikki

Personal blog published at <https://geeknees.github.io/web-nikki/>.

This repository is an Astro static site for Japanese posts and their English and Chinese translations. It started from `astro-theme-typography`, but it is now maintained as a site-specific codebase rather than an upstream theme fork.

## Stack

- Astro 7, TypeScript, UnoCSS
- Astro content collections for blog posts
- GitHub Pages deployment
- Atom feed and a hand-written sitemap route
- Japanese root routes with English and Chinese routes under `/en` and `/zh`
- Full-text search with [Pagefind](https://pagefind.app/) at `/search/`, `/en/search/`, and `/zh/search/`

## Search

`pnpm build` runs `pagefind --site dist` after `astro build`. Pagefind builds a separate index per `<html lang>` (`ja-jp`, `en-us`, `zh-cn`), so each search page only finds posts in its own language.

Only post detail pages are indexed: the post body is wrapped in `data-pagefind-body`, and the post `<h1>` carries `data-pagefind-meta="title"` so results show the post title instead of the site header.

The index only exists in build output. Under `pnpm dev` the search page cannot load results; use `pnpm build && pnpm preview` to try it locally.

## Development

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Run verification:

```bash
pnpm test
```

The deploy workflow runs `pnpm test` before uploading the GitHub Pages artifact.

## Content

Japanese posts live directly under `src/content/posts/`.

English and Chinese translations live under:

- `src/content/posts/en/`
- `src/content/posts/zh/`

Translation filenames follow this convention:

- Japanese: `src/content/posts/<stem>.md`
- English: `src/content/posts/en/en-<stem>.md`
- Chinese: `src/content/posts/zh/zh-<stem>.md`

All three versions of the same article should share the same `translationKey`. The content schema also expects `language`, `categories`, `keywords`, `pubDate`, `title`, and `description`.

Create a draft post scaffold:

```bash
pnpm new-post
```

## Configuration

Site configuration is in `src/theme.config.ts`.

Route and language helpers are in `src/i18n.ts`. The canonical base path is `SITE_BASE_PATH`, currently `/web-nikki`; avoid hardcoding that path in components or routes.

Google Analytics is controlled by `googleAnalyticsId` in `src/theme.config.ts`. Leave it unset to omit the tracking scripts.

Comments are intentionally not enabled. The old Disqus/Giscus/Twikoo theme code was removed to reduce unused dependencies and external script risk.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml`:

1. Installs dependencies with pnpm.
2. Runs the full test suite.
3. Uploads `dist/` as the GitHub Pages artifact.
4. Deploys the tested artifact.

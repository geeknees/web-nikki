// ABOUTME: Generates a single XML sitemap for the GitHub Pages deployment under /web-nikki.
// ABOUTME: Avoids a sitemap index indirection so Search Console only needs to fetch one stable sitemap URL.

import type { APIContext } from 'astro'

import { getCategories, getPathFromCategory, getPosts } from '~/utils'
import { THEME_CONFIG } from '~/theme.config'

function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, THEME_CONFIG.website).toString()
}

function createSitemapEntry(url: string, lastModified?: Date) {
  const lastmod = lastModified
    ? `<lastmod>${lastModified.toISOString()}</lastmod>`
    : ''

  return `<url><loc>${url}</loc>${lastmod}</url>`
}

export async function GET(_context: APIContext) {
  const posts = await getPosts()
  const categories = await getCategories()

  const staticEntries = [
    createSitemapEntry(getAbsoluteUrl('/web-nikki/')),
    createSitemapEntry(getAbsoluteUrl('/web-nikki/about/')),
    createSitemapEntry(getAbsoluteUrl('/web-nikki/archive/')),
    createSitemapEntry(getAbsoluteUrl('/web-nikki/categories/'))
  ]

  const categoryEntries = Array.from(categories.keys()).map((category) =>
    createSitemapEntry(
      getAbsoluteUrl(
        `/web-nikki/categories/${getPathFromCategory(
          category,
          THEME_CONFIG.category_map
        )}/`
      )
    )
  )

  const postEntries = posts.map((post) =>
    createSitemapEntry(
      getAbsoluteUrl(`/web-nikki/posts/${post.slug}/`),
      post.data.pubDate
    )
  )

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    [...staticEntries, ...categoryEntries, ...postEntries].join('') +
    '</urlset>'

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  })
}

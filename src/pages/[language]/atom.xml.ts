// ABOUTME: Localized Atom feed routes for translated posts.
// ABOUTME: Generates /en/atom.xml and /zh/atom.xml alongside the Japanese root feed.

import type { APIContext } from 'astro'

import { createFeed } from '~/utils/feed'
import { TRANSLATED_LANGUAGES, type SiteLanguage } from '~/i18n'

export function getStaticPaths() {
  return TRANSLATED_LANGUAGES.map((language) => ({
    params: { language },
    props: { language }
  }))
}

export async function GET(context: APIContext) {
  return createFeed(context.props.language as SiteLanguage)
}

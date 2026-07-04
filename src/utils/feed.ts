// ABOUTME: Builds localized Atom feed responses from content collection posts.
// ABOUTME: Keeps root and translated feed routes aligned.

import rss from '@astrojs/rss'
import MarkdownIt from 'markdown-it'
import sanitizeHtml from 'sanitize-html'

import { THEME_CONFIG } from '~/theme.config'
import {
  DEFAULT_LANGUAGE,
  getPostPath,
  SITE_LANGUAGES,
  withBasePath,
  type SiteLanguage
} from '~/i18n'
import { getPosts } from '~/utils'

const parser = new MarkdownIt()

export async function createFeed(language: SiteLanguage = DEFAULT_LANGUAGE) {
  const languageConfig = SITE_LANGUAGES[language]
  const posts = await getPosts({ language })
  const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img'])

  return rss({
    title: languageConfig.title,
    description: languageConfig.desc,
    site: THEME_CONFIG.website,
    items: posts.map((post) => ({
      link: getPostPath(post),
      author: THEME_CONFIG.author,
      content: sanitizeHtml(parser.render(post.body ?? ''), { allowedTags }),
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      customData: post.data.customData,
      categories: post.data.categories,
      commentsUrl: post.data.commentsUrl,
      source: post.data.source,
      enclosure: post.data.enclosure
    })),
    stylesheet: withBasePath('/pretty-feed-v3.xsl')
  })
}

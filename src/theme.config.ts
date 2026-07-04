import { withBasePath } from './i18n'

export const THEME_CONFIG: App.Locals['config'] = {
  /** blog title */
  title: 'Web日記（web-nikki）',
  /** your name */
  author: 'geeknees',
  /** website description */
  desc: "geeknees's Web日記（web-nikki）",
  /** your deployed domain */
  website: 'https://geeknees.github.io/',
  /** your locale */
  locale: 'ja-jp',
  /** Google Analytics measurement ID */
  googleAnalyticsId: 'G-C536MZEKVL',
  /** theme style */
  themeStyle: 'light',
  /** your socials */
  socials: [
    {
      name: 'github',
      href: 'https://github.com/geeknees'
    },
    {
      name: 'rss',
      href: withBasePath('/atom.xml')
    },
    {
      name: 'twitter',
      href: 'https://twitter.com/_geeknees'
    }
  ],
  /** your header info */
  header: {
    twitter: '@_geeknees'
  },
  /** your navigation links */
  navs: [
    {
      name: 'Posts',
      href: withBasePath('/posts/page/1')
    },
    {
      name: 'Archive',
      href: withBasePath('/archive')
    },
    {
      name: 'Categories',
      href: withBasePath('/categories')
    }
  ],
  /** your category name mapping, which the `path` will be shown in the url */
  category_map: []
}

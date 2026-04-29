// ABOUTME: Defines supported site languages, UI copy, and route helpers.
// ABOUTME: Keeps Japanese URLs stable while adding prefixed English and Chinese pages.

export const DEFAULT_LANGUAGE = 'ja'
export const SITE_BASE_PATH = '/web-nikki'

export const SITE_LANGUAGES = {
  ja: {
    locale: 'ja-jp',
    label: '日本語',
    pathPrefix: '',
    title: 'Web日記（web-nikki）',
    desc: "geeknees's Web日記（web-nikki）"
  },
  en: {
    locale: 'en-us',
    label: 'English',
    pathPrefix: '/en',
    title: 'Web Diary (web-nikki)',
    desc: "geeknees's web diary about engineering, product work, learning, and everyday life."
  },
  zh: {
    locale: 'zh-cn',
    label: '中文',
    pathPrefix: '/zh',
    title: 'Web日记（web-nikki）',
    desc: 'geeknees 关于工程、产品、学习与生活的网络日记。'
  }
} as const

export type SiteLanguage = keyof typeof SITE_LANGUAGES
export const TRANSLATED_LANGUAGES: SiteLanguage[] = ['en', 'zh']

export const LANGUAGES = {
  'zh-cn': {
    Home: '首页',
    Posts: '文章',
    Categories: '分类',
    Archive: '归档',
    Tags: '标签',
    About: '关于',
    Links: '链接',

    posted_at: '发布于',
    tag_count: '%d 篇',
    archive_count: '%d 篇',
    categories_count: '%d 篇',
    page_count: '共 %d 页',
    page_number: '第 %d 页',
    all_posts: '所有文章',
    comments: '评论',
    share: '分享到',
    prev: '上一页',
    next: '下一页',
    prev_post: '上一篇',
    next_post: '下一篇',
    language: '语言',
    read_by_topic: '按主题阅读',
    keywords: '关键词',
  },
  'en-us': {
    Home: 'Home',
    Posts: 'Posts',
    Categories: 'Categories',
    Archive: 'Archive',
    Tags: 'Tags',
    About: 'About',
    Links: 'Links',

    posted_at: 'Posted at',
    tag_count: '%d tags',
    archive_count: '%d post',
    categories_count: '%d post',
    page_count: '%d',
    page_number: 'Page %d',
    all_posts: 'All Posts',
    comments: 'comments',
    share: 'Share',
    prev: 'Previous',
    next: 'Next',
    prev_post: 'Previous post',
    next_post: 'Next post',
    language: 'Language',
    read_by_topic: 'Read by topic',
    keywords: 'Keywords',
  },
  'zh-tw': {
    Home: '首頁',
    Posts: '文章',
    Categories: '分類',
    Archive: '歸檔',
    Tags: '標籤',
    About: '關於',
    Links: '鏈接',

    posted_at: '發佈於',
    tag_count: '%d 篇',
    archive_count: '%d 篇',
    categories_count: '%d 篇',
    page_count: '共 %d 頁',
    page_number: '第 %d 頁',
    all_posts: '所有文章',
    comments: '評論',
    share: '分享到',
    prev: '上一頁',
    next: '下一頁',
    prev_post: '上一篇',
    next_post: '下一篇',
    language: '語言',
    read_by_topic: '按主題閱讀',
    keywords: '關鍵詞',
  },
  'ja-jp': {
    Home: 'ホーム',
    Posts: '投稿',
    Categories: 'カテゴリー',
    Archive: 'アーカイブ',
    Tags: 'タグ',
    About: '私について',
    Links: 'リンク',

    posted_at: '投稿日',
    tag_count: '%d タグ',
    archive_count: '%d 投稿',
    categories_count: '%d 投稿',
    page_count: '%d',
    page_number: 'ページ %d',
    all_posts: 'すべての投稿',
    comments: 'コメント',
    share: 'シェア',
    prev: '前へ',
    next: '次へ',
    prev_post: '前の投稿',
    next_post: '次の投稿',
    language: '言語',
    read_by_topic: 'テーマ別に読む',
    keywords: 'キーワード',
  },
}

export function isSiteLanguage(value: string): value is SiteLanguage {
  return value in SITE_LANGUAGES
}

export function getLocaleFromLanguage(language: SiteLanguage) {
  return SITE_LANGUAGES[language].locale
}

export function getLanguageFromLocale(locale: keyof typeof LANGUAGES): SiteLanguage {
  const language = Object.entries(SITE_LANGUAGES).find(
    ([, config]) => config.locale === locale
  )?.[0]

  if (language && isSiteLanguage(language)) {
    return language
  }

  return DEFAULT_LANGUAGE
}

function stripBasePath(pathname: string) {
  if (pathname === SITE_BASE_PATH) return '/'
  if (pathname.startsWith(`${SITE_BASE_PATH}/`)) {
    return pathname.slice(SITE_BASE_PATH.length) || '/'
  }

  return pathname || '/'
}

export function getLanguageFromPathname(pathname: string): SiteLanguage {
  const normalized = stripBasePath(pathname)
  const firstSegment = normalized.split('/').filter(Boolean)[0]

  return firstSegment && isSiteLanguage(firstSegment)
    ? firstSegment
    : DEFAULT_LANGUAGE
}

export function stripLanguagePathPrefix(pathname: string) {
  const normalized = stripBasePath(pathname)
  const segments = normalized.split('/').filter(Boolean)

  if (segments[0] && isSiteLanguage(segments[0])) {
    segments.shift()
  }

  return `/${segments.join('/')}`.replace(/\/$/, '') || '/'
}

export function getLocalizedPath(pathname: string, language: SiteLanguage) {
  const pathWithoutLanguage = normalizePostPathname(stripLanguagePathPrefix(pathname))
  const prefix = SITE_LANGUAGES[language].pathPrefix
  const suffix = pathWithoutLanguage === '/' ? '/' : `${pathWithoutLanguage}/`
  const localizedPath = `${SITE_BASE_PATH}${prefix}${suffix}`

  return localizedPath.replace(/\/{2,}/g, '/')
}

function normalizePostPathname(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)

  if (segments[0] === 'posts' && segments[1]) {
    segments[1] = normalizePostSlug(segments[1])
  }

  return `/${segments.join('/')}`.replace(/\/$/, '') || '/'
}

export function getLanguageSwitcherLinks(pathname: string) {
  return Object.entries(SITE_LANGUAGES).map(([language, config]) => ({
    language: language as SiteLanguage,
    label: config.label,
    href: getLocalizedPath(pathname, language as SiteLanguage)
  }))
}

export function getLanguageFromPost(post: Post): SiteLanguage {
  const language = post.data.language
  return typeof language === 'string' && isSiteLanguage(language)
    ? language
    : DEFAULT_LANGUAGE
}

export function getPostSlug(post: Post) {
  return normalizePostSlug(post.data.postSlug ?? post.id.split('/').at(-1) ?? post.id)
}

export function getPostTranslationKey(post: Post) {
  return normalizePostSlug(post.data.translationKey ?? getPostSlug(post))
}

export function getPostPath(post: Post) {
  const language = getLanguageFromPost(post)
  return getLocalizedPath(`/posts/${getPostSlug(post)}/`, language)
}

export function normalizePostSlug(slug: string) {
  return slug.toLowerCase()
}

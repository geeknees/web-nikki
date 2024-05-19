export const THEME_CONFIG: App.Locals['config'] = {
  /** blog title */
  title: 'Web日記（WebNikki）',
  /** your name */
  author: 'geeknees',
  /** website description */
  desc: "geeknees's Web日記（WebNikki）",
  /** your deployed domain */
  website: 'https://geeknees.github.io/',
  /** your locale */
  locale: 'en-us',
  /** theme style */
  themeStyle: 'auto',
  /** your socials */
  socials: [
    {
      name: 'github',
      href: 'https://github.com/geeknees'
    },
    {
      name: 'rss',
      href: '/WebNikki/atom.xml'
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
      href: '/WebNikki/posts/page/1'
    },
    {
      name: 'Archive',
      href: '/WebNikki/archive'
    }
    // {
    //   name: 'Categories',
    //   href: '/WebNikki/categories'
    // },
    // {
    //   name: 'About',
    //   href: 'WebNikki/about'
    // }
  ],
  /** your category name mapping, which the `path` will be shown in the url */
  category_map: [{ name: '胡适', path: 'hu-shi' }],
  /** your comment provider */
  comments: {
    // disqus: {
    //   shortname: 'typography-astro'
    // }
    // giscus: {
    //   repo: 'moeyua/astro-theme-typography',
    //   repoId: 'R_kgDOKy9HOQ',
    //   category: 'General',
    //   categoryId: 'DIC_kwDOKy9HOc4CegmW',
    //   mapping: 'title',
    //   strict: '0',
    //   reactionsEnabled: '1',
    //   emitMetadata: '1',
    //   inputPosition: 'top',
    //   theme: 'light',
    //   lang: 'zh-CN',
    //   loading: 'lazy',
    // },
    // twikoo: {
    //   envId: "https://twikoo-tau-flame.vercel.app",
    // }
  }
}

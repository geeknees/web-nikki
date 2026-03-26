// ABOUTME: Curated post categories derived from reading the archive and grouping posts by topic.
// ABOUTME: Used to surface stable, topic-based internal links from the homepage without relying on slug heuristics.

const POST_CATEGORY_BY_SLUG = {
  '2015-06-13': '仕事と組織・プロダクト',
  '2015-06-17': '仕事と組織・プロダクト',
  '2015-06-20_cto': '仕事と組織・プロダクト',
  '2015-07-10_edtech': '教育・学習',
  '2015-07-16': '仕事と組織・プロダクト',
  '2015-07-22_deep-learning': 'AI・インターネット・未来',
  '2015-07-24': 'AI・インターネット・未来',
  '2015-07-26-1': '仕事と組織・プロダクト',
  '2015-07-26-2': '個人史・文化',
  '2015-08-04': '仕事と組織・プロダクト',
  '2015-08-17': '仕事と組織・プロダクト',
  '2015-08-23': '個人史・文化',
  '2016-02-05': 'AI・インターネット・未来',
  '2016-11-28': '仕事と組織・プロダクト',
  '2017-01-14': '仕事と組織・プロダクト',
  '2017-08-19': 'AI・インターネット・未来',
  '2018-06-02_rubykaigi': 'RubyKaigi・技術コミュニティ',
  '2018-09-12': '仕事と組織・プロダクト',
  '2019-01-23': '個人史・文化',
  '2019-04-20_rubykaigi': 'RubyKaigi・技術コミュニティ',
  '2019-08-30': '仕事と組織・プロダクト',
  '2019-12-04_product': '仕事と組織・プロダクト',
  '2020-04-03': '仕事と組織・プロダクト',
  '2020-04-22': '仕事と組織・プロダクト',
  '2020-04-25_2020': '教育・学習',
  '2020-08-01': '仕事と組織・プロダクト',
  '2021-07-14': '教育・学習',
  '2021-09-23': '個人史・文化',
  '2021-11-10': '教育・学習',
  '2022-01-16_web3': 'AI・インターネット・未来',
  '2023-05-14_rubykaigi': 'RubyKaigi・技術コミュニティ',
  '2024-05-19_rubykaigi': 'RubyKaigi・技術コミュニティ',
  '2024-08-04_ai_human_collab': 'AI・インターネット・未来',
  '2024-10-27_the_art_of_maintaining_the_world': 'AI・インターネット・未来',
  '2024-11-19_ai_and_human': '教育・学習',
  '2025-03-23': '個人史・文化',
  '2025-04-21_rubykaigi': 'RubyKaigi・技術コミュニティ',
  '2025-07-04': 'AI・インターネット・未来',
  '2025-12-01': '個人史・文化',
  '2026-03-05': 'AI・インターネット・未来'
} as const

export const HOMEPAGE_POST_CATEGORY_ORDER = [
  '仕事と組織・プロダクト',
  '教育・学習',
  'AI・インターネット・未来',
  'RubyKaigi・技術コミュニティ',
  '個人史・文化'
] as const

type HomepagePostCategory = (typeof HOMEPAGE_POST_CATEGORY_ORDER)[number]

export function getHomepageCategoryName(slug: string): HomepagePostCategory {
  const category = POST_CATEGORY_BY_SLUG[slug as keyof typeof POST_CATEGORY_BY_SLUG]

  if (!category) {
    throw new Error(`Missing curated category for slug: ${slug}`)
  }

  return category
}

export function getHomepageCategorySelections(posts: Post[], excludedSlugs: string[]) {
  const excludedSlugSet = new Set(excludedSlugs)

  return HOMEPAGE_POST_CATEGORY_ORDER.map((category) => {
    const post = posts.find(
      (candidate) =>
        getHomepageCategoryName(candidate.slug) === category &&
        !excludedSlugSet.has(candidate.slug)
    )

    if (!post) {
      throw new Error(`No post available for homepage category: ${category}`)
    }

    return { category, post }
  })
}

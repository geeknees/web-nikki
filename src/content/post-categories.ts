// ABOUTME: Homepage topic helpers based on post frontmatter categories rather than slug-specific hardcoding.
// ABOUTME: Keeps internal-link curation aligned with the content metadata stored in each article.

export const HOMEPAGE_POST_CATEGORY_ORDER = [
  '仕事と組織',
  '教育',
  'AIとインターネット',
  'RubyKaigi',
  '個人史と暮らし'
] as const

type HomepagePostCategory = (typeof HOMEPAGE_POST_CATEGORY_ORDER)[number]

export function getHomepageCategoryName(post: Post): HomepagePostCategory {
  const category = HOMEPAGE_POST_CATEGORY_ORDER.find((candidate) =>
    post.data.categories.includes(candidate)
  )

  if (!category) {
    throw new Error(`Missing homepage category in frontmatter for slug: ${post.slug}`)
  }

  return category
}

export function getHomepageCategorySelections(posts: Post[], excludedSlugs: string[]) {
  const excludedSlugSet = new Set(excludedSlugs)

  return HOMEPAGE_POST_CATEGORY_ORDER.map((category) => {
    const post = posts.find(
      (candidate) =>
        getHomepageCategoryName(candidate) === category &&
        !excludedSlugSet.has(candidate.slug)
    )

    if (!post) {
      throw new Error(`No post available for homepage category: ${category}`)
    }

    return { category, post }
  })
}

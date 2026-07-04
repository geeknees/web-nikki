# コードベース改善ポイント

2026-07-04 時点の全体レビュー結果。対象: `src/` 全ファイル、`scripts/`、`tests/`、`.github/`、設定ファイル一式。
優先度は「壊れる・漏れるリスク」→「保守コスト」→「きれいさ」の順。

## 優先度: 高

### 1. `.private-journal/` が公開リポジトリにコミットされている

`.private-journal/2026-02-08/17-44-18-983552.md`(と `.embedding`)が git 管理下にある。
GitHub Pages 用の公開リポジトリなので、"private" と名の付くジャーナルが誰でも読める状態。

- 対応状況(2026-07-04): `.private-journal/` と `.beads/` を `.gitignore` に追加し、管理下の `.private-journal` 2ファイルを削除。`.beads/` は未追跡だったためローカル削除済み。過去コミット履歴からの除去は未実施。
- 対応: 内容を確認のうえ、`.gitignore` に `.private-journal/` を追加して `git rm --cached` する。過去の内容が機微であれば履歴からの除去も検討。
- 同様に `.beads/` もリポジトリ管理が必要か確認する。

### 2. CI がテストを一切実行せずにデプロイしている

`.github/workflows/deploy.yml` は `withastro/action@v6` でビルド → 即デプロイ。
`pnpm test`(unit / integration / e2e)は存在するのにどこからも呼ばれていない。
`getHomepageCategorySelections` のようにビルドは通るがリンク切れ等を検知するのはテスト側なので、テストを飛ばす意味がほぼない。

- 対応状況(2026-07-04): deploy 前の build job を明示ステップ化し、`pnpm test` 成功後の `dist/` を Pages artifact として upload するよう変更。workflow 契約テストも追加。
- 対応: deploy ジョブの前に `pnpm test` を実行するステップ(またはジョブ)を追加する。integration テストがビルドを兼ねているので、ビルド成果物の二重生成を避ける構成にすると効率的。

### 3. ホームページカテゴリ解決が「例外でビルド全体を落とす」設計

`src/content/post-categories.ts` の `getHomepageCategoryName` は、日本語記事が
`HOMEPAGE_POST_CATEGORY_ORDER`(5カテゴリ)のどれにも属さないと **throw** する。
`getHomepageCategorySelections` は `posts.find()` の中でこれを呼ぶため、
**5カテゴリのいずれも持たない日本語記事が1本でも存在すると、その記事に到達した時点でビルドが失敗する**。

- 現状は全記事がいずれかのカテゴリを持っているため動いているが、記事追加時の地雷。
- 対応状況(2026-07-04): 未対応カテゴリの記事はホームページ選定時にスキップするよう変更し、単体テストを追加。
- 対応: 該当カテゴリを持たない記事は throw せず単にスキップする(`find` の述語内では boolean を返す)。「ホームページに出す記事が見つからない」場合のみエラーにするのが妥当。

### 4. Twikoo が外部 CDN (`cdn.staticfile.org`) からスクリプトを直接読み込む

`src/components/Twikoo.astro` が `https://cdn.staticfile.org/twikoo/1.6.32/twikoo.all.min.js` を `is:inline` でロード。
サプライチェーン的にリスクの高い CDN で、過去に改ざん事例が報告されている(staticfile.org 系)。
現状 `theme.config.ts` でコメント機能は全て無効なので実害はないが、コードとして残っている。

- 対応状況(2026-07-04): Twikoo コンポーネントと Comments 側の Twikoo 分岐を削除。`cdn.staticfile.org` の再混入を検知する単体テストを追加。
- 対応: コメント機能を使う予定がないなら `Comments.astro` / `Giscus.astro` / `Twikoo.astro` ごと削除(下記 8 とも関連)。使うなら npm パッケージ化 or SRI 付き信頼できる CDN に変更。

## 優先度: 中(保守コスト)

### 5. 記事詳細ページの大規模な重複

`src/pages/posts/[...slug].astro` と `src/pages/[language]/posts/[...slug].astro` は
約140行のうち `getStaticPaths` 以外(レイアウト、キーワード表示、Pagination、
クリップボードコピーの `<script>`、`<style is:global>`)が完全に同一。

同様のペア重複が以下にもある:

| 日本語ルート | 多言語ルート | 重複内容 |
|---|---|---|
| `pages/archive.astro` | `pages/[language]/archive.astro` | 年別グルーピング処理とテンプレート全体 |
| `pages/categories/index.astro` | `pages/[language]/categories/index.astro` | ほぼ全体 |
| `pages/categories/[...category].astro` | `pages/[language]/categories/[...category].astro` | ほぼ全体 |
| `pages/posts/page/[page].astro` | `pages/[language]/posts/page/[page].astro` | テンプレート全体(URL 処理のみ差分) |

- 対応: `PostDetail.astro`・`ArchiveList.astro`・`CategoryList.astro`・`PostListPage.astro` のような共有コンポーネントに本体を抽出し、各ページは `getStaticPaths` + 薄いラッパーだけにする。修正が常に2ファイル必要な現状は変更漏れの温床。

### 6. ベースパス `/web-nikki` のハードコードが十数箇所に散在

`astro.config.ts` の `base: "/web-nikki"` が正であるにもかかわらず、以下で文字列を直書き:

- `src/i18n.ts` の `SITE_BASE_PATH`
- `src/theme.config.ts` の navs / socials(`/web-nikki/posts/page/1` など)
- `src/layouts/LayoutDefault.astro` の favicon・manifest・sitemap リンク(6箇所)、placeholder 画像
- `src/pages/sitemap.xml.ts` の静的エントリ
- `src/pages/atom.xml.ts` の stylesheet
- `astro.config.ts` 内の robotsTxt sitemap URL(`${website}web-nikki/sitemap.xml` という文字列連結)

- 対応: `import.meta.env.BASE_URL` を使うか、少なくとも `SITE_BASE_PATH` を単一の源として全箇所から参照する。base を変更した場合、現状では確実に壊れる。

### 7. `formatDate` の重複実装

`src/utils/index.ts:53` の `formatDate` と `src/utils/post-taxonomy.ts:4` の `formatPostDate` が同一実装。

- 対応状況(2026-07-04): `src/utils/date.ts` に `formatDate` を抽出し、`index.ts` と `post-taxonomy.ts` から共有するよう変更。
- 対応: どちらかに寄せる。`post-taxonomy.ts` を「Astro 非依存の純粋関数」に保ちたい意図があるなら、`formatDate` を `post-taxonomy.ts`(または `utils/date.ts`)に置き、`index.ts` から re-export する。

### 8. 死んでいるコード・設定

- `Comments.astro` / `Giscus.astro` / `Twikoo.astro`: `theme.config.ts` の comments が全てコメントアウトされており、常に空 div をレンダリング。
- `pages/about.astro`: `<LayoutDefault />` のみの空ページ。nav もコメントアウト済みなのに `sitemap.xml.ts` は `/web-nikki/about/` を登録している(空ページをクローラに案内している)。
- `src/i18n.ts` の `LANGUAGES['zh-tw']`: `SITE_LANGUAGES` に zh-tw がないため到達不能。
- `Pagination.astro` 末尾の40行超のコメントアウトされた旧実装。
- `theme.config.ts` の `category_map: [{ name: '胡适', path: 'hu-shi' }]`: テーマ由来のサンプルで、このブログの記事には胡适カテゴリは存在しないはず。
- 対応: 使う予定のないものは削除。about は「作る」か「sitemap から外す」かを決める。

### 9. 未使用・不整合な依存関係

- `@astrojs/sitemap`: dependencies にあるが、サイトマップは `sitemap.xml.ts` で自作しており未使用。
- `vite ^5.4.12` を直接依存に持つが、Astro 6 は内部で新しい Vite を使う。バージョン不整合の元で、直接 import している形跡もない。
- `markdown-it` / `sanitize-html` は `src/` から import されるのに devDependencies(静的ビルドなので動くが、`@astrojs/rss` 等が dependencies にあるのと分類が逆転している)。
- `package.json` の `name: "astro-theme-typography"`, `version: 0.1.0`, `repository` がテーマ元のまま。`release` スクリプト(bumpp)も個人ブログには不要そう。
- 対応: `pnpm why` で確認しつつ整理。

### 10. GA 測定 ID のハードコード

`GoogleAnalytics.astro` に `G-C536MZEKVL` が2箇所直書き。

- 対応: `theme.config.ts`(または環境変数)に `googleAnalyticsId` として持たせ、未設定なら出力しない形にする。テーマとしての再利用性と、ID 変更時の修正箇所が1つになる。

## 優先度: 低(品質・細部)

### 11. `getPosts` のソートフォールバックが不定値

`src/utils/index.ts:34` の `a.data.pubDate || new Date()`。スキーマ上 `pubDate` は必須
(`z.coerce.date()`、optional でない)なのでフォールバックは死にコードだが、もし効いた場合は
呼び出しごとに現在時刻が入りソートが非決定的になる。`archive.astro` の `post.data.pubDate ?? new Date()` も同様。

- 対応: フォールバックを削除して型どおり必須として扱う。

### 12. 型定義の緩さ (`env.d.ts`)

- `header: Object<{ twitter: String }>` — `Object<>` は TypeScript として無効なジェネリック風表記で、実質 `any` 扱い。`{ twitter: string }` にすべき。
- `translate: (key: string, ...)` — key が自由文字列なので typo しても `key` がそのまま画面に出る。`keyof typeof LANGUAGES['ja-jp']` にすれば翻訳キーの typo をコンパイル時に検出できる。

### 13. 英語 UI 文言の不自然さ

`i18n.ts` の `en-us`: `archive_count: '%d post'` / `categories_count: '%d post'`(複数形なし)、
`page_count: '%d'`(「Page 2 / 12」と表示され意味が取りにくい)、`posted_at: 'Posted at'`(日付には通常 "Posted on")。

### 14. RSS・サイトマップの多言語対応の非対称

- `atom.xml.ts` は日本語記事のみ(`getPosts()` デフォルト)。en/zh 記事はどのフィードにも載らない。意図的なら OK だが、サイトマップは全言語を載せており非対称。
- hreflang alternates に `x-default` がない(`LayoutDefault.astro` / 記事ページ)。
- 対応方針を決めて統一する(例: フィードも `en/atom.xml` を出す、または「フィードは日本語のみ」と docs に明記)。

### 15. テスト基盤

- テストランナー不在で、素の `assert` + `node --experimental-strip-types` の逐次実行。1つ目の assert 失敗で残りが実行されず、失敗箇所の特定がしにくい。Node 標準の `node:test` に載せるだけで `describe/it`・継続実行・TAP 出力が得られ、依存追加も不要。
- `tests/e2e/site-smoke.test.ts` は実体としては dist の静的 HTML 検査であり、`tests/integration` と同種。名前が実態(ブラウザ e2e)と乖離している。実ブラウザ検証が必要になるまでは `integration` に統合するか、命名を `smoke` に揃える。
- `translations.test.ts` の frontmatter 検査が正規表現ベースで壊れやすい(YAML パーサを使う方が堅い)。

### 16. スクリプトの細部

- `scripts/update-theme.sh`: shebang なし・`set -euo pipefail` なし。また上流テーマ(astro-theme-typography)とはコードが大きく分岐しており、`--allow-unrelated-histories` でのマージはコンフリクトの嵐になるはず。運用しないなら削除。
- `scripts/new-post.ts`: 生成する frontmatter がインデント付きで書き出される(テンプレートリテラルの行頭スペースがそのままファイルに入る)ため、生成直後の frontmatter が現行スキーマ(`categories` 必須、`keywords` など)と合っていない。テンプレートを現在の記事フォーマットに合わせて更新する。

### 17. その他

- `Comments.astro` の `path` は `post.id` から組み立てており、`postSlug`/小文字正規化(`getPostSlug`)を通した実 URL と一致しない可能性がある(現状コメント無効のため実害なし)。
- 記事詳細のクリップボードコピー `<script>` と `<style>` が2ページに重複(5 の共有コンポーネント化で同時に解消)。
- 翻訳運用ルール(全日本語記事に en/zh 訳が必須、`en-<stem>`/`zh-<stem>` 命名、translationKey 規約)がテストにしか書かれていない。`docs/` か AGENTS.md に明文化しておくと、テストが落ちた時に「何を直せばいいか」がすぐ分かる。

## 推奨する着手順

1. `.private-journal` の扱いを決める(公開内容の確認が先)
2. CI にテスト実行を追加
3. ホームページカテゴリの throw をスキップに変更(+ テスト)
4. ページ重複の共有コンポーネント化
5. ベースパスの一元化
6. 死にコード・未使用依存の削除

1〜3 は小さく独立しているので即日可能。4〜5 は出力 HTML が変わらないことを
`pnpm test`(integration の HTML アサーション)で担保しながら進められる。

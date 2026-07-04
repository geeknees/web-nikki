# web-nikki

个人博客，发布地址：<https://geeknees.github.io/web-nikki/>。

这个仓库是一个 Astro 静态站点，用于发布日文文章及其英文、中文翻译。它最初来自 `astro-theme-typography`，但现在按本站需求独立维护，不再作为通用主题使用。

## 技术栈

- Astro 7、TypeScript、UnoCSS
- Astro content collections 管理文章
- GitHub Pages 部署
- Atom feed 和自定义 sitemap route
- 日文页面在根路径，英文和中文页面分别在 `/en` 和 `/zh`

## 开发

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

运行验证：

```bash
pnpm test
```

部署 workflow 会在上传 GitHub Pages artifact 前运行 `pnpm test`。

## 内容

日文文章放在 `src/content/posts/`。

英文和中文翻译放在：

- `src/content/posts/en/`
- `src/content/posts/zh/`

翻译文件名遵循以下规则：

- 日文：`src/content/posts/<stem>.md`
- 英文：`src/content/posts/en/en-<stem>.md`
- 中文：`src/content/posts/zh/zh-<stem>.md`

同一篇文章的三种语言版本应使用相同的 `translationKey`。内容 schema 还要求提供 `language`、`categories`、`keywords`、`pubDate`、`title` 和 `description`。

创建新文章草稿：

```bash
pnpm new-post
```

## 配置

站点配置在 `src/theme.config.ts`。

路径和语言相关 helper 在 `src/i18n.ts`。唯一的 base path 来源是 `SITE_BASE_PATH`，当前为 `/web-nikki`；不要在组件或 route 中重复硬编码。

Google Analytics 由 `src/theme.config.ts` 中的 `googleAnalyticsId` 控制。未设置时不会输出 tracking scripts。

评论功能目前故意不启用。旧的 Disqus/Giscus/Twikoo 主题代码已删除，以减少未使用依赖和外部脚本风险。

## 部署

`.github/workflows/deploy.yml` 中的 GitHub Actions workflow 会：

1. 使用 pnpm 安装依赖。
2. 运行完整测试。
3. 将 `dist/` 上传为 GitHub Pages artifact。
4. 部署经过测试的 artifact。

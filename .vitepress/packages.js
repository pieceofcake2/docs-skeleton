/**
 * Repositories of the pieceofcake2 organization that have a documentation
 * site, grouped like the "Maintained Plugins" page of the book
 * (docs/en/plugins/maintained-plugins.md in pieceofcake2/docs).
 *
 * This is the single list behind the "Plugins" menu of the header (book-nav.js)
 * and the package list of the top page (pieceofcake2/pieceofcake2.github.io),
 * which imports this file from the skeleton cloned at build time.
 *
 * - repo:     GitHub repository name (https://github.com/pieceofcake2/<repo>)
 * - package:  Composer package name (the "name" in the repository's composer.json)
 * - branch:   default branch of the repository, for links to the Markdown of
 *             the documentation on GitHub
 * - docs:     documentation site; defaults to https://pieceofcake2.github.io/<repo>/
 * - markdown: Markdown of the documentation home page on GitHub; defaults to
 *             docs/README.md of the repository
 * - en / ja:  short description
 * - plugin:   false for repositories that are not plugins (the framework and
 *             the application skeleton); they are left out of the "Plugins"
 *             menu but stay in the package list and the sitemap index
 *
 * Groups have either `items` or `categories` (each with `items`).
 */

export const groups = [
  {
    id: "core",
    en: "Core repositories",
    ja: "コアリポジトリ",
    items: [
      {
        repo: "cakephp",
        package: "pieceofcake2/cakephp",
        branch: "2.x",
        docs: "https://pieceofcake2.github.io/docs/",
        markdown: "https://github.com/pieceofcake2/docs/blob/2.x/docs/en/index.md",
        en: "The CakePHP 2.x framework",
        ja: "CakePHP 2.x フレームワーク",
        plugin: false,
      },
      {
        repo: "app",
        package: "pieceofcake2/app",
        branch: "2.x",
        en: "Application skeleton with the modern directory layout",
        ja: "モダンなディレクトリ構成のアプリケーションスケルトン",
        plugin: false,
      },
      {
        repo: "bake",
        package: "pieceofcake2/bake",
        branch: "1.x",
        en: "Code generation tool",
        ja: "コード生成ツール",
      },
      {
        repo: "upgrade",
        package: "pieceofcake2/upgrade",
        branch: "1.x",
        en: "Upgrade utility (CakePHP 1.3 to 2.0)",
        ja: "アップグレード用ユーティリティ（CakePHP 1.3 から 2.0）",
      },
    ],
  },
  {
    id: "tools",
    en: "Development tools",
    ja: "開発ツール",
    items: [
      {
        repo: "phpstan-cakephp2",
        package: "pieceofcake2/phpstan-cakephp2",
        branch: "main",
        en: "PHPStan extension for static analysis",
        ja: "静的解析用の PHPStan 拡張",
      },
      {
        repo: "phpcs-cakephp2",
        package: "pieceofcake2/phpcs-cakephp2",
        branch: "main",
        en: "PHP_CodeSniffer standard for CakePHP 2",
        ja: "CakePHP 2 用の PHP_CodeSniffer 規約",
      },
      {
        repo: "panther",
        package: "pieceofcake2/panther",
        branch: "1.x",
        en: "End-to-End tests with Symfony Panther",
        ja: "Symfony Panther による End-to-End テスト",
      },
    ],
  },
  {
    id: "plugins",
    en: "Plugins",
    ja: "プラグイン",
    categories: [
      {
        en: "Debugging",
        ja: "デバッグ",
        items: [
          { repo: "debug_kit", package: "pieceofcake2/debug_kit", branch: "2.x", en: "Debug toolbar", ja: "デバッグツールバー" },
        ],
      },
      {
        en: "Infrastructure",
        ja: "インフラ",
        items: [
          { repo: "aws", package: "pieceofcake2/aws", branch: "1.x", en: "AWS SDK integration", ja: "AWS SDK との連携" },
          { repo: "async-aws", package: "pieceofcake2/async-aws", branch: "1.x", en: "AsyncAws integration", ja: "AsyncAws との連携" },
        ],
      },
      {
        en: "Logging & Monitoring",
        ja: "ログとモニタリング",
        items: [
          { repo: "monolog", package: "pieceofcake2/monolog", branch: "2.x", en: "Monolog integration", ja: "Monolog との連携" },
          { repo: "sentry", package: "pieceofcake2/sentry", branch: "1.x", en: "Error tracking and monitoring", ja: "エラーの追跡とモニタリング" },
        ],
      },
      {
        en: "Templating",
        ja: "テンプレート",
        items: [
          { repo: "twig-view", package: "pieceofcake2/twig-view", branch: "2.x", en: "Twig template engine", ja: "Twig テンプレートエンジン" },
          { repo: "csv-view", package: "pieceofcake2/csv-view", branch: "2.x", en: "CSV view class", ja: "CSV 用のビュークラス" },
        ],
      },
      {
        en: "View Helpers",
        ja: "ビューヘルパー",
        items: [
          { repo: "markdown", package: "pieceofcake2/markdown", branch: "2.x", en: "Markdown helper", ja: "Markdown ヘルパー" },
          { repo: "menu_builder", package: "pieceofcake2/menu_builder", branch: "2.x", en: "Navigation menu helper", ja: "ナビゲーションメニューのヘルパー" },
          { repo: "vite", package: "pieceofcake2/vite", branch: "1.x", en: "Vite asset helper with dev server support", ja: "開発サーバーにも対応した Vite のアセットヘルパー" },
          { repo: "webpack-encore", package: "pieceofcake2/webpack-encore", branch: "1.x", en: "Webpack Encore asset helper", ja: "Webpack Encore のアセットヘルパー" },
        ],
      },
      {
        en: "Forms & Validation",
        ja: "フォームとバリデーション",
        items: [
          { repo: "xform", package: "pieceofcake2/xform", branch: "2.x", en: "Extended form helper", ja: "拡張フォームヘルパー" },
          { repo: "cakeplus", package: "pieceofcake2/cakeplus", branch: "2.x", en: "Form utilities and enhancements", ja: "フォーム関連のユーティリティと機能拡張" },
          {
            repo: "captcha",
            package: "pieceofcake2/captcha",
            branch: "1.x",
            en: "CAPTCHA widget and server-side verification with Cloudflare Turnstile, Google reCAPTCHA v2/v3 or hCaptcha",
            ja: "CAPTCHA ウィジェットの表示とサーバー側での検証。Cloudflare Turnstile、Google reCAPTCHA v2/v3、hCaptcha に対応",
          },
        ],
      },
      {
        en: "Database",
        ja: "データベース",
        items: [
          { repo: "datasources", package: "pieceofcake2/datasources", branch: "2.x", en: "Additional datasources (CSV / TSV files, arrays and more)", ja: "追加のデータソース（CSV / TSV ファイル、配列など）" },
        ],
      },
      {
        en: "Authentication and Authorization",
        ja: "認証と認可",
        items: [
          { repo: "authenticate", package: "pieceofcake2/authenticate", branch: "1.x", en: "Authentication classes", ja: "認証クラス" },
          { repo: "acl_extras", package: "pieceofcake2/acl_extras", branch: "2.x", en: "Console tools for managing ACL tables", ja: "ACL テーブルを管理するコンソールツール" },
        ],
      },
      {
        en: "Files",
        ja: "ファイル",
        items: [
          { repo: "upload", package: "pieceofcake2/upload", branch: "2.x", en: "File upload handling", ja: "ファイルアップロードの処理" },
          { repo: "imagine", package: "pieceofcake2/imagine", branch: "1.x", en: "Image processing library wrapper", ja: "画像処理ライブラリのラッパー" },
          { repo: "cakepdf", package: "pieceofcake2/cakepdf", branch: "1.x", en: "PDF generation", ja: "PDF の生成" },
        ],
      },
      {
        en: "SEO",
        ja: "SEO",
        items: [
          { repo: "seo", package: "pieceofcake2/seo", branch: "6.x", en: "Search engine optimization", ja: "検索エンジン最適化" },
          { repo: "sitemap", package: "pieceofcake2/sitemap", branch: "1.x", en: "Sitemap generation", ja: "サイトマップの生成" },
        ],
      },
      {
        en: "I18n",
        ja: "国際化",
        items: [
          { repo: "localized", package: "pieceofcake2/localized", branch: "2.x", en: "Localization utilities", ja: "ローカライズ用のユーティリティ" },
        ],
      },
    ],
  },
];

export const docsUrl = (item) => item.docs ?? `https://pieceofcake2.github.io/${item.repo}/`;
export const githubUrl = (item) => `https://github.com/pieceofcake2/${item.repo}`;
export const packagistUrl = (item) => `https://packagist.org/packages/${item.package}`;
export const badgeUrl = (item) => `https://img.shields.io/packagist/v/${item.package}?label=Packagist&color=d33c43`;
export const markdownUrl = (item) => item.markdown ?? `https://github.com/pieceofcake2/${item.repo}/blob/${item.branch}/docs/README.md`;

/**
 * The package list as Markdown, for the Markdown version of the top page and
 * its llms.txt: every package with its documentation site, the Markdown of the
 * documentation on GitHub and the llms.txt of the site.
 *
 * @param {string} lang 'en' or 'ja'
 * @param {object} [options]
 * @param {number} [options.level] Heading level of the groups
 * @returns {string}
 */
export function packageListMarkdown(lang = "en", { level = 3 } = {}) {
  const t = (entry) => entry[lang] ?? entry.en;
  const hashes = "#".repeat(level);

  return groups.map((group) => {
    const categories = group.categories ?? [{ items: group.items }];
    const lists = categories.map((category) => {
      const items = category.items.map((item) => {
        const site = docsUrl(item);

        return `- [${item.package}](${site}) - ${t(item)} ([Markdown](${markdownUrl(item)}), [llms.txt](${site}llms.txt))`;
      });

      return [category.en ? `${hashes}# ${t(category)}` : "", items.join("\n")].filter(Boolean).join("\n\n");
    });

    return [`${hashes} ${t(group)}`, ...lists].join("\n\n");
  }).join("\n\n");
}

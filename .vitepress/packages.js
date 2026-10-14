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
 * - docs:     documentation site; defaults to https://pieceofcake2.github.io/<repo>/
 * - en / ja:  short description
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
        docs: "https://pieceofcake2.github.io/docs/",
        en: "The CakePHP 2.x framework",
        ja: "CakePHP 2.x フレームワーク",
      },
      {
        repo: "app",
        package: "pieceofcake2/app",
        en: "Application skeleton with the modern directory layout",
        ja: "モダンなディレクトリ構成のアプリケーションスケルトン",
      },
      {
        repo: "bake",
        package: "pieceofcake2/bake",
        en: "Code generation tool",
        ja: "コード生成ツール",
      },
      {
        repo: "upgrade",
        package: "pieceofcake2/upgrade",
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
        en: "PHPStan extension for static analysis",
        ja: "静的解析用の PHPStan 拡張",
      },
      {
        repo: "e2e-test",
        package: "pieceofcake2/e2e-test",
        en: "Browser end-to-end tests with PHPUnit and Symfony Panther (Chrome, PC and mobile)",
        ja: "PHPUnit と Symfony Panther によるブラウザでの E2E テスト（Chrome、PC とスマートフォン）",
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
          { repo: "debug_kit", package: "pieceofcake2/debug_kit", en: "Debug toolbar", ja: "デバッグツールバー" },
        ],
      },
      {
        en: "Infrastructure",
        ja: "インフラ",
        items: [
          { repo: "aws", package: "pieceofcake2/aws", en: "AWS SDK integration", ja: "AWS SDK との連携" },
        ],
      },
      {
        en: "Logging & Monitoring",
        ja: "ログとモニタリング",
        items: [
          { repo: "monolog", package: "pieceofcake2/monolog", en: "Monolog integration", ja: "Monolog との連携" },
          { repo: "sentry", package: "pieceofcake2/sentry", en: "Error tracking and monitoring", ja: "エラーの追跡とモニタリング" },
        ],
      },
      {
        en: "Templating",
        ja: "テンプレート",
        items: [
          { repo: "twig-view", package: "pieceofcake2/twig-view", en: "Twig template engine", ja: "Twig テンプレートエンジン" },
          { repo: "csv-view", package: "pieceofcake2/csv-view", en: "CSV view class", ja: "CSV 用のビュークラス" },
        ],
      },
      {
        en: "View Helpers",
        ja: "ビューヘルパー",
        items: [
          { repo: "markdown", package: "pieceofcake2/markdown", en: "Markdown helper", ja: "Markdown ヘルパー" },
          { repo: "menu_builder", package: "pieceofcake2/menu_builder", en: "Navigation menu helper", ja: "ナビゲーションメニューのヘルパー" },
          { repo: "vite", package: "pieceofcake2/vite", en: "Vite asset helper with dev server support", ja: "開発サーバーにも対応した Vite のアセットヘルパー" },
          { repo: "webpack-encore", package: "pieceofcake2/webpack-encore", en: "Webpack Encore asset helper", ja: "Webpack Encore のアセットヘルパー" },
        ],
      },
      {
        en: "Forms & Validation",
        ja: "フォームとバリデーション",
        items: [
          { repo: "xform", package: "pieceofcake2/xform", en: "Extended form helper", ja: "拡張フォームヘルパー" },
          { repo: "cakeplus", package: "pieceofcake2/cakeplus", en: "Form utilities and enhancements", ja: "フォーム関連のユーティリティと機能拡張" },
          {
            repo: "captcha",
            package: "pieceofcake2/captcha",
            en: "CAPTCHA widget and server-side verification with Cloudflare Turnstile, Google reCAPTCHA v2/v3 or hCaptcha",
            ja: "CAPTCHA ウィジェットの表示とサーバー側での検証。Cloudflare Turnstile、Google reCAPTCHA v2/v3、hCaptcha に対応",
          },
        ],
      },
      {
        en: "Database",
        ja: "データベース",
        items: [
          { repo: "datasources", package: "pieceofcake2/datasources", en: "Additional datasources (CSV / TSV files, arrays and more)", ja: "追加のデータソース（CSV / TSV ファイル、配列など）" },
        ],
      },
      {
        en: "Authentication and Authorization",
        ja: "認証と認可",
        items: [
          { repo: "authenticate", package: "pieceofcake2/authenticate", en: "Authentication classes", ja: "認証クラス" },
          { repo: "acl_extras", package: "pieceofcake2/acl_extras", en: "Console tools for managing ACL tables", ja: "ACL テーブルを管理するコンソールツール" },
        ],
      },
      {
        en: "Files",
        ja: "ファイル",
        items: [
          { repo: "upload", package: "pieceofcake2/upload", en: "File upload handling", ja: "ファイルアップロードの処理" },
          { repo: "imagine", package: "pieceofcake2/imagine", en: "Image processing library wrapper", ja: "画像処理ライブラリのラッパー" },
          { repo: "cakepdf", package: "pieceofcake2/cakepdf", en: "PDF generation", ja: "PDF の生成" },
        ],
      },
      {
        en: "SEO",
        ja: "SEO",
        items: [
          { repo: "seo", package: "pieceofcake2/seo", en: "Search engine optimization", ja: "検索エンジン最適化" },
          { repo: "sitemap", package: "pieceofcake2/sitemap", en: "Sitemap generation", ja: "サイトマップの生成" },
        ],
      },
      {
        en: "I18n",
        ja: "国際化",
        items: [
          { repo: "localized", package: "pieceofcake2/localized", en: "Localization utilities", ja: "ローカライズ用のユーティリティ" },
        ],
      },
    ],
  },
];

export const docsUrl = (item) => item.docs ?? `https://pieceofcake2.github.io/${item.repo}/`;
export const githubUrl = (item) => `https://github.com/pieceofcake2/${item.repo}`;
export const packagistUrl = (item) => `https://packagist.org/packages/${item.package}`;
export const badgeUrl = (item) => `https://img.shields.io/packagist/v/${item.package}?label=Packagist&color=d33c43`;

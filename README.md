# pieceofcake2/docs-skeleton

A [VitePress](https://vitepress.dev/) based documentation skeleton for the
documentation of [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp),
a community fork of CakePHP 2.x, and its plugins.

This is a fork of [cakephp/docs-skeleton](https://github.com/cakephp/docs-skeleton)
with the following changes:

- Piece of Cake 2 logo, favicons and footer
- Analytics (Simple Analytics, Google Analytics) removed
- `::: pieceofcake2` container to mark content specific to the pieceofcake2 forks
- Markdown version of every page, `llms.txt` and `llms-full.txt` for AI tools

```md
::: pieceofcake2
pieceofcake2/cakephp requires PHP 8.0 or newer.
:::
```

This project is not affiliated with or endorsed by the Cake Software Foundation.

## Features

- 🎨 CakePHP branded theme and styling
- ⚙️ Easy configuration overrides

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run docs:dev
```

The documentation will be available at `http://localhost:5173`

### Building for Production

Build the static site:

```bash
npm run docs:build
```

Preview the production build:

```bash
npm run docs:preview
```

## Configuration

### Default Configuration

The default VitePress configuration is located in `.vitepress/config.js`. This file contains all the base settings for your documentation site.

For detailed information about VitePress configuration options, please refer to the [VitePress Configuration Reference](https://vitepress.dev/reference/site-config).

### Custom Overrides

To customize the configuration without modifying the core files:

1. Copy `config.default.js` to `config.js` in the project root
2. Add your configuration overrides to the exported object
3. Your overrides will be deep merged with the default configuration

**Example** (`config.js`):

```javascript
export default {
  title: 'My Plugin Documentation',
  themeConfig: {
    sidebar: {
      '/': [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide' }
      ]
    }
  }
}
```

### Version Banner

You can display an e.g. "Outdated Version" banner on your documentation site by adding the following configuration:

```javascript
export default {
  themeConfig: {
    versionBanner: {
      message: 'You are viewing an older version of this documentation.',
      link: '/latest/',
      linkText: 'Go to latest docs.'
    }
  }
}
```

### Book Navigation

The header menu of the CakePHP 2 book is defined in `.vitepress/book-nav.js`,
so the book, the plugin documentation sites and the top page
(https://pieceofcake2.github.io/) show the same menu: Home (the top page), the
book, and a "Plugins" dropdown that links the documentation site of every
package. `config.js` can export a function instead of an object; it receives
the helpers `bookNav()` and `bookUrl`:

```javascript
export default ({ bookNav }) => ({
  themeConfig: {
    nav: bookNav(),                      // book pages linked relative to the site
    // nav: bookNav({ locale: 'ja' }),   // Japanese labels and /ja/ pages
    // nav: bookNav({ absolute: true }), // absolute URLs, for other sites
    // nav: bookNav({ absolute: true, current: 'debug_kit' }), // on a plugin site
  },
})
```

The packages of the "Plugins" dropdown come from `.vitepress/packages.js`, which
the top page also uses for its package list. When a repository is added, add it
there and to the book's
[Maintained Plugins](https://pieceofcake2.github.io/docs/plugins/maintained-plugins.html)
page.

## Plugin Documentation Sites

Plugins publish the Markdown in their `docs/` folder to GitHub Pages at
`https://pieceofcake2.github.io/<repo>/`, with the look and header menu of the
book. The reusable workflow `.github/workflows/plugin-docs.yml` builds the site
with `config.plugin.js` and deploys it. A plugin adds `.github/workflows/docs.yml`:

```yaml
name: Docs

on:
  push:
    branches:
      - '2.x' # the default branch
    paths:
      - 'docs/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  docs:
    if: github.repository_owner == 'pieceofcake2'
    uses: pieceofcake2/docs-skeleton/.github/workflows/plugin-docs.yml@main
```

and sets **Settings > Pages > Source** to **GitHub Actions**.

The site needs no configuration in the plugin:

- `docs/README.md` is the home page. Other Markdown files in `docs/` are
  further pages (`docs/foo/README.md` is served as `foo/`).
- The title and description come from `composer.json` (`name`, `description`).
- The sidebar lists the pages and their `##` headings. A page's title is its
  `#` heading (or `title` in its front matter).
- Images (e.g. `docs/img/`) are bundled. Links to other files (e.g.
  `examples/router.php`) and out of `docs/` (e.g. `../LICENSE`) point to the
  file on GitHub, so the Markdown works both on GitHub and on the site.
- Heading anchors are the same as on GitHub, so `[Setup](#setup)` links work.
- `{{ ... }}` is shown as text, not evaluated by Vue.

### Several Pages

A plugin with long documentation can split it into pages. `docs/README.md`
stays the overview (introduction, installation, quick start) and links every
page; the links are the table of contents on GitHub and set the order of the
sidebar:

```
docs/
├── README.md          # the home page: overview and list of pages
├── configuration.md
├── session.md
└── cache.md
```

```md
# Foo Documentation

Foo does ...

- [Installation](#installation)
- [Configuration](configuration.md)
- [Session Handler](session.md)
- [Cache Engine](cache.md)

## Installation
...
```

- Each page starts with a `#` heading, its title in the sidebar.
- The sidebar shows the home page first, then the pages in the order
  `docs/README.md` first links them, then pages it doesn't link, by path. With
  more than one page, the sidebar groups are collapsible and only the group of
  the current page is expanded.
- Link pages by their Markdown file, e.g. `[Cache Engine](cache.md#settings)`
  or `[Installation](README.md#installation)`. GitHub shows the `.md` files and
  the site turns the links into links to its pages.
- Moving a section to another page keeps old links working on the site: a link
  to a heading anchor that is not on the page, e.g. `/foo/#cache-engine` after
  the section moved to `cache.md`, is forwarded to the page that has that
  heading (`/foo/cache.html#cache-engine`). Links on GitHub to
  `docs/README.md#cache-engine` are not forwarded, so update them.
- Every page gets its `.md` next to its `.html`, and `llms.txt` and
  `llms-full.txt` list all pages in the order of the sidebar (see
  [Markdown for AI Tools](#markdown-for-ai-tools)).

To build a plugin's site locally:

```bash
rsync -a ../debug_kit/docs/ docs/
cp config.plugin.js config.js
DOCS_REPOSITORY=pieceofcake2/debug_kit DOCS_BRANCH=2.x DOCS_SOURCE=../debug_kit npm run docs:build
npm run docs:preview
```

## Markdown for AI Tools

Every site built with the skeleton (the book, the plugin documentation sites
and the top page) also publishes its pages as Markdown, so that AI tools can
read them without parsing HTML. `.vitepress/markdown-output.js` writes the
files in the `buildEnd` hook; it needs no extra dependency.

| File | URL (book) | URL (plugin site) |
| --- | --- | --- |
| Markdown of a page, next to its `.html` | `/docs/installation.md` | `/<repo>/configuration.md` |
| Markdown of a directory page (`.../`) | `/docs/index.md`, `/docs/security/index.md` | `/<repo>/index.md` |
| Index of the pages ([llms.txt](https://llmstxt.org/)) | `/docs/llms.txt`, `/docs/ja/llms.txt` | `/<repo>/llms.txt` |
| All pages in one file | `/docs/llms-full.txt`, `/docs/ja/llms-full.txt` | `/<repo>/llms-full.txt` |

- Each locale gets its own `llms.txt` and `llms-full.txt` at its root (the
  book: English at `/docs/`, Japanese at `/docs/ja/`). `llms.txt` lists the
  pages grouped like the sidebar; pages that are not in the sidebar follow
  under "Other pages".
- The Markdown is the source of the page with the front matter removed,
  `<!--@include: ...-->` and text substitutions resolved, and Vue `<script>`
  and `<style>` blocks removed. Links are made absolute: links to pages point
  to their `.md` URL, and links to other files of the repository (examples,
  `../LICENSE`, images) point to the file on GitHub.
- Every page has `<link rel="alternate" type="text/markdown">` in its head and
  "Markdown" and "Source" links (ja: 「Markdown」「ソース」) in the doc footer,
  on the same row as "Edit this page on GitHub". The Source link points to the
  page on GitHub and is derived from `themeConfig.editLink.pattern`.
- A page is left out when its front matter has `llms: false`, or when it only
  redirects to another page (`http-equiv: refresh` in `head`).
- `config.js` can set `markdownOutput: false` to turn this off, or pass
  `markdownOutput: { transform(content, { route, locale }), llmsTxt(locale) }`
  to change the Markdown of a page or append Markdown to `llms.txt`. The top
  page uses them to replace its `<PackageList>` component with
  `packageListMarkdown()` (passed to a `config.js` function, like `bookNav`),
  which also lists the `llms.txt` of every documentation site.

## Writing Documentation

### Content Location

All markdown documentation files should be placed in the `docs/` directory.

### Text Substitutions

You can use placeholders in your markdown files that will be automatically replaced with configured values. This is useful for version numbers or other values that need to be updated across multiple files.

**Configuration** (`config.js`):

```javascript
export default {
  substitutions: {
    '|phpversion|': { value: '8.4', format: 'bold' },
    '|minphpversion|': { value: '8.1', format: 'italic' },
    '|myversion|': '1.0.0'  // Simple string without formatting
  }
}
```

**Usage in Markdown**:

```markdown
This plugin requires PHP |phpversion| or higher (minimum |minphpversion|).
```

**Result**: This plugin requires PHP **8.4** or higher (minimum *8.1*).

## Project Structure

```
.
├── .vitepress/           # VitePress configuration
│   ├── config.js         # Main VitePress config (defaults)
│   ├── book-nav.js       # Header menu of the book, shared with plugin sites
│   ├── packages.js       # Packages of the "Plugins" menu and the top page
│   ├── utils.js          # Utility functions
│   ├── markdown-output.js # Markdown version of the pages, llms.txt (buildEnd)
│   ├── theme/            # Custom theme components
│   └── plugins/          # Markdown-it plugins
├── docs/                 # Documentation content (markdown files)
├── config.js             # Your configuration overrides (create from config.default.js)
├── config.default.js     # Template for configuration overrides
└── config.plugin.js      # Configuration overrides for plugin documentation sites
```

## Linting

Lint your configuration and scripts:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

## Origin

This package is a maintained fork of
[cakephp/docs-skeleton](https://github.com/cakephp/docs-skeleton) (not published on Packagist, last
upstream commit [`f256691`](https://github.com/cakephp/docs-skeleton/commit/f256691) on `main`),
originally by the CakePHP community (Cake Software Foundation, Inc.). It is maintained for CakePHP 2
on modern PHP by [pieceofcake2](https://github.com/pieceofcake2). Changes from the original are
listed in the
[commit history since the fork](https://github.com/pieceofcake2/docs-skeleton/compare/f256691...main).

## License

Licensed under The MIT License. For full copyright and license information, please see the [LICENSE](LICENSE) file.

## About CakePHP

CakePHP is a rapid development framework for PHP which uses commonly known design patterns like Associative Data Mapping, Front Controller, and MVC. Learn more at [https://cakephp.org](https://cakephp.org)

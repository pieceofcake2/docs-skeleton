# pieceofcake2/docs-skeleton

A [VitePress](https://vitepress.dev/) based documentation skeleton for the
documentation of [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp),
a community fork of CakePHP 2.x, and its plugins.

This is a fork of [cakephp/docs-skeleton](https://github.com/cakephp/docs-skeleton)
with the following changes:

- Piece of Cake 2 logo, favicons and footer
- Analytics (Simple Analytics, Google Analytics) removed
- `::: pieceofcake2` container to mark content specific to the pieceofcake2 forks

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
- The sidebar lists the pages (the home page first) and their `##` headings.
- Images (e.g. `docs/img/`) are bundled. Links to other files (e.g.
  `examples/router.php`) and out of `docs/` (e.g. `../LICENSE`) point to the
  file on GitHub, so the Markdown works both on GitHub and on the site.
- Heading anchors are the same as on GitHub, so `[Setup](#setup)` links work.
- `{{ ... }}` is shown as text, not evaluated by Vue.

To build a plugin's site locally:

```bash
rsync -a ../debug_kit/docs/ docs/
cp config.plugin.js config.js
DOCS_REPOSITORY=pieceofcake2/debug_kit DOCS_BRANCH=2.x DOCS_SOURCE=../debug_kit npm run docs:build
npm run docs:preview
```

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

## License

Licensed under The MIT License. For full copyright and license information, please see the [LICENSE](LICENSE) file.

## About CakePHP

CakePHP is a rapid development framework for PHP which uses commonly known design patterns like Associative Data Mapping, Front Controller, and MVC. Learn more at [https://cakephp.org](https://cakephp.org)

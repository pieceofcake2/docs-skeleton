/**
 * Header navigation of the CakePHP 2 book (pieceofcake2/docs).
 *
 * The book, the plugin documentation sites and the top page share this
 * definition, so the header menu is the same on every site.
 */
import { groups, docsUrl } from './packages.js'

export const siteUrl = 'https://pieceofcake2.github.io/'
export const bookUrl = `${siteUrl}docs/`

const links = (label) => ({
  text: 'Links',
  items: [
    { text: 'pieceofcake2/cakephp', link: 'https://github.com/pieceofcake2/cakephp' },
    { text: 'Packagist', link: 'https://packagist.org/packages/pieceofcake2/cakephp' },
    { text: label.api, link: 'https://api.cakephp.org/2.10/' },
    { text: 'CakePHP 5.x (official)', link: 'https://book.cakephp.org/5/en/' },
  ],
})

const labels = {
  root: { home: 'Home', gettingStarted: 'Getting Started', documentation: 'Documentation', plugins: 'Plugins', api: 'CakePHP 2.10 API (original)' },
  ja: { home: 'ホーム', gettingStarted: 'はじめに', documentation: 'ドキュメント', plugins: 'プラグイン', api: 'CakePHP 2.10 API (オリジナル)' },
}

/**
 * A page of another site under https://pieceofcake2.github.io/: it opens in
 * the same tab without the external link icon, like a page of the same site.
 */
const sameOrigin = (link) => ({ link, target: '_self', noIcon: true })

/**
 * Menu groups of the "Plugins" dropdown: the core repositories, the
 * development tools and one group per plugin category.
 */
function pluginGroups({ locale, current }) {
  const lang = locale === 'root' ? 'en' : locale
  const prefix = locale === 'root' ? '' : `${locale}/`

  // Menu labels drop the vendor prefix (every package is pieceofcake2/*).
  const shortName = (item) => item.package.replace(/^[^/]+\//, '')

  const entry = (item) => {
    if (item.repo === current) {
      // This site: a link within it, highlighted on every page.
      return { text: shortName(item), link: '/', activeMatch: '^/' }
    }

    const url = docsUrl(item)

    return { text: shortName(item), ...sameOrigin(url === bookUrl ? `${bookUrl}${prefix}` : url) }
  }

  return groups
    .flatMap((group) => group.categories ?? [group])
    .map((group) => ({ text: group[lang] ?? group.en, items: group.items.map(entry) }))
}

/**
 * @param {object} [options]
 * @param {string} [options.locale] Book locale ('root' for English, 'ja').
 * @param {boolean} [options.absolute] Link the book pages with absolute URLs
 *   (for sites other than the book). They open in the same tab without the
 *   external link icon, so the menu looks the same as in the book.
 * @param {string} [options.current] The site the menu is shown on, if it is
 *   not the book: the repository name of a plugin site (its entry of the
 *   "Plugins" menu links within the site and is highlighted) or 'home' for the
 *   top page.
 */
export function bookNav({ locale = 'root', absolute = false, current = undefined } = {}) {
  const label = labels[locale] || labels.root
  const prefix = locale === 'root' ? '' : `${locale}/`

  const page = (path) => {
    if (!absolute) {
      return { link: `/${prefix}${path}` }
    }

    return sameOrigin(`${bookUrl}${prefix}${path ? `${path}.html` : ''}`)
  }

  const home = current === 'home' ? { link: `/${prefix}` } : sameOrigin(`${siteUrl}${prefix}`)
  const plugins = pluginGroups({ locale, current })
  const onPluginSite = plugins.some((group) => group.items.some((item) => item.activeMatch))

  return [
    { text: label.home, ...home },
    { text: label.gettingStarted, ...page('getting-started') },
    { text: label.documentation, ...page('') },
    { text: label.plugins, ...(onPluginSite ? { activeMatch: '^/' } : {}), items: plugins },
    links(label),
  ]
}

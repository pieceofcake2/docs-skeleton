/**
 * Header navigation of the CakePHP 2 book (pieceofcake2/docs).
 *
 * The book and the plugin documentation sites share this definition, so the
 * header menu is the same on the book and on every plugin site.
 */

export const bookUrl = 'https://pieceofcake2.github.io/docs/'

const links = {
  text: 'Links',
  items: [
    { text: 'pieceofcake2/cakephp', link: 'https://github.com/pieceofcake2/cakephp' },
    { text: 'Packagist', link: 'https://packagist.org/packages/pieceofcake2/cakephp' },
    { text: 'CakePHP 5.x (official)', link: 'https://book.cakephp.org/5/en/' },
  ],
}

const labels = {
  root: { gettingStarted: 'Getting Started', documentation: 'Documentation' },
  ja: { gettingStarted: 'はじめに', documentation: 'ドキュメント' },
}

/**
 * @param {object} [options]
 * @param {string} [options.locale] Book locale ('root' for English, 'ja').
 * @param {boolean} [options.absolute] Link the book pages with absolute URLs
 *   (for sites other than the book). They open in the same tab without the
 *   external link icon, so the menu looks the same as in the book.
 */
export function bookNav({ locale = 'root', absolute = false } = {}) {
  const label = labels[locale] || labels.root
  const prefix = locale === 'root' ? '' : `${locale}/`

  const page = (path) => {
    if (!absolute) {
      return { link: `/${prefix}${path}` }
    }

    return {
      link: `${bookUrl}${prefix}${path ? `${path}.html` : ''}`,
      target: '_self',
      noIcon: true,
    }
  }

  return [
    { text: 'Piece of Cake 2', ...page('pieceofcake2') },
    { text: label.gettingStarted, ...page('getting-started') },
    { text: 'API', link: 'https://api.cakephp.org/2.10/' },
    { text: label.documentation, ...page('') },
    { ...links, items: links.items.map((item) => ({ ...item })) },
  ]
}

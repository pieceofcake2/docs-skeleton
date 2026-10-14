import { posix } from 'path'

const schemeRE = /^[a-z][a-z0-9+.-]*:/i

/**
 * Rewrites relative links in pages built from a repository's `docs/` folder,
 * so the same Markdown works on GitHub and on the documentation site:
 *
 * - `README.md` pages are served as `index.html`, so links to them point to
 *   `index.md` instead.
 * - Links to files that are not pages (e.g. `examples/router.php`) and links
 *   out of `docs/` (e.g. `../LICENSE`) point to the file on GitHub.
 *
 * Images are not links, so Vite still bundles them from `docs/img/`.
 *
 * @param {object} md markdown-it instance
 * @param {object} options
 * @param {string} options.repository owner/repo
 * @param {string} options.branch Branch the docs are built from
 * @param {string[]} options.pages Markdown files of the site, relative to its source directory
 */
export function sourceLinks(md, { repository, branch, pages }) {
  const blobUrl = (path) => encodeURI(`https://github.com/${repository}/blob/${branch}/${path}`)

  const isPage = (target) => {
    if (target.endsWith('.md') || target.endsWith('.html')) {
      return true
    }

    // A directory link is a page when the directory has README.md or index.md
    const dir = target === '.' ? '' : `${target.replace(/\/$/, '')}/`

    return pages.includes(`${dir}README.md`) || pages.includes(`${dir}index.md`)
  }

  const rewrite = (href, page) => {
    if (href.startsWith('#') || href.startsWith('/') || schemeRE.test(href)) {
      return href
    }

    const [, path, suffix] = href.match(/^([^?#]*)(.*)$/)
    if (!path) {
      return href
    }

    const target = posix.normalize(posix.join(posix.dirname(page), decodeURI(path)))

    if (target === '..' || target.startsWith('../') || !isPage(target)) {
      return blobUrl(posix.normalize(`docs/${target}`)) + suffix
    }

    return path.replace(/(^|\/)README\.md$/, '$1index.md') + suffix
  }

  md.core.ruler.push('source_links', (state) => {
    const page = state.env.relativePath
    if (!page) {
      return
    }

    for (const block of state.tokens) {
      for (const token of block.children || []) {
        if (token.type !== 'link_open') {
          continue
        }

        const href = token.attrGet('href')
        if (href) {
          token.attrSet('href', rewrite(href, page))
        }
      }
    }
  })
}

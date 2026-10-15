/**
 * Markdown version of the site, for AI tools.
 *
 * After the build, every page is also written as Markdown next to its HTML
 * file, and an index is written at the base of each locale:
 *
 * - `<page>.md` next to `<page>.html` (`index.md` for a directory URL), e.g.
 *   https://pieceofcake2.github.io/docs/installation.md
 * - `llms.txt`: the title of the site and a link to the Markdown of every
 *   page, grouped like the sidebar (https://llmstxt.org/)
 * - `llms-full.txt`: the Markdown of every page in one file
 *
 * The Markdown is the source of the page with the front matter removed,
 * `<!--@include: ...-->` and text substitutions resolved, and Vue
 * `<script>`/`<style>` blocks removed. Links are made absolute: links to
 * pages point to their Markdown, links to other files of the repository point
 * to the file on GitHub, so the files can be read on their own.
 *
 * A page is left out when its front matter has `llms: false` or when it only
 * redirects to another page (`http-equiv: refresh`).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join, posix } from 'path'
import { formatValue } from './plugins/substitutions-replacer.js'

const frontmatterRE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/
const schemeRE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i
const imageRE = /\.(?:png|jpe?g|gif|svg|webp|avif|ico)$/i

/**
 * Whether a page is left out of the Markdown output.
 *
 * @param {string} source Markdown source of the page, with its front matter
 * @returns {boolean}
 */
export function isExcluded(source) {
  const frontmatter = source.match(frontmatterRE)?.[1] ?? ''

  return /^llms:\s*false\s*$/m.test(frontmatter) || /http-equiv:\s*['"]?refresh/i.test(frontmatter)
}

/**
 * URL of the Markdown version of a page, relative to the base of the site.
 *
 * @param {string} relativePath Path of the page after rewrites, e.g. `ja/installation.md`
 * @returns {string}
 */
export const markdownPath = (relativePath) => relativePath.replace(/(^|\/)README\.md$/, '$1index.md')

/**
 * GitHub URL prefix of the documentation sources, derived from the "Edit this
 * page" link: `https://github.com/<owner>/<repo>/edit/<branch>/docs/:path`.
 *
 * @param {object} themeConfig
 * @param {'blob'|'raw'} kind
 * @returns {string|undefined} e.g. `https://github.com/<owner>/<repo>/blob/<branch>/docs/`
 */
export function sourceUrlPrefix(themeConfig, kind = 'blob') {
  const pattern = themeConfig?.editLink?.pattern
  if (typeof pattern !== 'string' || !pattern.includes(':path')) {
    return undefined
  }

  return pattern.slice(0, pattern.indexOf(':path')).replace(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/edit\//, `$1/${kind}/`)
}

const decodeEntities = (text) => text
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#0?39;/g, "'")
  .replace(/&amp;/g, '&')

function splitFrontmatter(source) {
  const match = source.match(frontmatterRE)

  return match ? { frontmatter: match[1], body: source.slice(match[0].length) } : { frontmatter: '', body: source }
}

/**
 * `<!--@include: path-->` with an optional line range (`{3,10}`), as
 * VitePress resolves it. Includes that VitePress cannot resolve are kept.
 */
function resolveIncludes(content, file, srcDir, depth = 0) {
  return content.replace(/<!--\s*@include:\s*(.*?)\s*-->/g, (match, spec) => {
    if (depth > 10) {
      return match
    }

    const range = spec.match(/\{(\d*),(\d*)\}$/)
    let path = range ? spec.slice(0, -range[0].length) : spec
    if (/#[^\s{]+/.test(path)) {
      return match
    }

    path = path.startsWith('@') ? join(srcDir, path.slice(path[1] === '/' ? 2 : 1)) : join(dirname(file), path)
    if (!existsSync(path)) {
      return match
    }

    let included = readFileSync(path, 'utf-8')
    if (range) {
      const lines = included.split(/\r?\n/)
      included = lines.slice(range[1] ? parseInt(range[1]) - 1 : undefined, range[2] ? parseInt(range[2]) : undefined).join('\n')
    } else {
      included = splitFrontmatter(included).body
    }

    return resolveIncludes(included, path, srcDir, depth + 1)
  })
}

function applySubstitutions(content, substitutions = {}) {
  for (const [placeholder, config] of Object.entries(substitutions)) {
    const value = typeof config === 'string' ? config : config.value
    const format = typeof config === 'object' && config.format ? config.format : 'none'
    content = content.split(placeholder).join(formatValue(value, format))
  }

  return content
}

/**
 * Applies `replace` to the parts of the Markdown outside fenced code blocks and
 * code spans.
 */
function mapOutsideCode(content, replace) {
  const lines = content.split('\n')
  const output = []
  let fence = null
  let buffer = []

  const flush = () => {
    if (buffer.length) {
      const text = buffer.join('\n')
      // Keep code spans as they are
      const parts = text.split(/(`+[^`]*?`+)/)
      output.push(parts.map((part, i) => (i % 2 ? part : replace(part))).join(''))
      buffer = []
    }
  }

  for (const line of lines) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fence) {
      output.push(line)
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && line.trim() === marker[1]) {
        fence = null
      }
    } else if (marker) {
      flush()
      fence = marker[1]
      output.push(line)
    } else {
      buffer.push(line)
    }
  }
  flush()

  return output.join('\n')
}

/**
 * Writes the Markdown output. Called from the `buildEnd` hook.
 *
 * @param {object} siteConfig VitePress SiteConfig
 * @param {object} [options]
 * @param {string} [options.siteUrl] URL of the site including the base, e.g.
 *   `https://pieceofcake2.github.io/docs/` (default: `sitemap.hostname`)
 * @param {object} [options.substitutions] Text substitutions of the site
 * @param {(content: string, context: {route: string, locale: string}) => string} [options.transform]
 *   Changes the Markdown of a page before it is written
 * @param {(locale: string) => string} [options.llmsTxt] Additional Markdown
 *   appended to `llms.txt` of a locale
 * @returns {{pages: number, files: string[]}}
 */
export function writeMarkdownOutput(siteConfig, options = {}) {
  const { srcDir, outDir, site } = siteConfig
  const base = site.base || '/'
  const hostname = options.siteUrl ?? siteConfig.sitemap?.hostname ?? `https://pieceofcake2.github.io${base}`
  const siteUrl = hostname.endsWith('/') ? hostname : `${hostname}/`
  const blobPrefix = sourceUrlPrefix(site.themeConfig, 'blob')
  const rawPrefix = sourceUrlPrefix(site.themeConfig, 'raw')
  const rewrite = (page) => siteConfig.rewrites.map[page] ?? page

  const localeKeys = Object.keys(site.locales || {}).filter((key) => key !== 'root')
  const localeOf = (route) => localeKeys.find((key) => route.startsWith(`${key}/`)) ?? 'root'

  // Source path => route (both relative to the source directory, e.g.
  // `en/installation.md` => `installation.md`)
  const pages = new Map()
  for (const page of siteConfig.pages) {
    const route = rewrite(page)
    if (route === '404.md' || !existsSync(join(srcDir, page))) {
      continue
    }

    pages.set(page, route)
  }
  const routes = new Set(pages.values())

  const findPage = (path, known) => {
    const clean = path.replace(/\/$/, '')
    const candidates = clean === '' || clean === '.'
      ? ['index.md', 'README.md']
      : [clean, clean.replace(/\.html$/, '.md'), `${clean}.md`, `${clean}/index.md`, `${clean}/README.md`]

    return candidates.find((candidate) => candidate.endsWith('.md') && known(candidate))
  }

  const resolveLink = (href, page) => {
    if (schemeRE.test(href)) {
      return href
    }

    const [, rawPath, suffix] = href.match(/^([^?#]*)(.*)$/)
    let path
    try {
      path = decodeURI(rawPath)
    } catch {
      path = rawPath
    }

    if (path.startsWith('/')) {
      // Relative to the base of the site, in the space of the routes
      const target = posix.normalize(path.slice(1))
      const route = findPage(target, (candidate) => routes.has(candidate))
      if (route) {
        return siteUrl + encodeURI(markdownPath(route)) + suffix
      }

      return siteUrl + encodeURI(target) + suffix
    }

    const target = posix.normalize(posix.join(posix.dirname(page), path))
    const source = findPage(target, (candidate) => pages.has(candidate) && !candidate.startsWith('../'))
    if (source) {
      return siteUrl + encodeURI(markdownPath(pages.get(source))) + suffix
    }

    if (existsSync(join(srcDir, 'public', target))) {
      return siteUrl + encodeURI(target) + suffix
    }

    const prefix = imageRE.test(target) ? rawPrefix : blobPrefix
    if (prefix) {
      return new URL(path, new URL(posix.dirname(page) === '.' ? '' : `${posix.dirname(page)}/`, prefix)).href + suffix
    }

    return new URL(encodeURI(path), new URL(encodeURI(markdownPath(rewrite(page))), siteUrl)).href + suffix
  }

  const rewriteLinks = (content, page) => mapOutsideCode(content, (text) => text
    // Inline links and images: [text](target "title")
    .replace(/(\]\(\s*)(<[^>]*>|[^)\s]+)/g, (match, open, target) => {
      const angle = target.startsWith('<')
      const resolved = resolveLink(angle ? target.slice(1, -1) : target, page)

      return open + (angle ? `<${resolved}>` : resolved)
    })
    // Reference definitions: [label]: target
    .replace(/^( {0,3}\[[^\]]+\]:\s*)(\S+)/gm, (match, open, target) => open + resolveLink(target, page))
    // HTML attributes
    .replace(/(\s(?:href|src)=")([^"]+)(")/g, (match, open, target, close) => open + resolveLink(target, page) + close))

  const titleOf = (frontmatter, body, route) => {
    const fromFrontmatter = frontmatter.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1]
    if (fromFrontmatter) {
      return fromFrontmatter
    }

    let heading
    mapOutsideCode(body, (text) => {
      heading ??= text.match(/^# +(.+?)(?:\s+\{#[^}]*\})?\s*$/m)?.[1]

      return text
    })

    return heading ?? route.replace(/\.md$/, '')
  }

  // Write the Markdown of every page
  const documents = new Map()
  for (const [page, route] of pages) {
    const file = join(srcDir, page)
    const raw = readFileSync(file, 'utf-8')
    if (isExcluded(raw)) {
      continue
    }

    const { frontmatter, body } = splitFrontmatter(raw)
    const title = titleOf(frontmatter, body, route)
    const locale = localeOf(route)

    let content = resolveIncludes(body, file, srcDir)
    content = applySubstitutions(content, options.substitutions)
    content = content.replace(/^<(script|style)\b[^>]*>[\s\S]*?^<\/\1>\s*$/gm, '')
    content = rewriteLinks(content, page)
    if (!/^# /m.test(content)) {
      content = `# ${title}\n\n${content.replace(/^\s+/, '')}`
    }
    if (options.transform) {
      content = options.transform(content, { route, locale })
    }
    content = `${content.replace(/\s+$/, '')}\n`

    const output = markdownPath(route)
    mkdirSync(dirname(join(outDir, output)), { recursive: true })
    writeFileSync(join(outDir, output), content)
    documents.set(route, { title, url: siteUrl + encodeURI(output), content, locale })
  }

  // llms.txt and llms-full.txt for every locale
  const files = []
  for (const locale of ['root', ...localeKeys]) {
    const localeConfig = locale === 'root' ? {} : site.locales[locale] ?? {}
    const title = localeConfig.title ?? site.locales?.root?.title ?? site.title
    const description = localeConfig.description ?? site.description
    const sidebar = localeConfig.themeConfig?.sidebar ?? site.themeConfig?.sidebar
    const prefix = locale === 'root' ? '' : `${locale}/`

    const listed = new Set()
    const sections = []
    const pageItem = (item, depth) => {
      if (!item.link || item.link.includes('#') || schemeRE.test(item.link)) {
        return []
      }

      const route = findPage(posix.normalize(item.link.replace(/^\//, '')), (candidate) => documents.has(candidate))
      if (!route || listed.has(route)) {
        return []
      }

      listed.add(route)
      const { title: pageTitle, url } = documents.get(route)

      const text = item.text ? decodeEntities(item.text) : pageTitle

      return [`${'  '.repeat(depth)}- [${text}](${url})`]
    }
    const walk = (items, depth) => (items ?? []).flatMap((item) => [...pageItem(item, depth), ...walk(item.items, item.link ? depth + 1 : depth)])

    const groups = Array.isArray(sidebar) ? sidebar : Object.values(sidebar ?? {}).flat()
    const loose = []
    for (const group of groups) {
      if (!group.link && group.items) {
        const lines = walk(group.items, 0)
        if (lines.length) {
          sections.push(`## ${group.text}\n\n${lines.join('\n')}`)
        }
      } else {
        loose.push(...walk([group], 0))
      }
    }
    if (loose.length) {
      sections.unshift(`## ${locale === 'ja' ? 'ページ' : 'Pages'}\n\n${loose.join('\n')}`)
    }

    const others = [...documents.entries()]
      .filter(([route, doc]) => doc.locale === locale && !listed.has(route))
      .sort(([a], [b]) => (markdownPath(a) === `${prefix}index.md` ? -1 : markdownPath(b) === `${prefix}index.md` ? 1 : a.localeCompare(b)))
    if (others.length) {
      const heading = sections.length ? (locale === 'ja' ? 'その他のページ' : 'Other pages') : (locale === 'ja' ? 'ページ' : 'Pages')
      sections.push(`## ${heading}\n\n${others.map(([, doc]) => `- [${doc.title}](${doc.url})`).join('\n')}`)
      others.forEach(([route]) => listed.add(route))
    }

    if (!listed.size) {
      continue
    }

    const fullUrl = `${siteUrl}${prefix}llms-full.txt`
    const intro = locale === 'ja'
      ? `各ページの Markdown 版の一覧です。HTML ページの URL の \`.html\` を \`.md\` に置き換えると、そのページの Markdown を取得できます。すべてのページをまとめたファイルは ${fullUrl} です。`
      : `Links to the Markdown version of every page. Replace \`.html\` with \`.md\` in the URL of a page to get its Markdown. All pages in one file: ${fullUrl}`

    const llmsTxt = [
      `# ${title}`,
      description ? `> ${description}` : '',
      intro,
      ...sections,
      options.llmsTxt?.(locale) ?? '',
    ].filter(Boolean).join('\n\n')

    const full = [...listed].map((route) => {
      const doc = documents.get(route)

      return `---\nurl: ${doc.url}\n---\n\n${doc.content}`
    }).join('\n')

    mkdirSync(join(outDir, prefix), { recursive: true })
    writeFileSync(join(outDir, prefix, 'llms.txt'), `${llmsTxt.replace(/\s+$/, '')}\n`)
    writeFileSync(join(outDir, prefix, 'llms-full.txt'), full)
    files.push(`${prefix}llms.txt`, `${prefix}llms-full.txt`)
  }

  return { pages: documents.size, files }
}

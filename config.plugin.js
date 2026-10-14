/**
 * Configuration overrides for the documentation site of a plugin in the
 * pieceofcake2 organization, built from the `docs/` folder of the plugin's
 * repository and published at https://pieceofcake2.github.io/<repo>/.
 *
 * Used by .github/workflows/plugin-docs.yml, which copies this file to
 * `config.js`. Everything is derived from the repository, so plugins need no
 * configuration of their own:
 *
 * - DOCS_REPOSITORY (required): owner/repo, e.g. pieceofcake2/debug_kit
 * - DOCS_BRANCH: branch the docs are built from (default: 2.x)
 * - DOCS_SOURCE: path of the plugin's checkout; its composer.json gives the
 *   site title (package name) and description, and its LICENSE file is
 *   linked from the footer
 *
 * `docs/README.md` is the home page and other Markdown files in `docs/` are
 * further pages. The sidebar lists the pages and their `##` headings.
 */
import { existsSync, readdirSync, readFileSync } from 'fs'
import { dirname, join, posix, relative } from 'path'
import { fileURLToPath } from 'url'
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress'
import { sourceLinks } from './.vitepress/plugins/source-links.js'

const root = dirname(fileURLToPath(import.meta.url))
const srcDir = join(root, 'docs')

/**
 * Heading anchors as GitHub creates them, so links such as
 * `[Upgrading](#upgrading-from-22x)` work both on GitHub and on the site.
 */
const githubSlugify = (text) => text
  .trim()
  .toLowerCase()
  .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
  .replace(/ /g, '-')

/**
 * The pages are GitHub Markdown, not Vue templates: keep `{{ ... }}` (e.g. in
 * GitHub Actions expressions) as text instead of evaluating it. Fenced code
 * blocks already have v-pre.
 */
function noInterpolation(md) {
  const { code_inline: codeInline, text } = md.renderer.rules

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet('v-pre', '')

    return codeInline(tokens, idx, options, env, self)
  }

  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const html = text ? text(tokens, idx, options, env, self) : md.utils.escapeHtml(tokens[idx].content)

    return html.includes('{{') ? `<span v-pre>${html}</span>` : html
  }
}

const toRoute = (page) => page.replace(/(^|\/)README\.md$/, '$1index.md')

function findPages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      return entry.name === 'public' || entry.name === 'node_modules' ? [] : findPages(path)
    }

    return entry.name.endsWith('.md') ? [posix.normalize(relative(srcDir, path))] : []
  })
}

function pageLink(route) {
  const link = `/${route.replace(/\.md$/, '')}`

  return link.endsWith('/index') ? link.slice(0, -'index'.length) : link
}

/**
 * One sidebar group per page (the home page first), listing its `##` headings.
 */
async function buildSidebar(pages) {
  const sorted = [...pages].sort((a, b) => {
    const depth = (page) => (toRoute(page) === 'index.md' ? 0 : 1)

    return depth(a) - depth(b) || a.localeCompare(b)
  })

  const md = await createMarkdownRenderer(srcDir, {
    anchor: { slugify: githubSlugify },
    headers: { level: [2] },
  })

  try {
    const groups = []

    for (const page of sorted) {
      const env = { path: join(srcDir, page), relativePath: page, cleanUrls: false }
      await md.renderAsync(readFileSync(join(srcDir, page), 'utf-8'), env)

      const link = pageLink(toRoute(page))
      const title = env.frontmatter?.title || env.title || page

      groups.push({
        text: md.utils.escapeHtml(title),
        link,
        items: (env.headers || []).map((header) => ({
          text: header.title,
          link: `${link}#${header.slug}`,
        })),
      })
    }

    return groups
  } finally {
    // createMarkdownRenderer() caches its instance; drop it so that VitePress
    // creates its own with the full markdown configuration.
    disposeMdItInstance()
  }
}

function readComposer(source) {
  const file = source && join(source, 'composer.json')

  return file && existsSync(file) ? JSON.parse(readFileSync(file, 'utf-8')) : {}
}

function findLicense(source) {
  if (!source || !existsSync(source)) {
    return undefined
  }

  return readdirSync(source).find((name) => /^(LICENSE|LICENCE|COPYING)(\.[a-z]+)?$/i.test(name))
}

export default async ({ bookNav, bookUrl }) => {
  const repository = process.env.DOCS_REPOSITORY
  if (!repository || !repository.includes('/')) {
    throw new Error('Set DOCS_REPOSITORY to the repository of the plugin (owner/repo).')
  }

  const [owner, repo] = repository.split('/')
  const branch = process.env.DOCS_BRANCH || '2.x'
  const source = process.env.DOCS_SOURCE
  const composer = readComposer(source)
  const license = findLicense(source)
  const pages = findPages(srcDir)

  const title = composer.name || repository
  const repoUrl = `https://github.com/${repository}`
  const siteUrl = `https://${owner.toLowerCase()}.github.io/${repo}/`

  const footer = [
    license ? `See <a href="${repoUrl}/blob/${branch}/${license}">${license}</a> for copyright and license information.` : '',
    'Not affiliated with the Cake Software Foundation.',
  ].filter(Boolean).join(' ')

  // The site title drops the vendor prefix so it fits the sidebar; the banner
  // and description keep the full package name.
  const siteTitle = title.replace(/^[^/]+\//, '')

  return {
    base: `/${repo}/`,
    title: siteTitle,
    description: composer.description || `Documentation for ${title}`,
    rewrites: toRoute,
    sitemap: {
      hostname: siteUrl,
    },
    markdown: {
      anchor: {
        slugify: githubSlugify,
      },
      config: (md) => {
        md.use(sourceLinks, { repository, branch, pages })
        md.use(noInterpolation)
      },
    },
    themeConfig: {
      nav: bookNav({ absolute: true, current: repo }),
      sidebar: await buildSidebar(pages),
      socialLinks: [
        { icon: 'github', link: repoUrl },
      ],
      editLink: {
        pattern: `${repoUrl}/edit/${branch}/docs/:path`,
        text: 'Edit this page on GitHub',
      },
      footer: {
        message: footer,
        copyright: '',
      },
      versionBanner: {
        message: `This is the documentation for ${title}, a CakePHP 2.x plugin for pieceofcake2/cakephp.`,
        link: `${bookUrl}getting-started.html#about-this-fork`,
        linkText: 'About this fork.',
      },
    },
  }
}

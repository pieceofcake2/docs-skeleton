import { defineConfig } from 'vitepress'
import { substitutionsReplacer } from './plugins/substitutions-replacer.js'
import { pieceofcake2Container } from './plugins/pieceofcake2-container.js'
import { deepMerge, loadConfigOverrides, applyBaseToHeadTags } from './utils.js'
import { bookNav, bookUrl } from './book-nav.js'
import { packageListMarkdown } from './packages.js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { isExcluded, markdownPath, writeMarkdownOutput } from './markdown-output.js'

const defaultConfig = {
  srcDir: 'docs',
  title: 'CakePHP',
  description: 'CakePHP Documentation - The rapid development PHP framework',
  ignoreDeadLinks: true,
  substitutions: {
    '|phpversion|': { value: '8.4', format: 'bold' },
    '|minphpversion|': { value: '8.1', format: 'italic' },
    // Add more substitutions here as needed
    // '|cakeversion|': { value: '5.1', format: 'bold' },
    // '|projectname|': 'CakePHP',  // Simple string without formatting
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'CakePHP 2' }],
    ['link', { rel: 'manifest', href: '/favicon/site.webmanifest' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    outline: {
      level: [2, 3],
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Based on the <a href="https://github.com/cakephp/docs">CakePHP Cookbook</a>. Content licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>. Not affiliated with the Cake Software Foundation.',
      copyright: 'Original content © Cake Software Foundation, Inc. Modifications © 2025-present Piece of Cake 2.'
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    versionBanner: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framework': ['vue']
        }
      }
    }
  },
  markdown: {
    lineNumbers: true,
  },
  locales: {}
}

const overrides = await loadConfigOverrides(import.meta.url, { bookNav, bookUrl, packageListMarkdown })
const mergedConfig = deepMerge(defaultConfig, overrides)

// Configure markdown plugins after mergedConfig is available
const overrideMarkdownConfig = mergedConfig.markdown.config
mergedConfig.markdown.config = (md) => {
  md.use(substitutionsReplacer, { substitutions: mergedConfig.substitutions || {} })
  md.use(pieceofcake2Container)
  overrideMarkdownConfig?.(md)
}

// Markdown version of every page, llms.txt and llms-full.txt for AI tools
// (see markdown-output.js). `markdownOutput: false` turns it off; an object
// passes options (`transform`, `llmsTxt`).
const markdownOutput = mergedConfig.markdownOutput
delete mergedConfig.markdownOutput

if (markdownOutput !== false) {
  const overrideTransformHead = mergedConfig.transformHead
  mergedConfig.transformHead = async (context) => {
    const head = (await overrideTransformHead?.(context)) || []
    const { pageData, siteConfig } = context
    const source = join(siteConfig.srcDir, pageData.filePath)

    if (pageData.isNotFound || pageData.relativePath === '404.md' || !pageData.filePath || isExcluded(readFileSync(source, 'utf-8'))) {
      return head
    }

    return [
      ...head,
      ['link', { rel: 'alternate', type: 'text/markdown', href: `${siteConfig.site.base}${markdownPath(pageData.relativePath)}` }],
    ]
  }

  const overrideBuildEnd = mergedConfig.buildEnd
  mergedConfig.buildEnd = async (siteConfig) => {
    const { pages, files } = writeMarkdownOutput(siteConfig, {
      substitutions: mergedConfig.substitutions,
      ...(typeof markdownOutput === 'object' ? markdownOutput : {}),
    })
    siteConfig.logger.info(`Markdown output: ${pages} pages, ${files.join(', ')}`)
    await overrideBuildEnd?.(siteConfig)
  }
}

// Apply base path to head tags if base is specified
if (overrides.base) {
  applyBaseToHeadTags(mergedConfig, overrides.base)
}

export default defineConfig(mergedConfig)

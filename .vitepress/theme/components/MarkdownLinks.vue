<script setup>
// Links to the Markdown of the page, shown above the doc footer: its Markdown
// version on this site (written at build time, see markdown-output.js) and its
// source on GitHub, derived from the "Edit this page" link.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { page, theme, frontmatter, lang } = useData()

const labels = {
  en: { markdown: 'View as Markdown', source: 'View source on GitHub' },
  ja: { markdown: 'Markdown で表示', source: 'GitHub でソースを表示' },
}
const label = (key) => (labels[lang.value?.split('-')[0]] ?? labels.en)[key]

const excluded = computed(() => {
  const fm = frontmatter.value

  return fm.llms === false || /refresh/i.test(JSON.stringify(fm.head ?? []))
})

const markdownUrl = computed(() => {
  if (page.value.isNotFound || !page.value.filePath || excluded.value) {
    return undefined
  }

  return withBase(`/${page.value.relativePath.replace(/(^|\/)README\.md$/, '$1index.md')}`)
})

const sourceUrl = computed(() => {
  const pattern = theme.value.editLink?.pattern
  if (typeof pattern !== 'string' || !page.value.filePath) {
    return undefined
  }

  return pattern
    .replace(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/edit\//, '$1/blob/')
    .replace(/:path/g, page.value.filePath)
})
</script>

<template>
  <div
    v-if="markdownUrl || sourceUrl"
    class="poc-markdown-links"
  >
    <a
      v-if="markdownUrl"
      :href="markdownUrl"
      type="text/markdown"
      target="_blank"
    >{{ label('markdown') }}</a>
    <a
      v-if="sourceUrl"
      :href="sourceUrl"
      target="_blank"
      rel="noreferrer"
    >{{ label('source') }}</a>
  </div>
</template>

<style scoped>
.poc-markdown-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 48px;
  font-size: 14px;
  font-weight: 500;
}

.poc-markdown-links a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.25s;
}

.poc-markdown-links a:hover {
  color: var(--vp-c-brand-2);
}
</style>

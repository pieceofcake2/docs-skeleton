<script setup>
// Links to the Markdown of the page, shown in the doc footer on the same row
// as the "Edit this page" link: its Markdown version on this site (written at
// build time, see markdown-output.js) and its source on GitHub, derived from
// the "Edit this page" link.
//
// The theme renders this component twice: in the `doc-footer-before` slot of
// the VitePress doc footer, and with `standalone` in the `doc-after` slot,
// where it only shows up when VitePress renders no doc footer at all (no edit
// link, no last updated date and no previous/next page links).
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const props = defineProps({
  standalone: { type: Boolean, default: false },
})

const { page, theme, frontmatter, lang } = useData()

const labels = {
  en: {
    markdown: 'Markdown',
    markdownTitle: 'View this page as Markdown',
    source: 'Source',
    sourceTitle: 'View the source of this page on GitHub',
  },
  ja: {
    markdown: 'Markdown',
    markdownTitle: 'このページを Markdown で表示',
    source: 'ソース',
    sourceTitle: 'このページのソースを GitHub で表示',
  },
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

// Same condition as `showFooter` in VitePress's VPDocFooter.vue: the previous
// and next links count unless they are turned off, even on a page that has
// none.
const hasDocFooter = computed(() => {
  const fm = frontmatter.value
  const docFooter = theme.value.docFooter
  const hidePrev = (docFooter?.prev === false && !fm.prev) || fm.prev === false
  const hideNext = (docFooter?.next === false && !fm.next) || fm.next === false

  return Boolean(
    (theme.value.editLink && fm.editLink !== false) ||
    page.value.lastUpdated ||
    !hidePrev ||
    !hideNext,
  )
})

const show = computed(() => (markdownUrl.value || sourceUrl.value) && (!props.standalone || !hasDocFooter.value))
</script>

<template>
  <div
    v-if="show"
    :class="standalone ? 'VPDocFooter poc-doc-footer' : 'poc-doc-links'"
  >
    <a
      v-if="markdownUrl"
      class="poc-doc-link"
      :href="markdownUrl"
      :title="label('markdownTitle')"
      type="text/markdown"
      target="_blank"
    >
      <!-- Markdown mark, drawn in the style of the Lucide icons of VitePress -->
      <svg
        class="poc-doc-link-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <rect
            x="2"
            y="5"
            width="20"
            height="14"
            rx="2"
          />
          <path d="M6 15V9l3 3l3-3v6m5-6v6m-2.5-2.5L17 15l2.5-2.5" />
        </g>
      </svg>
      {{ label('markdown') }}
    </a>
    <a
      v-if="sourceUrl"
      class="poc-doc-link"
      :href="sourceUrl"
      :title="label('sourceTitle')"
      target="_blank"
      rel="noreferrer"
    >
      <!-- "github" icon of Lucide (ISC), like the edit link icon of VitePress -->
      <svg
        class="poc-doc-link-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </g>
      </svg>
      {{ label('source') }}
    </a>
  </div>
</template>

<style>
/*
 * One row in the doc footer: the "Edit this page" link of VitePress, then the
 * Markdown and Source links, then the last updated date at the right end. The
 * row wraps on narrow screens; the previous/next links stay below it.
 *
 * `.edit-info` (the edit link and the last updated date) and `.poc-doc-links`
 * are flattened with `display: contents` so that all the links wrap as items
 * of one flex row.
 */
.VPDoc .VPDocFooter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 20px;
}

.VPDoc .VPDocFooter .edit-info,
.VPDoc .VPDocFooter .poc-doc-links {
  display: contents;
}

.VPDoc .VPDocFooter .edit-link {
  order: 1;
}

.VPDoc .VPDocFooter .poc-doc-link {
  order: 2;
}

.VPDoc .VPDocFooter .last-updated {
  order: 3;
  flex-basis: 100%;
}

.VPDoc .VPDocFooter .prev-next {
  order: 4;
  flex-basis: 100%;
  margin-top: 18px;
}

@media (min-width: 640px) {
  .VPDoc .VPDocFooter .last-updated {
    flex-basis: auto;
    margin-left: auto;
  }

  .VPDoc .VPDocFooter .prev-next {
    margin-top: 14px;
  }
}

/* The footer of a page that has no VitePress doc footer */
.VPDoc .poc-doc-footer {
  margin-top: 64px;
}

/* Same look as the "Edit this page" link (.edit-link-button) */
.poc-doc-link {
  display: flex;
  align-items: center;
  border: 0;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.25s;
}

.poc-doc-link:hover {
  color: var(--vp-c-brand-2);
}

.poc-doc-link-icon {
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  margin-right: 8px;
}
</style>

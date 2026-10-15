<script setup>
// Forwards a link to a heading anchor that is not on the page to the page
// that has it, e.g. https://pieceofcake2.github.io/aws/#dynamodb-cache to
// https://pieceofcake2.github.io/aws/cache.html#dynamodb-cache after a section
// moved from the home page to a page of its own.
//
// `themeConfig.headingAnchors` maps every heading anchor of the site to the
// page that has it (a sidebar link such as `/cache`). config.plugin.js sets it
// for plugin sites with several pages; without it, this does nothing.
import { onMounted, onUnmounted } from 'vue'
import { onContentUpdated, useData, useRouter, withBase } from 'vitepress'

const { theme, page } = useData()
const router = useRouter()

const pageLink = () => `/${page.value.relativePath}`
  .replace(/\.md$/, '')
  .replace(/(^|\/)index$/, '$1')

function forward() {
  const anchors = theme.value.headingAnchors
  if (!anchors || !window.location.hash) {
    return
  }

  let id
  try {
    id = decodeURIComponent(window.location.hash.slice(1))
  } catch {
    return
  }

  const link = Object.hasOwn(anchors, id) ? anchors[id] : undefined
  if (!link || link === pageLink() || document.getElementById(id)) {
    return
  }

  router.go(withBase(link) + window.location.hash, { replace: true })
}

onContentUpdated(forward)
onMounted(() => window.addEventListener('hashchange', forward))
onUnmounted(() => window.removeEventListener('hashchange', forward))
</script>

<template>
  <span hidden />
</template>

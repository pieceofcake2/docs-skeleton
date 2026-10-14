<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()

const bannerConfig = computed(() => theme.value.versionBanner)

const isVisible = computed(() => {
  if (bannerConfig.value === true) {
    return true
  }

  if (bannerConfig.value && typeof bannerConfig.value === 'object') {
    return bannerConfig.value.enabled !== false
  }

  return false
})

const message = computed(() => {
  if (bannerConfig.value && typeof bannerConfig.value === 'object' && bannerConfig.value.message) {
    return bannerConfig.value.message
  }

  return 'This version of the documentation is outdated.'
})

const link = computed(() => {
  if (bannerConfig.value && typeof bannerConfig.value === 'object') {
    return bannerConfig.value.link || ''
  }

  return ''
})

const linkText = computed(() => {
  if (bannerConfig.value && typeof bannerConfig.value === 'object' && bannerConfig.value.linkText) {
    return bannerConfig.value.linkText
  }

  return 'View the latest version.'
})

</script>

<template>
  <div
    v-if="isVisible"
    class="version-banner"
    role="status"
    aria-live="polite"
  >
    {{ message }}
    <a v-if="link" :href="link" target="_self">{{ linkText }}</a>
  </div>
</template>


<style scoped>
  /*
   * Shown at the top of the main column (doc-before / page-top /
   * home-hero-before slots) and scrolls with the page, so the fixed header and
   * the "On this page" outline keep VitePress's own positions.
   */
  .version-banner {
    margin: 0 0 16px;
    border: 1px solid #e8c892;
    border-radius: 8px;
    background: #fff7e8;
    color: #734a00;
    padding: 4px 12px;
    font-size: 13px;
    line-height: 1.5;
  }

  .version-banner a {
    color: inherit;
    text-decoration: underline;
  }

  .dark .version-banner {
    border-color: #9b6a1f;
    background: #2d2417;
    color: #f3c372;
  }
</style>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  // Where the banner is rendered: 'doc' (top of the doc area, next to the
  // sidebar), 'page' or 'home'. 'doc' cancels the padding of .VPDoc so the
  // banner spans the whole area.
  placement: {
    type: String,
    default: 'doc',
  },
})

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
    :class="['version-banner', `version-banner--${props.placement}`]"
    role="status"
    aria-live="polite"
  >
    {{ message }}
    <a v-if="link" :href="link" target="_self">{{ linkText }}</a>
  </div>
</template>


<style scoped>
  /*
   * A full-width strip at the top of the content area (doc-top / page-top /
   * home-hero-before slots). It scrolls with the page instead of being fixed
   * above the header, so the header and the "On this page" outline keep
   * VitePress's own positions.
   */
  .version-banner {
    border-bottom: 1px solid #e8c892;
    background: #fff7e8;
    color: #734a00;
    padding: 4px 16px;
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
  }

  .version-banner a {
    display: inline-block;
    color: inherit;
    text-decoration: underline;
    white-space: nowrap;
  }

  .dark .version-banner {
    border-bottom-color: #9b6a1f;
    background: #2d2417;
    color: #f3c372;
  }

  /* Cancel the padding of .VPDoc (32px 24px, 48px 32px from 768px). */
  .version-banner--doc {
    margin: -32px -24px 32px;
  }

  @media (min-width: 768px) {
    .version-banner--doc {
      margin: -48px -32px 32px;
    }
  }
</style>

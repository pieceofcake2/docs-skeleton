import DefaultTheme from 'vitepress/theme-without-fonts'
import PageLoader from "./components/PageLoader.vue";
import VersionBanner from "./components/VersionBanner.vue";
import { groups } from '../packages.js'
import './custom.css'
import { h } from "vue";

// Path prefixes of the other sites on the same origin: the book and every
// package documentation site. A link into one of them must be a full page
// load, because the client-side router of this site doesn't know its pages.
const sitePrefixes = [
  '/docs/',
  ...groups
    .flatMap((group) => group.items ?? (group.categories ?? []).flatMap((category) => category.items))
    .map((item) => `/${item.repo}/`),
]

const isOtherSite = (pathname, base) => {
  if (!pathname.startsWith(base)) {
    return true
  }

  return sitePrefixes.some((prefix) => prefix !== base && prefix.startsWith(base) && pathname.startsWith(prefix))
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => [
        h(PageLoader),
        h(VersionBanner),
      ],
    })
  },
  enhanceApp() {
    if (typeof window === 'undefined') {
      return
    }

    // Runs in the capture phase, before the client-side router's click handler.
    // The router leaves links with a target attribute to the browser.
    window.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link || link.hasAttribute('target')) {
        return
      }

      const url = new URL(link.getAttribute('href'), link.baseURI)
      if (url.origin === window.location.origin && isOtherSite(url.pathname, import.meta.env.BASE_URL)) {
        link.setAttribute('target', '_self')
      }
    }, true)
  },
}

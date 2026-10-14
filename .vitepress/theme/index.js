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
  enhanceApp({ router }) {
    if (typeof window === 'undefined') {
      return
    }

    const previous = router.onBeforeRouteChange
    router.onBeforeRouteChange = async (href) => {
      if ((await previous?.(href)) === false) {
        return false
      }

      const url = new URL(href, window.location.href)
      if (url.origin === window.location.origin && isOtherSite(url.pathname, import.meta.env.BASE_URL)) {
        window.location.assign(url.href)

        return false
      }
    }
  },
}

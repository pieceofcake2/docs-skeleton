import DefaultTheme from 'vitepress/theme-without-fonts'
import PageLoader from "./components/PageLoader.vue";
import VersionBanner from "./components/VersionBanner.vue";
import MarkdownLinks from "./components/MarkdownLinks.vue";
import MovedAnchor from "./components/MovedAnchor.vue";
import { groups, siteUrl } from '../packages.js'
import './custom.css'
import { h } from "vue";

// Path prefixes of the other sites on the same origin: the book and every
// package documentation site. A link into one of them must be a full page
// load, because the client-side router of this site doesn't know its pages.
const sitePrefixes = [
  '/docs/',
  ...groups
    .flatMap((group) => group.items ?? (group.categories ?? []).flatMap((category) => category.items))
    .map((item) => new URL(siteUrl(item)).pathname),
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
      ],
      // The version banner is a strip at the top of the content area that
      // scrolls with the page instead of being fixed above the header.
      'doc-top': () => h(VersionBanner, { placement: 'doc' }),
      'page-top': () => h(VersionBanner, { placement: 'page' }),
      'home-hero-before': () => h(VersionBanner, { placement: 'home' }),
      // Links to the Markdown of the page (its .md version and its source),
      // on the row of the "Edit this page" link. `doc-after` covers a page
      // without a doc footer.
      'doc-footer-before': () => h(MarkdownLinks),
      'doc-after': () => h(MarkdownLinks, { standalone: true }),
      // Links to a heading that moved to another page of the site
      'layout-bottom': () => h(MovedAnchor),
    })
  },
  enhanceApp({ router }) {
    if (typeof window === 'undefined') {
      return
    }

    // The client-side router only knows the pages of this site. Hand links into
    // the other sites (the book, the package documentation sites and the top
    // page) to the browser as a normal page load.
    const go = router.go.bind(router)
    router.go = async (href, options) => {
      const url = new URL(href, window.location.href)
      if (url.origin === window.location.origin && isOtherSite(url.pathname, import.meta.env.BASE_URL)) {
        window.location.assign(url.href)

        return
      }

      await go(href, options)
    }
  },
}

import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'
import type { PluginOption } from 'vite'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'outil Frontend de nouvelle génération'
const ogImage = 'https://vite.dev/og-image.jpg'
const ogTitle = 'Vite'
const ogUrl = 'https://vite.dev'

// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-main.netlify.app':
      return 'main'
    case '':
      return 'local'
    default:
      return 'release'
  }
})()
const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (main branch)'
    case 'local':
      return ' (local)'
    case 'release':
      return ''
  }
})()
const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Doc Vite 5',
      link: 'https://v5.vite.dev',
    },
    {
      text: 'Doc Vite 4',
      link: 'https://v4.vite.dev',
    },
    {
      text: 'Doc Vite 3',
      link: 'https://v3.vite.dev',
    },
    {
      text: 'Doc Vite 2',
      link: 'https://v2.vite.dev',
    },
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Doc Vite 6 (release)',
          link: 'https://vite.dev',
        },
        ...oldVersions,
      ]
    case 'release':
      return oldVersions
  }
})()

export default defineConfig({
  title: `Vite${additionalTitle}`,
  description: 'Next Generation Frontend Tooling',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss' },
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true',
      },
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
      },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'vitejs' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],

  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文', link: 'https://cn.vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    es: { label: 'Español', link: 'https://es.vite.dev' },
    pt: { label: 'Português', link: 'https://pt.vite.dev' },
    ko: { label: '한국어', link: 'https://ko.vite.dev' },
    de: { label: 'Deutsch', link: 'https://de.vite.dev' },
    fr: { label: 'Français', link: 'https://fr.vite.dev' },
  },
  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/vite/edit/main/docs/:path',
      text: 'Suggestions pour cette page',
    },

    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' },
    ],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: '208bb9c14574939326032b937431014b',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:fr'],
      },
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev',
    },

    footer: {
      message: `Publié sous la licence MIT. (${commitRef})`,
      copyright: 'Copyright © 2019-present VoidZero Inc. & Vite Contributors',
    },

    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Config', link: '/config/', activeMatch: '/config/' },
      { text: 'Plugins', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Ressources',
        items: [
          { text: 'Équipe', link: '/team' },
          { text: 'Blog', link: '/blog' },
          { text: 'Releases', link: '/releases' },
          {
            items: [
              {
                text: 'Bluesky',
                link: 'https://bsky.app/profile/vite.dev',
              },
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'X',
                link: 'https://x.com/vite_js',
              },
              {
                text: 'Discord Chat',
                link: 'https://chat.vite.dev',
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite',
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org',
              },
              {
                text: 'DEV Community',
                link: 'https://dev.to/t/vite',
              },
              {
                text: 'Changelog',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
              },
              {
                text: 'Contribuer',
                link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md',
              },
            ],
          },
        ],
      },
      {
        text: 'Version',
        items: versionLinks,
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            {
              text: 'Commencer',
              link: '/guide/',
            },
            {
              text: 'Philosophie',
              link: '/guide/philosophy',
            },
            {
              text: 'Pourquoi Vite',
              link: '/guide/why',
            },
          ],
        },
        {
          text: 'Guide',
          items: [
            {
              text: 'Fonctionnalités',
              link: '/guide/features',
            },
            {
              text: 'CLI',
              link: '/guide/cli',
            },
            {
              text: 'Utiliser les plugins',
              link: '/guide/using-plugins',
            },
            {
              text: 'Pré-bundling des dépendances',
              link: '/guide/dep-pre-bundling',
            },
            {
              text: 'Gestion des ressources statiques',
              link: '/guide/assets',
            },
            {
              text: 'Construction pour la production',
              link: '/guide/build',
            },
            {
              text: 'Déployer un site statique',
              link: '/guide/static-deploy',
            },
            {
              text: 'Variables d‘environnement et modes',
              link: '/guide/env-and-mode',
            },
            {
              text: 'Rendu côté serveur (SSR)',
              link: '/guide/ssr',
            },
            {
              text: 'Intégration avec le backend',
              link: '/guide/backend-integration',
            },
            {
              text: 'Résolution des problèmes',
              link: '/guide/troubleshooting',
            },
            {
              text: 'Performance',
              link: '/guide/performance',
            },
            {
              text: 'Rolldown',
              link: '/guide/rolldown',
            },
            {
              text: 'Migration depuis v5',
              link: '/guide/migration',
            },
            {
              text: 'Changements cassants',
              link: '/changes/',
            },
          ],
        },
        {
          text: 'APIs',
          items: [
            {
              text: 'API des plugins',
              link: '/guide/api-plugin',
            },
            {
              text: 'API HMR',
              link: '/guide/api-hmr',
            },
            {
              text: 'API JavaScript',
              link: '/guide/api-javascript',
            },
            {
              text: 'Référence de configuration',
              link: '/config/',
            },
          ],
        },
        {
          text: 'API d‘environnement',
          items: [
            {
              text: 'Introduction',
              link: '/guide/api-environment',
            },
            {
              text: 'Instances d‘environnement',
              link: '/guide/api-environment-instances',
            },
            {
              text: 'Plugins',
              link: '/guide/api-environment-plugins',
            },
            {
              text: 'Frameworks',
              link: '/guide/api-environment-frameworks',
            },
            {
              text: 'Runtime',
              link: '/guide/api-environment-runtimes',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Config',
          items: [
            {
              text: 'Configurer Vite',
              link: '/config/',
            },
            {
              text: 'Options partagées',
              link: '/config/shared-options',
            },
            {
              text: 'Options serveur',
              link: '/config/server-options',
            },
            {
              text: 'Options de build',
              link: '/config/build-options',
            },
            {
              text: 'Options de prévisualisation',
              link: '/config/preview-options',
            },
            {
              text: 'Options d‘optimisation de dépendances',
              link: '/config/dep-optimization-options',
            },
            {
              text: 'Options SSR',
              link: '/config/ssr-options',
            },
            {
              text: 'Options worker',
              link: '/config/worker-options',
            },
          ],
        },
      ],
      '/changes/': [
        {
          text: 'Changements cassants',
          link: '/changes/',
        },
        {
          text: 'Actuels',
          items: [],
        },
        {
          text: 'Futurs',
          items: [
            {
              text: 'this.environment dans les hooks',
              link: '/changes/this-environment-in-hooks',
            },
            {
              text: 'HMR hook hotUpdate Plugin',
              link: '/changes/hotupdate-hook',
            },
            {
              text: 'Passer à des APIs par environnement',
              link: '/changes/per-environment-apis',
            },
            {
              text: 'SSR avec ModuleRunner API',
              link: '/changes/ssr-using-modulerunner',
            },
            {
              text: 'Plugins partagés lors du build',
              link: '/changes/shared-plugins-during-build',
            },
          ],
        },
        {
          text: 'Passés',
          items: [],
        },
      ],
    },

    outline: {
      level: [2, 3],
    },
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }],
    )
    return pageData
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
        },
      }),
      llmstxt({
        ignoreFiles: ['blog/*', 'blog.md', 'index.md', 'team.md'],
        description: 'The Build Tool for the Web',
        details: `\
- 💡 Instant Server Start
- ⚡️ Lightning Fast HMR
- 🛠️ Rich Features
- 📦 Optimized Build
- 🔩 Universal Plugin Interface
- 🔑 Fully Typed APIs

Vite is a new breed of frontend build tooling that significantly improves the frontend development experience. It consists of two major parts:

- A dev server that serves your source files over [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), with [rich built-in features](https://vite.dev/guide/features.md) and astonishingly fast [Hot Module Replacement (HMR)](https://vite.dev/guide/features.md#hot-module-replacement).

- A [build command](https://vite.dev/guide/build.md) that bundles your code with [Rollup](https://rollupjs.org), pre-configured to output highly optimized static assets for production.

In addition, Vite is highly extensible via its [Plugin API](https://vite.dev/guide/api-plugin.md) and [JavaScript API](https://vite.dev/guide/api-javascript.md) with full typing support.`,
      }) as PluginOption,
    ],
    optimizeDeps: {
      include: [
        '@shikijs/vitepress-twoslash/client',
        'gsap',
        'gsap/dist/ScrollTrigger',
        'gsap/dist/MotionPathPlugin',
      ],
    },
  },
  buildEnd,
})

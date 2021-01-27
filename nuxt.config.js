import ampify from './plugins/ampify'
import svgoPlugins from './plugins/svgoPlugins'
const isProd = process.env.NODE_ENV === 'production'

import pages from './assets/js/generated/pages'
import locales from './assets/js/generated/locales'

export default {
  globalName: 'APP',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-oruga2-tail',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'nuxt oruga tailwind'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/css/tailwind.css', '~/assets/scss/oruga.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      mode: 'all',
      src: '~plugins/oruga.js'
    },
    {
      mode: 'all',
      src: '~plugins/helpers.js'
    },
    {
      mode: 'all',
      src: '@/plugins/config'
    }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,
  loading: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // A NuxtJS module that makes a 301 redirection to a non trailing slash URL
    'nuxt-trailingslash-module',
    '@nuxtjs/svg-sprite',
    [
      'nuxt-i18n',
      {
        defaultLocale: 'fr',
        locales,
        routesNameSeparator: '_',
        lazy: true,
        langDir: 'assets/js/generated/langs/',
        detectBrowserLanguage: false,
        differentDomains: true,
        parsePages: false,
        pages,

        // Called right before app's locale changes
        beforeLanguageSwitch: () => null,
        // Called after app's locale has changed
        onLanguageSwitched: () => null
      }
    ],

    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    [
      '@nuxtjs/pwa',
      {
        icon: {
          iconFileName: 'icon.png'
        },
        manifest: {
          name: 'Optigura',
          lang: 'fr',
          short_name: 'Optigura',
          start_url: '/',
          display: 'standalone',
          background_color: '#f8f8f8',
          theme_color: '#f8f8f8',
          description: 'Tous les produits de musculation en ligne',
          icons: []
          // crossorigin: 'use-credentials',
        }
      }
    ]
    // [
    //   '@oruga-ui/oruga/nuxt',
    //   {
    //     button: {
    //       override: false
    //     }
    //   }
    // ]
  ],

  svgSprite: {
    input: '~/assets/icons',
    output: '~/static/img',
    defaultSprite: 'sprite',
    svgoConfig () {
      return {
        plugins: svgoPlugins()
      }
    }
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
    credentials: false,
    redirectError: {
      401: '/401',
      404: '/404'
    }
  },
  proxy: {
    '/api/': {
      target: process.env.API_URL,
      pathRewrite: {
        '^/api/': ''
      }
    }
  },
  router: {
    middleware: ['isAmp'],
    linkActiveClass: 'alink',
    linkExactActiveClass: 'ealink',
    linkPrefetchedClass: 'plink',
    prefetchLinks: false
  },
  buildDir: '.build',
  render: {
    asyncScripts: true
    // resourceHints: false,
  },
  // This feature is inspired by vue-cli modern mode: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-modern
  modern: 'server',

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    optimization: {
      minimize: isProd,
      runtimeChunk: !isProd,
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.()$/, // /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  },
  hooks: {
    // This hook is called before serving the html to the browser
    'render:route': (url, page, { req, res }) => {
      page.html = page.html.replace(
        /rel="manifest" href="/gi,
        `rel="manifest" href="${process.env.CDN}`
      )
      page.html = page.html.replace(
        /rel="stylesheet" href="/gi,
        `rel="stylesheet" href="${process.env.CDN}`
      )
      page.html = page.html.replace(
        /script src="/gi,
        `script src="${process.env.CDN}`
      )

      if (url.includes('?amp=1')) {
        page.html = ampify(page.html)
      }
    }
  }
}

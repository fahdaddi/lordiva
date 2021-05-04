import path from 'path'
const whitelister = require('purgecss-whitelister')

import ampify from './plugins/ampify'

const isProd = process.env.NODE_ENV === 'production'

import locales from './assets/js/locales'

export default {
  globalName: 'Lordiva',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: '%s - Optigura',
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/css/app.scss', '~/assets/css/tailwind.css'],

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
    },
    {
      mode: 'all',
      src: '@/plugins/components/CSvg'
    },
    {
      mode: 'all',
      src: '@/plugins/components/CImg'
    }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,
  loading: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // '@nuxtjs/tailwindcss'
    '@nuxtjs/device'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'nuxt-purgecss',
    // A NuxtJS module that makes a 301 redirection to a non trailing slash URL
    'nuxt-trailingslash-module',
    [
      '~/modules/svg-sprite',
      {
        input: '~/assets/icons',
        output: '~/static/img',
        defaultSprite: 'sprite',
        svgo: [
          { removeEmptyAttrs: false },
          { moveGroupAttrsToElems: false },
          { collapseGroups: false },
          { removeTitle: false },
          { removeXMLNS: true },
          { removeViewBox: false },
          { removeDimensions: true }
        ]
      }
    ],
    [
      'nuxt-i18n',
      {
        defaultLocale: 'fr',
        locales,
        routesNameSeparator: '_',
        lazy: true,
        langDir: 'assets/js/langs/',

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
          name: 'Lordiva Watch',
          lang: 'fr',
          short_name: 'Lordiva',
          start_url: '/',
          display: 'standalone',
          background_color: '#f8f8f8',
          theme_color: '#f8f8f8',
          description:
            'LORDIVA Watch la référence des montres très hautes gammes',
          icons: [],
          crossorigin: 'use-credentials'
        }
      }
    ]
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: false,
    credentials: false,
    redirectError: {
      401: '/401',
      404: '/404'
    }
  },
  router: {
    middleware: ['isAmp'],
    linkActiveClass: 'alink',
    linkExactActiveClass: 'ealink',
    linkPrefetchedClass: 'plink'
  },
  purgeCSS: {
    mode: 'postcss',
    whitelistPatterns: [/^o-.*/],
    whitelistPatternsChildren: [/^o-.*/],
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ],
    whitelist: whitelister([
      './assets/css/layout/*.scss',
      './node_modules/@oruga-ui/oruga/src/scss/*.scss'
    ])
  },
  buildDir: '.build',
  render: {
    asyncScripts: true
    // resourceHints: false,
  },
  // This feature is inspired by vue-cli modern mode: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-modern
  modern: isProd ? 'server' : false,

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    postcss: {
      plugins: { tailwindcss: path.resolve(__dirname, './tailwind.config.js') }
    },
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
      if (url.includes('?amp=1') || url.includes('/amp')) {
        page.html = ampify(page.html)
      }
    }
  }
}

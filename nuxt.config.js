import path from "path";
const whitelister = require("purgecss-whitelister");

const isProd = process.env.NODE_ENV === "production";

import locales from "./assets/js/locales";

export default {
  globalName: "Habous Art & Co.",
  server: {
    host: "0.0.0.0",
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - Habous Art & Co.",
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~/assets/css/app.scss", "~/assets/css/tailwind.css"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      mode: "all",
      src: "~plugins/oruga.js",
    },
    {
      mode: "all",
      src: "~plugins/helpers.js",
    },
    {
      mode: "all",
      src: "~plugins/drawers.js",
    },
    {
      mode: "all",
      src: "~plugins/vee-validate.js",
    },
    {
      mode: "all",
      src: "~plugins/event-bus.js",
    },
    {
      mode: "all",
      src: "@/plugins/config",
    },
    {
      mode: "all",
      src: "@/plugins/axios",
    },
    {
      mode: "client",
      src: "@/plugins/vueSmoothScroll",
    },
    {
      mode: "all",
      src: "@/plugins/components/CSvg",
    },
    {
      mode: "all",
      src: "@/plugins/components/CImg",
    },
    {
      mode: "all",
      src: "@/plugins/components/Tag",
    },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,
  loading: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // '@nuxtjs/tailwindcss'
    "@nuxtjs/device",
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    "nuxt-purgecss",
    // A NuxtJS module that makes a 301 redirection to a non trailing slash URL
    "nuxt-trailingslash-module",
    [
      "~/modules/svg-sprite",
      {
        input: "~/assets/icons",
        output: "~/static/img",
        defaultSprite: "sprite",
        svgo: [
          { removeEmptyAttrs: false },
          { moveGroupAttrsToElems: false },
          { collapseGroups: false },
          { removeTitle: false },
          { removeXMLNS: true },
          { removeViewBox: false },
          { removeDimensions: true },
        ],
      },
    ],
    [
      "nuxt-i18n",
      {
        defaultLocale: "fr",
        locales,
        routesNameSeparator: "_",
        lazy: true,
        langDir: "assets/js/langs/",

        // Called right before app's locale changes
        beforeLanguageSwitch: () => null,
        // Called after app's locale has changed
        onLanguageSwitched: () => null,
      },
    ],

    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    [
      "@nuxtjs/pwa",
      {
        icon: {
          iconFileName: "logo.png",
        },
        manifest: {
          name: "Habous Art & Co.",
          lang: "fr",
          short_name: "Habous-art-co",
          start_url: "/",
          display: "standalone",
          background_color: "#f8f8f8",
          theme_color: "#f8f8f8",
          description:
            "Habous Art & Co., la référence Marocaine des  faits main très hautes gammes",
          icons: [],
          crossorigin: "use-credentials",
        },
      },
    ],
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.API_URL,
    credentials: false,
    redirectError: {
      401: "/401",
      404: "/404",
    },
  },
  router: {
    middleware: ["isAmp"],
    linkActiveClass: "alink",
    linkExactActiveClass: "ealink",
    linkPrefetchedClass: "plink",
  },
  purgeCSS: {
    mode: "postcss",
    whitelistPatterns: [/^o-.*/],
    whitelistPatternsChildren: [/^o-.*/],
    content: [
      "components/**/*.vue",
      "layouts/**/*.vue",
      "pages/**/*.vue",
      "plugins/**/*.js",
      "nuxt.config.js",
    ],
    whitelist: whitelister([
      "./assets/css/layout/*.scss",
      "./node_modules/@oruga-ui/oruga/src/scss/*.scss",
    ]),
  },
  buildDir: ".build",
  render: {
    asyncScripts: true,
    // resourceHints: false,
  },
  // This feature is inspired by vue-cli modern mode: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-modern
  modern: isProd ? "server" : false,

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    postcss: {
      plugins: { tailwindcss: path.resolve(__dirname, "./tailwind.config.js") },
    },
    babel: {
      plugins: [["@babel/plugin-proposal-private-methods", { loose: true }]],
    },
    transpile: ["vee-validate/dist/rules"],
    optimization: {
      minimize: isProd,
      runtimeChunk: !isProd,
      splitChunks: {
        chunks: "async",
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.(css|vue)$/,
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.()$/, // /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
          options: {
            fix: true,
          },
        });
      }
    },
  },
  hooks: {
    // This hook is called before serving the html to the browser
    "render:route": (url, page, { req, res }) => {},
  },
};

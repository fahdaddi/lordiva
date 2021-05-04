module.exports = {
  important: true,
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ],
    options: {
      whitelist: ['assets/css/*.scss', 'assets/css/oruga.scss'],
      whitelistPatternsChildren: []
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      animation: ['hover', 'focus', 'group-hover']
    }
  },
  corePlugins: {
    container: false,
    fontFamily: false,
    preflight: false,
    ringWidth: false,
    boxShadow: false
  },
  plugins: []
}

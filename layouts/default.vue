<template>
  <div class="wrap">
    <Common />
    <Header />
    <main class="main">
      <!-- TODO: Loader -->
      <nuxt />
    </main>
    <Footer />
  </div>
</template>

<script>
import Common from '@/components/layouts/common/index'
import Header from '@/components/layouts/common/Header'
import Footer from '@/components/layouts/common/Footer'

export default {
  components: {
    Common,
    Header,
    Footer,
  },
  data() {
    return {
      open: false,
    }
  },
  methods: {},
  head() {
    let canonical = `${this.$config('url')}${this.$route.path}`
    canonical = canonical.replace('/amp', '')
    const link = [{ rel: 'canonical', href: canonical }]

    // TODO to be validated
    this.$i18n.locales.forEach((l) => {
      let path = this.switchLocalePath(l.code)

      const p = path.indexOf('?')
      path = path.replace('/amp', '')
      path = path.substring(0, p !== -1 ? p : path.length)

      // link.push({ rel: "alternate", hreflang: l.iso, href: `${path}/amp` });
    })

    return {
      htmlAttrs: { lang: this.$config('iso') },
      title: 'homepage',
      link,
    }
  },
}
</script>

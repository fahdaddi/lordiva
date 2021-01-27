<template>
  <div class="bg-gray-100">
    <div class="container bg-white">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
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

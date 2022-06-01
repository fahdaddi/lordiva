<template>
  <div id="main-layout">
    <Common />
    <Header />
    <main id="top" class="main">
      <!-- TODO: Loader -->
      <nuxt-child />
    </main>
    <Footer />
  </div>
</template>

<script>
import Common from "@/components/layouts/common";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default {
  components: {
    Common,
    Header,
    Footer,
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    meta_title() {
      return this.$store.state.meta_title;
    },
  },
  methods: {},
  head() {
    let path = this.$route.path === "/" ? "" : this.$route.path;
    let canonical = `${this.$store.state.url}${path}`;

    let link = [{ rel: "canonical", href: canonical }];
    return {
      htmlAttrs: { lang: this.$config("iso") },
      title: this.meta_title,
      link,
    };
  },
};
</script>

<template>
  <div class="wrap">
    <o-sidebar
      content-class="drawer"
      fullheight
      overlay
      :right="$root.ddRight"
      :open.sync="$root.ddMenu"
    >
      <div class="close" @click.stop="$root.closeMenu()">
        <c-svg>close</c-svg>
      </div>
      <component :is="$root.ddMenu_content" />
    </o-sidebar>

    <o-button
      v-show="fab"
      v-smooth-scroll
      href="#top"
      variant="white"
      class="totop"
      rounded
    >
      <c-svg class="lg">chevron-up</c-svg>
    </o-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fab: false,
    };
  },
  beforeMount() {
    if (this.$device.isDesktop) {
      window.addEventListener("scroll", this.scrollTop);
    }
  },
  beforeDestroy() {
    if (this.$device.isDesktop) {
      window.removeEventListener("scroll", this.scrollTop);
    }
  },
  methods: {
    scrollTop() {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || document.documentElement.offsetTop || 0;
      this.fab = top > 500;
    },
  },
};
</script>

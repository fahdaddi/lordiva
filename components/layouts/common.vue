<template>
  <div class="wrap">
    <o-sidebar
      :content-class="
        $root.drawer_child
          ? `${d_class} animate-slide-left-${$root.drawer_child_class}`
          : d_class
      "
      :can-cancel="false"
      fullheight
      overlay
      right
      :open="$root.drawer"
    >
      <component
        :is="$root.drawer_content"
        v-on-clickaway="closeParentDrawer"
        :options="$root.drawer_options"
        @close="$root.closeDrawer(1)"
      />
    </o-sidebar>
    <o-sidebar
      v-if="$root.drawer_child"
      v-on-clickaway="closeChildDrawer"
      :content-class="d_child_class"
      :can-cancel="false"
      fullheight
      right
      :open="$root.drawer_child"
    >
      <component
        :is="$root.drawer_child_content"
        :options="$root.drawer_child_options"
        @close="$root.closeDrawer(2)"
      />
    </o-sidebar>

    <o-sidebar
      content-class="drawer lk-dark sm"
      fullheight
      overlay
      :right="$root.ddRight"
      :open.sync="$root.ddMenu"
    >
      <component :is="$root.ddMenu_content" @close="$root.closeMenu()" />
    </o-sidebar>

    <!-- <o-button
      v-show="fab"
      v-smooth-scroll
      href="#top"
      variant="grey"
      class="totop"
      rounded
    >
      <c-svg class="lg">chevron-up</c-svg>
    </o-button> -->
  </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";

export default {
  mixins: [clickaway],
  data() {
    return {
      fab: false,
    };
  },
  computed: {
    d_class() {
      let d_class = this.$root.drawer_class;
      if (d_class !== null) d_class = " " + d_class;
      return "drawer lk-dark" + d_class;
    },
    d_child_class() {
      let d_class = this.$root.drawer_child_class;
      if (d_class !== null) d_class = " " + d_class;
      return "drawer lk-dark" + d_class;
    },
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
    closeParentDrawer() {
      if (!this.$root.drawer_child) {
        this.$root.closeDrawer(1);
      }
    },
    closeChildDrawer() {
      this.$root.closeDrawer(2);
    },
    scrollTop() {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || document.documentElement.offsetTop || 0;
      this.fab = top > 500;
    },
  },
};
</script>

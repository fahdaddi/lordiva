<template>
  <!-- TODO: o-skeleton in loading -->
  <div v-if="!intersected && !lazy && !blank" v-bind:class="cls">
    <o-skeleton :width="width" :height="height" position="centered" />
  </div>

  <img
    v-else
    :src="intersected || !lazy ? srcImage : blankSrc"
    v-bind:class="cls"
    :width="width"
    :height="height"
    :alt="alt"
    @click="$emit('click')"
  />
</template>
<script>
// size : width x height
export default {
  props: {
    type: {
      type: String,
      default: "none",
    },
    src: {
      type: [String],
      default: null,
    },
    blankSrc: {
      type: String,
      default: require("/static/blank.png"),
    },
    size: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    lazy: {
      type: Boolean,
      default: true,
    },
    blank: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      w: null,
      h: null,

      w_mobile: null,
      h_mobile: null,

      w_desktop: null,
      h_desktop: null,

      bg: null,
      types: this.$root.img_types,
      observer: null,
      intersected: false,
    };
  }, // size="400x300" or "xs"
  computed: {
    cls() {
      if (this.lazy) return this.intersected ? "loaded" : "c-img";
      else return null;
    },
    srcImage() {
      return this.src || this.blankSrc;
    },
    width() {
      if (this.w == 0) return false;
      if (typeof this.w === "object") {
        return this.$device.isDesktop ? this.w.d : this.w.m;
      } else {
        return this.w;
      }
    },
    height() {
      if (this.w == 0) return false;
      if (typeof this.h === "object") {
        return this.$device.isDesktop ? this.h.d : this.h.m;
      } else {
        return this.h;
      }
    },
  },
  created() {
    if (this.size.includes("x")) {
      let wh = this.size.split("x");
      this.w = wh[0];
      this.h = wh[1];
    } else {
      this.w = this.types[this.type]["sizes"][this.size]["width"];
      this.h = this.types[this.type]["sizes"][this.size]["height"];

      this.bg = this.types[this.type]["sizes"][this.size]["bg"];
    }

    if (!this.lazy) this.intersected = true;
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      const image = entries[0];
      if (image.isIntersecting) {
        this.intersected = true;
      }
    });
    this.observer.observe(this.$el);
  },
};
</script>

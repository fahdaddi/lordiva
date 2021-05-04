<template>
  <!-- TODO: o-skeleton in loading -->
  <img
    :key="cls"
    :src="srcImage"
    v-bind:class="cls"
    :width="intersected ? width : width"
    :height="intersected ? height : height"
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
      default: 'none',
    },
    src: {
      type: [Object, String],
      default: null,
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
    ssr: {
      type: Boolean,
      default: false,
    },
    forceRetina: {
      type: Boolean,
      default: false,
    },
    blank: {
      type: String,
      default: '/img/blank.svg',
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
      use_retina: false,
      types: this.$root.img_types,
      observer: null,
      intersected: false,
    }
  }, // size="400x300" or "xs"
  computed: {
    cls() {
      if (this.lazy) return this.intersected ? 'loaded' : 'loading'
      else return null
    },
    image() {
      // IF Logo
      if (this.type && this.type === 'logo')
        return this.src.path + this.src.filename

      if (typeof this.src === 'string') return this.src
      else {
        if (this.src !== null) {
          let options = {
            width: this.width || '0',
            height: this.height || '0',
            type: this.type,
          }
          if (this.bg) options.bg = String(this.bg)
          if (this.use_retina || this.forceRetina) options.retina = true
          if (this.forceRetina) options.forceRetina = true
          options.lazy = this.lazy
          options.blank = this.blank
          if (this.ssr) options.ssr = true
          return this.$root.getImage(
            this.src,
            options,
            this.types[this.type]['format']
          )
        } else return this.blank
      }
    },
    srcImage() {
      if (this.lazy) return this.intersected ? this.image : this.blank
      else return this.image
    },
    width() {
      if (this.w == 0) return false
      if (typeof this.w === 'object') {
        return this.$device.isDesktop ? this.w.d : this.w.m
      } else {
        return this.w
      }
    },
    height() {
      if (this.w == 0) return false
      if (typeof this.h === 'object') {
        return this.$device.isDesktop ? this.h.d : this.h.m
      } else {
        return this.h
      }
    },
  },
  created() {
    if (this.size.includes('x')) {
      let wh = this.size.split('x')
      this.w = wh[0]
      this.h = wh[1]
    } else {
      this.w = this.types[this.type]['sizes'][this.size]['width']
      this.h = this.types[this.type]['sizes'][this.size]['height']

      this.bg = this.types[this.type]['sizes'][this.size]['bg']
      this.use_retina = this.types[this.type]['retina']
    }
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      const image = entries[0]
      if (image.isIntersecting) {
        this.intersected = true
      }
    })
    this.observer.observe(this.$el)
  },
}
</script>

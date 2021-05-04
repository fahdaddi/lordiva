<template>
  <svg
    v-if="support_svg"
    :aria-hidden="ariaHidden"
    class="icon"
    :class="size"
    focusable="false"
    @click="$emit('click', $event)"
  >
    <use :xlink:href="svg + '#' + iconName"></use>
  </svg>
</template>

<script>
export default {
  props: {
    ariaHidden: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: null,
    },
    icon: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      svg: '/img/sprite.svg',
      support_svg: true,
    }
  },
  computed: {
    iconName() {
      var iconName = ''
      if (this.icon.length) iconName = this.icon[1]
      else if (this.name) return this.name
      else if (this.$slots.default)
        iconName = this.$slots.default[0].text.trim()
      return iconName
    },
  },
  mounted() {
    if (typeof SVGRect === 'undefined') {
      this.support_svg = false
    }
  },
}
</script>

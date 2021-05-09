<template>
  <span v-bind:class="['tag', colorClass, smallClass, roundedClass]">
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: null,
    },
    small: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    colorClass() {
      if (this.outlined)
        return this.color ? `tag--outlined--${this.color}` : null;
      return this.color ? `tag--${this.color}` : null;
    },
    smallClass() {
      return this.small ? `tag--small` : null;
    },
    roundedClass() {
      return this.rounded ? "tag--rounded" : null;
    },
  },
};
</script>

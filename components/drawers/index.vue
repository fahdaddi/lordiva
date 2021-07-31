<template>
  <div class="wrap">
    <div class="header" :class="headerClass">
      <slot v-if="hasHeaderSlot" name="header" />
      <span v-else class="box-title">
        {{ title }}
      </span>

      <c-svg
        v-if="closable"
        name="close"
        class="close"
        @click.stop="$emit('close')"
      />
    </div>
    <div class="body" :class="bodyClass">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    hasHeaderSlot: {
      type: Boolean,
      default: false,
    },
    headerClass: {
      type: String,
      default: "",
    },
    bodyClass: {
      type: String,
      default: "",
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

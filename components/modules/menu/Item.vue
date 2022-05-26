<template>
  <li>
    <nuxt-link :to="`/${type}/${item.slug}`" :title="item.name">
      <span>
        {{ item.name }}
      </span>

      <c-svg name="chevron-right" class="baseline sm" />
    </nuxt-link>
  </li>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

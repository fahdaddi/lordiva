<template>
  <li @click.prevent="pushUrl(`/products/${product.slug}`)">
    <c-img
      :src="product.image"
      :alt="product.name"
      size="thumbs"
      type="product"
      blank
    />
    <nuxt-link
      :to="`products/${product.slug}`"
      :title="product.name"
      class="name"
    >
      {{ product.name }}
    </nuxt-link>
    <span v-if="product.brand" class="brand">{{ product.brand.name }}</span>
    <div v-if="product.discount_price" class="price">
      <span class="strike old">{{ price(product.price) }}</span>
      <span class="selling">{{ price(product.discount_price) }}</span>
    </div>
    <div v-else class="price">
      <span class="selling">{{ price(product.price) }}</span>
    </div>
    <o-button size="small" variant="primary" outlined>
      <c-svg class="baseline">cart</c-svg>
      {{ $t("add_to_cart") }}
    </o-button>
  </li>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>

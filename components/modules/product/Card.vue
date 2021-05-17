<template>
  <li @click.prevent="pushUrl(`/products/${product.slug}`)">
    <c-img
      :src="product.img"
      :alt="product.name + ' - ' + product.brand.label"
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
    <span class="brand">{{ product.brand.label }}</span>
    <div class="price">
      <span v-if="product.price.old" class="strike old">{{
        price(product.price.old)
      }}</span>
      <span class="selling">{{ price(product.price.selling) }}</span>
    </div>
    <o-button size="small" variant="primary" outlined>
      <c-svg class="baseline">cart</c-svg>
      {{ $t("add_to_cart") }}
    </o-button>
  </li>
</template>

<script>
export default {
  data() {
    return {
      product: {
        id: 1,
        img:
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
        name: "Explorer II",
        slug: "explorer_2",
        brand: {
          id: 1,
          label: "Rolex",
        },
        price: {
          old: 120,
          selling: 100,
        },
      },
    };
  },
};
</script>

<style></style>

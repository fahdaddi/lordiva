<template>
  <li>
    <c-img
      :src="product.img"
      :alt="product.name + ' - ' + product.brand.label"
      size="thumbs"
      type="product"
    />
    <nuxt-link
      :to="`products/${product.permalink}`"
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
      {{ $t('add_to_cart') }}
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
          'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        name: 'name',
        permalink: 'name',
        brand: {
          id: 1,
          label: 'brand',
        },
        price: {
          old: 120,
          selling: 100,
        },
      },
    }
  },
}
</script>

<style>
</style>
<template>
  <div class="cart mini drop-hover">
    <div class="trigger">
      <c-svg class="link sm baseline">cart</c-svg>

      <template v-if="mounted">
        <div v-if="cart.items.length == 0" class="empty content">
          <c-svg class="empty">empty-cart</c-svg>
          <p>{{ $t("your_cart_is_empty") }}</p>
        </div>

        <ul v-else class="content">
          <li v-for="item in cart.items" :key="item.id">
            <c-img
              :src="item.product.img"
              :alt="item.product.name"
              size="cartMini"
              type="product"
            />

            <div class="details">
              <nuxt-link
                :to="`/products/${item.product.slug}`"
                :title="item.product.name"
              >
                {{ item.product.name }}
              </nuxt-link>

              <span>{{
                `${$t("qty")}: ${item.qty}, ${$t("price")}: ${price(
                  item.total_price
                )}`
              }}</span>
            </div>
          </li>
          <li class="cart-actions">
            <o-button
              expanded
              size="small"
              variant="success"
              tag="nuxt-link"
              to="/checkout/cart"
            >
              {{ $t("view_cart") }}
            </o-button>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    cart() {
      return this.$store.state.cart;
    },
  },
};
</script>

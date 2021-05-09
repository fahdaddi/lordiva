<template>
  <div class="cart drop-hover">
    <div class="trigger">
      <c-svg class="link sm baseline">cart</c-svg>

      <template v-if="mounted">
        <div v-if="!cart.items.length" class="empty content">
          <c-svg class="empty">empty-cart</c-svg>
          <p>{{ $t("your_cart_is_empty") }}</p>
        </div>

        <ul v-else>
          <li>items</li>
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

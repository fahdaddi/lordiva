<template>
  <section class="cart container fw grid grid-cols-12 gap-6">
    <div class="col-span-12 md:col-span-4">
      <div class="box mb-6">
        <div class="box-header px-4">
          <span class="box-title">{{ $t("summary") }}</span>
        </div>

        <div class="p-4">
          <span> {{ $t("total") }}: {{ price(cart.total) }} </span>
        </div>
      </div>

      <div class="box p-4 text-sm">
        {{ $t("free_shipping") }}, {{ $t("monday_to_friday") }}
      </div>
    </div>

    <div class="box card col-span-12 md:col-span-8">
      <div class="box-header px-4">
        <h1 class="box-title">{{ $t("cart") }}</h1>
      </div>

      <ul>
        <li v-for="item in cart.cart_items" :key="item.id">
          <c-img
            :src="item.product.image"
            :alt="item.product.name"
            size="cart"
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
            <span class="block">{{
              `${$t("unit_price")}: ${price(item.price)}`
            }}</span>
          </div>
        </li>
        <li class="cart-actions">
          <o-button
            size="small"
            variant="success"
            tag="nuxt-link"
            to="/checkout/order"
          >
            {{ $t("confirm") }}
          </o-button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  layout: "checkout",
  async asyncData({ app, error }) {
    return app.$axios
      .get("cart")
      .then((res) => {
        return {
          cart: res.data,
        };
      })
      .catch((e) => app.router.app.serverError(e, error));
  },
  created() {
    this.$store.commit("UPDATE_META_TITLE", this.$t("cart"));
  },
};
</script>

<style></style>

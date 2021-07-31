<template>
  <section class="order container fw grid grid-cols-12 gap-6">
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
        <h1 class="box-title">{{ $t("my_address_book") }}</h1>
      </div>

      <transition-group
        name="fade"
        class="address-book p-4 grid grid-cols-12 gap-4"
        tag="ul"
      >
        <!-- <li
          key="new"
          class="new-addr col-span-12 md:col-span-6 lg:col-span-4"
          @click="create()"
        >
          + {{ $t("add_address") }}
        </li> -->

        <li
          v-for="address in addresses"
          :key="address.id"
          class="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <div class="addr-container">
            <ul class="pb-2">
              <li>
                <b>{{ address.f_name }} {{ address.l_name }}</b>
              </li>
              <li>{{ address.phone }}</li>
            </ul>
            <ul>
              <li>{{ address.address_1 }}</li>
              <li v-if="address.address_2">{{ address.address_2 }}</li>
              <li>{{ address.city }}, {{ address.zip }}</li>
            </ul>
            <div class="footer" @click="setMain(address)">
              <o-switch :value="selected" :true-value="address.id" disabled>
                {{ $t("main_address") }}
              </o-switch>
            </div>
          </div>
        </li>
      </transition-group>
      <div class="cart-actions">
        <o-button
          size="small"
          variant="success"
          :disabbled="loading || addresses.length == 0 || !selected"
          @click="order"
        >
          {{ $t("order_verb") }}
        </o-button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: "checkout",
  async asyncData({ app, error, store }) {
    return app.$axios
      .get("addresses")
      .then((res) => {
        return {
          addresses: res.data.addresses,
          cart: store.state.cart,
          selected: null,
          loading: false,
        };
      })
      .catch((e) => app.router.app.serverError(e, error));
  },
  created() {
    this.$store.commit("UPDATE_META_TITLE", this.$t("order_verb"));
    this.setSelected();
  },
  methods: {
    order() {
      this.loading = true;
      this.$axios
        .post("orders", {
          cart_id: this.cart.id,
          address_id: this.selected,
        })
        .then((res) => {
          this.$store.commit("UPDATE_CART_COUNT", 0);
          this.$store.commit("UPDATE_CART_TOTAL", 0);
          this.$store.commit("UPDATE_CART_ID", this.cart.id);
          this.$store.commit("UPDATE_CART", []);
          this.$root.notify(res.data.message, "success");
          this.$router.push("/");
        })
        .catch((e) => this.$root.clientError(e))
        .finally(() => (this.loading = false));
    },
    setMain(address) {
      this.selected = address.id;
    },
    setSelected(id = null) {
      for (const [key, value] of Object.entries(this.addresses)) {
        if (id !== null && id !== 0) {
          this.selected = id;
        } else if (value.main) {
          this.selected = value.id;
        }
      }
    },
  },
};
</script>

<style></style>

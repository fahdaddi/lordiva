<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
    <form
      method="POST"
      novalidate
      autocomplete="off"
      class="grid grid-cols-12 gap-4 gap-y-0"
      @submit.prevent="handleSubmit(update)"
    >
      <OInputValidation
        v-model="user.name"
        class="col-span-12 md:col-span-6"
        :label="$t('fname')"
        :placeholder="placeholders.user.fname"
        maxlength="30"
        vid="fname"
        rules="required|min:2"
      />

      <OInputValidation
        v-model="user.email"
        class="col-span-12 md:col-span-6"
        :label="$t('email')"
        :placeholder="placeholders.user.email"
        maxlength="50"
        type="email"
        vid="email"
        rules="required|email"
      />

      <OInputValidation
        v-model="user.phone"
        class="col-span-12 md:col-span-6"
        :label="$t('phone')"
        :placeholder="placeholders.user.phone"
        maxlength="10"
        min-length="10"
        type="number"
        vid="phone"
      />

      <div class="col-span-12">
        <o-button
          :loading="loading"
          :disabled="loading"
          outlined
          variant="primary"
          native-type="submit"
        >
          {{ $t("save") }}
        </o-button>
      </div>

      <div class="secure-data col-span-12">
        {{ $t("secure_personal_data", { site: $config("site") }) }}.
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  layout: "account",
  async asyncData({ app, error, store }) {
    return app.$axios
      .get("me")
      .then((res) => {
        store.commit("SET_ME", res.data.user);
        store.commit("UPDATE_CART_COUNT", res.data.cart.count);
        this.$store.commit("UPDATE_CART_TOTAL", res.data.cart.total);
        store.commit("UPDATE_CART_ID", res.data.cart.id);
        store.commit("UPDATE_CART", res.data.cart.cart_items);
        return {
          user: res.data.user,
          loading: false,
        };
      })
      .catch((e) => app.router.app.serverError(e, error));
  },
  created() {
    this.$store.commit("UPDATE_META_TITLE", this.$t("my_personal_information"));
  },
  methods: {
    update() {
      this.loading = true;
      this.$axios({
        url: "users/" + this.user.id,
        method: "PUT",
        data: this.user,
      })
        .then((res) => {
          this.$root.notify(res.data.message, "success");
        })
        .catch((e) => {
          this.$refs.observer.setErrors(e.response.data.error);
          this.$root.clientError(e);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style></style>

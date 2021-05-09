<template>
  <div class="account drop-hover">
    <div class="trigger">
      <c-svg class="link sm baseline">user</c-svg>

      <template v-if="mounted">
        <div v-if="user" class="content">
          <o-button variant="success" expanded>{{ $t("signin") }}</o-button>

          <div class="or">or</div>

          <o-button variant="info" outlined expanded>{{
            $t("signup")
          }}</o-button>
        </div>

        <ul v-else class="content">
          <li>
            <nuxt-link to="/account">
              {{ $t("my_account") }}
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/account/orders">
              {{ $tc("my_order", 2) }}
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/account/addresses">
              {{ $t("my_address_book") }}
            </nuxt-link>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.me;
    },
  },
};
</script>

<style></style>

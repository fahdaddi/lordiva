<template>
  <div class="account drop-hover">
    <div class="trigger">
      <c-svg class="link sm baseline">user</c-svg>

      <template v-if="mounted">
        <div v-if="!user" class="content">
          <o-button
            variant="success"
            size="small"
            expanded
            @click="$root.openDrawer('signin', {})"
            >{{ $t("signin") }}</o-button
          >

          <div class="or">or</div>

          <o-button variant="info" size="small" expanded>{{
            $t("signup")
          }}</o-button>
        </div>

        <ul v-else class="content">
          <li>
            <nuxt-link to="/account">
              {{ $t("my_account") }}
            </nuxt-link>
          </li>
          <!-- <li>
            <nuxt-link to="/account/orders">
              {{ $t("my_orders") }}
            </nuxt-link>
          </li> -->
          <li>
            <nuxt-link to="/account/addresses">
              {{ $t("my_address_book") }}
            </nuxt-link>
          </li>

          <li>
            <span class="cursor-pointer text-danger" @click="$root.signout">
              {{ $t("signout") }}
            </span>
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

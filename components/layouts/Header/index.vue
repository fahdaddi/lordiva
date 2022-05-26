<template>
  <header id="header">
    <div class="container">
      <span class="menu" @click="openMenu('Menu')">
        <c-svg class="sm">menu</c-svg>
        <span>{{ $t("menu") }}</span>
      </span>
      <nuxt-link to="/" class="flex items-center">
        <c-img
          class="logo"
          :src="require('/assets/images/logo.png')"
          :lazy="false"
          :alt="$t('logo') + ' ' + $config('site')"
          type="logo"
          size="main"
        />
      </nuxt-link>
      <!-- :size="$device.isMobile ? 'mobile' : 'main'" -->

      <div class="right">
        <Account class="mr-3" />
        <Cart class="mr-3" />
        <c-svg class="link sm" @click="showSearch = true">search</c-svg>
        <transition name="fade" mode="in-out" class="search">
          <SearchForm v-if="showSearch" @close="showSearch = false" />
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
const Account = () => import("~/components/layouts/Header/Elements/Account");
const Cart = () => import("~/components/layouts/Header/Elements/Cart");
const SearchForm = () => import("~/components/layouts/Header/Elements/Search");

export default {
  components: {
    Account,
    Cart,
    SearchForm,
  },
  data() {
    return {
      showSearch: false,
    };
  },
};
</script>

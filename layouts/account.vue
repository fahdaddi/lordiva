<template>
  <div id="main-layout">
    <Common />
    <Header />
    <main id="top" class="main account">
      <section class="container fw">
        <div class="box">
          <nav>
            <div class="header">
              <c-img
                :alt="(user && user.name) || ''"
                :src="default_avatar"
                size="40x40"
              />
              <span v-if="user">{{ user.name }}</span>
            </div>

            <ul>
              <li
                v-bind:class="{
                  active: $route.path == '/account',
                }"
              >
                <nuxt-link to="/account">
                  <c-svg name="user" />
                  <span>
                    {{ $t("my_personal_information") }}
                  </span>
                </nuxt-link>
              </li>
              <li
                v-bind:class="{
                  active: $route.path == '/account/addresses',
                }"
              >
                <nuxt-link to="/account/addresses">
                  <c-svg name="pin" />
                  <span>
                    {{ $t("my_address_book") }}
                  </span>
                </nuxt-link>
              </li>
              <!-- <li
                v-bind:class="{
                  active: $route.path == '/account/orders',
                }"
              >
                <nuxt-link to="/account/orders">
                  <c-svg name="cart" />
                  <span>
                    {{ $t("my_orders") }}
                  </span>
                </nuxt-link>
              </li> -->
            </ul>
          </nav>

          <div class="content">
            <div class="title">
              <!-- <span class="box-title">{{ meta_title }}</span> -->
            </div>

            <nuxt v-if="is_auth" class="p-4" />

            <div v-else class="mt-6 ml-4">
              {{ $t("please_sign_in") }}
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
import Common from "@/components/layouts/common";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default {
  components: {
    Common,
    Header,
    Footer,
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    meta_title() {
      return this.$store.state.meta_title;
    },
    is_auth() {
      return this.$store.state.token;
    },
    user() {
      return this.$store.state.me;
    },
  },
  methods: {},
  head() {
    let path = this.$route.path === "/" ? "" : this.$route.path;
    let canonical = `${this.$config("url")}${path}`;

    let link = [{ rel: "canonical", href: canonical }];
    return {
      htmlAttrs: { lang: this.$config("iso") },
      title: this.meta_title,
      link,
    };
  },
};
</script>

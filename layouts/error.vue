<template>
  <section class="text-center mt-6">
    <div v-if="error.statusCode === 404" class="wrap">
      <h1>{{ $t("page_not_found") }}</h1>
      <p class="body-2 grey-light">
        <nuxt-link to="/">
          <c-svg class="baseline">arrow-left</c-svg>
          {{ $t("homepage") }}
        </nuxt-link>
      </p>
      <c-svg class="error">error-404</c-svg>
    </div>
    <div v-else-if="error.statusCode === 503" class="wrap">
      <h1>{{ $t("will_be_back_soon") }}</h1>
      <c-svg class="error">server-down</c-svg>
    </div>
    <div v-else class="wrap">
      <h1>{{ $t("error_occurred") }}</h1>
      <p class="body-2 grey-light">{{ $t("error_occurred_details") }}</p>
      <c-svg class="error">warning</c-svg>
    </div>
  </section>
</template>

<script>
export default {
  name: "NuxtError",
  layout: "default",
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      title: this.$i18n.t("error_occurred"),
    };
  },
  created() {
    if (this.error.statusCode === 403) this.title = "Error 403";
    else if (this.error.statusCode === 404) this.title = "Error 404";
    else if (this.error.statusCode === 405) this.title = "Error 405";
    else if (this.error.statusCode === 500) this.title = "Error 500";
    else if (this.error.statusCode === 503)
      this.title = this.$i18n.t("will_be_back_soon");
    this.$store.commit("UPDATE_META_TITLE", this.title);
  },
  head() {
    return {
      title: this.title,
      meta: [{ name: "robots", content: "noindex, nofollow" }],
    };
  },
};
</script>

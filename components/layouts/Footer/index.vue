<template>
  <footer>
    <div class="container">
      <section class="top">
        <div class="left">
          <nuxt-link to="/refund-policy">{{ $t("returns_refunds") }}</nuxt-link>
          <span>|</span>
          <nuxt-link to="/privacy-policy">{{ $t("privacy_policy") }}</nuxt-link>
          <span>|</span>
          <nuxt-link to="/terms-conditions">{{
            $t("terms_conditions")
          }}</nuxt-link>
          <span>|</span>
          <nuxt-link to="/contact-us">{{ $t("contact_us") }}</nuxt-link>
        </div>

        <div class="right">
          <a
            :href="$config('socials').facebook"
            aria-label="Facebook"
            target="_blank"
            rel="noopener"
            ><c-svg class="baseline">facebook</c-svg></a
          >
          <a
            :href="$config('socials').instagram"
            name="instagram"
            aria-label="Instagram"
            target="_blank"
            rel="noopener"
            ><c-svg class="baseline">instagram</c-svg></a
          >
          <!-- <c-svg class="baseline"></c-svg> -->
        </div>
      </section>

      <section class="bottom">
        {{
          $t("copyright", {
            year: new Date().getFullYear(),
            site: $config("site"),
          })
        }}
      </section>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

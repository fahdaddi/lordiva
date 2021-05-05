<template>
  <main class="main">
    <div class="text-center mt-6">
      <div v-if="error.statusCode === 404" class="wrap">
        <h1>{{ $t('page_not_found') }}</h1>
        <span class="body-2 grey-light">
          <nuxt-link to="/">
            <c-svg class="baseline">arrow_back</c-svg>
            {{ $t('homepage') }}
          </nuxt-link>
        </span>
        <c-img
          src="/assets/icons/error-404.svg"
          size="600x360"
          alt="Error 404"
          class="er"
        />
      </div>
      <div v-else-if="error.statusCode === 503" class="wrap">
        <h1>{{ $t('will_be_back_soon') }}</h1>
        <c-img
          src="/assets/icons/error-404.svg"
          size="600x360"
          alt="Maintenance"
          class="er"
        />
      </div>
      <div v-else class="wrap">
        <h1>{{ $t('error_occurred') }}</h1>
        <span class="body-2 grey-light">{{
          $t('error_occurred_details')
        }}</span>
        <c-img
          src="~/assets/icons/warning.svg"
          size="600x360"
          alt="Error"
          class="er"
        />
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'NuxtError',
  layout: 'default',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      title: this.$i18n.t('error_occurred'),
    }
  },
  created() {
    if (this.error.statusCode === 403) this.title = 'Error 403'
    else if (this.error.statusCode === 404) this.title = 'Error 404'
    else if (this.error.statusCode === 405) this.title = 'Error 405'
    else if (this.error.statusCode === 500) this.title = 'Error 500'
    else if (this.error.statusCode === 503)
      this.title = this.$i18n.t('will_be_back_soon')
  },
  head() {
    return {
      title: this.title,
      meta: [{ name: 'robots', content: 'noindex, nofollow' }],
    }
  },
}
</script>

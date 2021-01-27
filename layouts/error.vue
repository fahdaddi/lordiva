<template>
  <div class="nuxt-error">
    <!-- <component :is="errorPage" :error="error" /> -->
    <pre>{{ error }}</pre>
  </div>
</template>

<script>
export default {
  name: 'NuxtError',
  layout: 'default', // optional
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<template>
  <div>comming soon</div>
</template>

<script>
export default {
  layout: "account",
  created() {
    this.$store.commit("UPDATE_META_TITLE", this.$t("my_orders"));
  },
};
</script>

<style></style>

<template>
  <Drawer :title="title" @close="$emit('close')">
    <Signin :options="options" @titleUpdate="updateTitle" />
  </Drawer>
</template>

<script>
const Signin = () => import("~/components/forms/Signin");
const Drawer = () => import("~/components/drawers/index");

export default {
  components: { Drawer, Signin },
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      title: this.$i18n.t("signin"),
    };
  },
  methods: {
    updateTitle(title) {
      this.title = title;
    },
  },
};
</script>

<template>
  <Drawer :title="$t('address')" @close="$emit('close')">
    <Address :address="options.address" :profile="$store.state.me" />
  </Drawer>
</template>

<script>
const Address = () => import("~/components/forms/Address");
const Drawer = () => import("~/components/drawers/index");

export default {
  components: { Drawer, Address },
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
};
</script>

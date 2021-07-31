<template>
  <transition-group
    name="fade"
    class="address-book grid grid-cols-12 gap-4"
    tag="ul"
  >
    <li
      key="new"
      class="new-addr col-span-12 md:col-span-6 lg:col-span-4"
      @click="create()"
    >
      + {{ $t("add_address") }}
    </li>

    <li
      v-for="(address, index) in addresses"
      :key="address.id"
      class="col-span-12 md:col-span-6 lg:col-span-4"
    >
      <div class="more-vert">
        <o-dropdown
          aria-role="list"
          position="bottom-left"
          :mobile-modal="false"
        >
          <div slot="trigger" class="sort">
            <c-svg name="more" />
          </div>

          <o-dropdown-item @click="update(address, index)">
            <c-svg name="edit" class="baseline" />
            {{ $t("edit") }}
          </o-dropdown-item>

          <!-- <o-dropdown-item @click="remove(address)">
            <c-svg name="trash" class="baseline danger" />
            {{ $t("delete") }}
          </o-dropdown-item> -->
        </o-dropdown>
      </div>
      <div
        :class="{
          updated: updated_address === address.id,
        }"
        class="addr-container"
      >
        <ul class="pb-2">
          <li>
            <b>{{ address.f_name }} {{ address.l_name }}</b>
          </li>
          <li>{{ address.phone }}</li>
        </ul>
        <ul>
          <li>{{ address.address_1 }}</li>
          <li v-if="address.address_2">{{ address.address_2 }}</li>
          <li>{{ address.city }}, {{ address.zip }}</li>
        </ul>
        <div class="footer" @click="setMain(address)">
          <o-switch v-model="selected" :true-value="address.id">
            {{ $t("main_address") }}
          </o-switch>
        </div>
      </div>
    </li>
  </transition-group>
</template>

<script>
export default {
  layout: "account",
  async asyncData({ app, error, store }) {
    return app.$axios
      .get("addresses")
      .then((res) => {
        return {
          addresses: res.data.addresses,
          updated_address: null,
          deleted_address: null,
          selected: null,
          loading: false,
        };
      })
      .catch((e) => app.router.app.serverError(e, error));
  },
  created() {
    this.$store.commit("UPDATE_META_TITLE", this.$t("my_address_book"));
    this.setSelected();
  },
  mounted() {
    this.$bus.$on("update-address", (address) => {
      this.updated_address = address.id;
      let self = this;
      let index = this.addresses.findIndex((a) => a.id == address.id);
      this.$set(this.addresses, index, address);
      setTimeout(function () {
        self.updated_address = null;
      }, 2000);
    });

    this.$bus.$on("create-address", (address) => {
      this.updated_address = address.id;
      this.addresses.unshift(address);
      let self = this;
      setTimeout(function () {
        self.updated_address = null;
      }, 2000);
    });
  },
  methods: {
    setMain(address) {
      this.$axios
        .patch("addresses/" + address.id, { main: true })
        .then(() => {
          this.selected = address.id;
        })
        .catch((e) => this.$root.clientError(e));
    },
    remove(address) {
      this.$axios
        .delete("addresses/" + address.id)
        .then(() => {
          let addresses = this.addresses.filter((a) => a.id !== address.id);

          this.deleted_address = address.id;

          setTimeout(() => {
            this.$store.commit("UPDATE_ADDRESSES", addresses);
            this.deleted_address = null;
          }, 500);
        })
        .catch((e) => this.$root.clientError(e));
    },
    create() {
      this.$root.openDrawer("addressForm", {
        address: {
          phone: null,
        },
      });
    },
    update(address) {
      let deep_address = { ...address };
      this.$root.openDrawer("addressForm", {
        address: deep_address,
      });
    },
    setSelected(id = null) {
      for (const [key, value] of Object.entries(this.addresses)) {
        if (id !== null && id !== 0) {
          this.selected = id;
        } else if (value.main) {
          this.selected = value.id;
        }
      }
    },
  },
};
</script>

<style></style>

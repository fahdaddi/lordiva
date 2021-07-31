<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
    <form
      class="card grid grid-cols-12 gap-x-3 md:gap-x-6"
      novalidate
      autocomplete="off"
      @submit.prevent="handleSubmit(saveAddress)"
    >
      <OInputValidation
        v-model="myAddress.f_name"
        class="col-span-12"
        :label="$t('fname')"
        :placeholder="placeholders.address.fname"
        maxlength="100"
        vid="f_name"
        rules="required"
      />

      <OInputValidation
        v-model="myAddress.l_name"
        class="col-span-12"
        :label="$tc('name', 1)"
        :placeholder="placeholders.address.lname"
        maxlength="100"
        vid="l_name"
        rules="required"
      />

      <OInputValidation
        v-model="myAddress.address_1"
        class="col-span-12"
        :label="`${$tc('address', 1)} 1`"
        :placeholder="placeholders.address.address_1"
        vid="address_1"
        rules="required"
      />

      <OInputValidation
        v-model="myAddress.address_2"
        class="col-span-12"
        :label="`${$tc('address', 1)} 2`"
        :placeholder="placeholders.address.address_2"
        vid="address_2"
      />

      <OInputValidation
        v-model="myAddress.phone"
        class="col-span-12"
        :label="$t('phone')"
        :placeholder="placeholders.user.phone"
        maxlength="10"
        min-length="10"
        type="number"
        vid="phone"
        rules="required"
      />

      <OInputValidation
        v-model="myAddress.zip"
        class="col-span-12"
        :label="$tc('zip')"
        :placeholder="placeholders.address.zip"
        vid="zip"
        type="number"
      />

      <OInputValidation
        v-model="myAddress.city"
        class="col-span-12"
        :label="$tc('city')"
        :placeholder="placeholders.address.city"
        vid="city"
        rules="required"
      />

      <div class="col-span-12">
        <o-button
          :loading="loading"
          :disabled="loading"
          outlined
          variant="success"
          native-type="submit"
        >
          {{ $t("save") }}
        </o-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  props: {
    address: {
      type: Object,
      default: () => {},
    },
    profile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      method: "POST",
      url: "addresses",
      categories: [],
      myAddress: {
        user_id: this.profile.id,
        f_name: null,
        l_name: null,
        phone: null,
        address_1: null,
        address_2: null,
        zip: null,
        city: null,
      },
    };
  },
  created() {
    if (this.address.id) {
      this.myAddress.f_name = this.address.f_name;
      this.myAddress.l_name = this.address.l_name;
      this.myAddress.phone = this.address.phone;
      this.myAddress.address_1 = this.address.address_1;
      this.myAddress.address_2 = this.address.address_2;
      this.myAddress.zip = this.address.zip;
      this.myAddress.city = this.address.city;

      this.method = "PUT";
      this.url += `/${this.address.id}`;
    }
  },
  methods: {
    saveAddress() {
      this.loading = true;
      this.$axios({
        url: this.url,
        method: this.method,
        data: this.myAddress,
      })
        .then((res) => {
          this.$root.notify(res.data.message, "success");
          if (this.address.id)
            this.$bus.$emit("update-address", res.data.address);
          else this.$bus.$emit("create-address", res.data.address);
          this.$root.closeDrawer();
        })
        .catch((e) => {
          if (e.response.data.error)
            this.$refs.observer.setErrors(e.response.data.error);
          this.$root.clientError(e);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

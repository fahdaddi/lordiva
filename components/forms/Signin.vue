<template>
  <ValidationObserver
    v-if="!mergeable"
    ref="observer"
    v-slot="{ handleSubmit }"
    class="wrap"
    tag="div"
  >
    <transition-group name="fade-in">
      <form
        v-if="signin_form"
        key="signin"
        class="signin"
        method="POST"
        novalidate
        @submit.prevent="handleSubmit(login)"
      >
        <OInputValidation
          v-model="email"
          :label="$t('email')"
          :placeholder="placeholders.user.email"
          type="email"
          maxlength="50"
          vid="email"
          rules="required|email"
        />

        <OInputValidation
          v-model="password"
          class="relative"
          :label="$t('password')"
          :placeholder="placeholders.user.password"
          type="password"
          maxlength="50"
          vid="password"
          rules="required"
          :message="signin_error_message"
          password-reveal
          expanded
        >
          <span class="link forgot" @click.stop="signin_form = !signin_form">{{
            $t("forgotten")
          }}</span>
        </OInputValidation>

        <o-button
          :loading="auth_loading"
          :disabled="auth_loading"
          variant="success"
          native-type="submit"
          class="mt-1"
        >
          {{ $t("signin") }}
        </o-button>
      </form>
      <form
        v-else
        key="reset"
        class="reset content"
        novalidate
        autocomplete="off"
        @submit.prevent="handleSubmit(reset)"
      >
        <p class="intro">{{ $t("enter_email_to_reset_password") }}</p>
        <OInputValidation
          v-model="email"
          class="relative"
          :label="$t('email')"
          :placeholder="placeholders.user.email"
          type="email"
          maxlength="50"
          vid="email"
          rules="required|email"
          :message="reset_msg"
          expanded
        >
          <span class="link forgot" @click.stop="signin_form = !signin_form">
            <c-svg name="arrow_back" class="mr-1" /> {{ $t("return") }}
          </span>
        </OInputValidation>

        <o-button
          :loading="reset_loading"
          :disabled="reset_loading"
          variant="success"
          native-type="submit"
          class="mt-1"
        >
          {{ $t("reset_password") }}
        </o-button>
      </form>
    </transition-group>
  </ValidationObserver>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      auth_loading: false,
      email: "",
      password: "",
      signin_form: true,
      signin_error_message: "",
      reset_msg: null,
      reset_loading: false,
    };
  },
  computed: {
    mergeable() {
      return this.$store.state.merge;
    },
  },
  watch: {
    signin_form() {
      this.updateTitle();
    },
    mergeable() {
      this.updateTitle();
    },
  },
  methods: {
    updateTitle() {
      this.$emit(
        "titleUpdate",
        this.$t(
          this.mergeable
            ? "my_cart"
            : this.signin_form
            ? "signin"
            : "reset_password"
        )
      );
    },
    async login() {
      this.auth_loading = true;
      this.$axios
        .post("login", { email: this.email, password: this.password })
        .then((res) => {
          this.$store.commit("SET_AUTH_TOKEN", res.data.token);
          this.$root.signin(res.data.token);

          this.$root.getUser();
        })
        .catch((e) => {
          if (e.response && e.response.data.message) {
            const message = e.response.data.message;
            const code = parseInt(e.response && e.response.status);
            if ((code && code === 401) || message)
              this.signin_error_message = message;
          }
          this.auth_loading = false;
        });
    },
    reset() {
      this.reset_loading = true;
      this.$axios
        .post("me/password/request", { email: this.email })
        .then(() => {
          this.$root.notify(
            this.$t("email_sent_to_x", { email: this.email }),
            "success"
          );

          this.$root.closeDrawer();
        })
        .catch((e) => {
          const code = parseInt(e.response && e.response.status);
          if (e.response.data && code) {
            const message = e.response.data.message;
            if (code === 404) {
              this.reset_msg = message;
            } else this.$root.clientError(e);
          }
        })
        .finally(() => (this.reset_loading = false));
    },
  },
};
</script>

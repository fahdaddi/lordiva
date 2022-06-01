import Vue from "vue";
import Cookie from "js-cookie";
import placeholders from "~/assets/js/placeholders";

Vue.mixin({
  data() {
    return {
      placeholders,

      blank_img: require("/static/blank.png"),
      default_logo: require("/static/android-chrome-192x192.png"),
      default_avatar: require("/assets/images/avatar.png"),

      // images types & sizes
      img_types: {
        logo: {
          format: { default: "svg", fallback: "svg" },
          sizes: {
            main: { width: "40px", height: "40px" },
          },
        },
        home: {
          format: { default: "webp", fallback: "jpg" },
          sizes: {
            slider: {
              width: { d: "1320", m: "310" },
              height: { d: "440", m: "180" },
            },
            main: { width: "380", height: "500" },
          },
        },
        product: {
          format: { default: "webp", fallback: "jpg" },
          sizes: {
            views: { width: "55", height: "55" },
            cartMini: { width: "80", height: "80" },
            cart: { width: "120", height: "120" },
            thumbs: { width: "180", height: "180" },
            main: { width: "600", height: "600" },
            large: { width: "1000", height: "1000" }, // also used in the xml sent to CAR & shopping feed
          },
        },
        brand: {
          format: { default: "webp", fallback: "png" },
          sizes: {
            list: { width: "62", height: "28", bg: "0" },
          },
        },
      },

      mounted: false,
    };
  },
  errorCaptured(e, vm, details) {
    // if (process.env.NODE_ENV === "development") console.log(e, vm, details);
    // Send captured error
    return false;
  },
  mounted() {
    this.mounted = true;
  },
  methods: {
    pushUrl(urlName, params = null, query = null) {
      this.$router.push(this.getUrl(urlName, params, query));
    },
    getUrl(urlName, params = null, query = null) {
      let routeParams = {};
      if (params !== null) routeParams = Object.assign(params, routeParams);

      return this.localePath({
        name: urlName,
        params: routeParams,
        query: query,
      });
    },
    view(name) {
      return () => import("~/components/" + name + ".vue");
    },
    serverError(e, error) {
      const code = parseInt(e.response && e.response.status);
      const message = e.message;

      if (code === 404)
        error({
          statusCode: 404,
        });
      else if (code === 500)
        error({
          statusCode: 500,
        });
      // Only for account/reset-password && account/verify
      else if (code === 400)
        error({
          statusCode: 400,
          message,
        });
      else if (code === 422)
        error({
          statusCode: 422,
          message,
        });
      else if (code === 429)
        error({
          statusCode: 429,
          message,
        });
    },
    clientError(e) {
      if (e) {
        const code = parseInt(e.response && e.response.status);
        let message = e.message;
        if (e.response && e.response.data && e.response.data.message !== null) {
          message = e.response.data.message;
        }

        if (code) {
          // if(code === 400) this.notify(message, 'error')
          if (code === 404) this.notify(message, "error");
          else if (code === 422) this.notify(message, "error");
          else if (code === 401) this.openDrawer("signin");
        }
      }
    },
    // Footer
    submitNewsletterForm() {
      this.newsletter_loading = true;
      this.$validator.validateAll().then((result) => {
        if (result) {
          const that = this;
          this.$axios
            .post("newsletter", {
              email: this.newsletter_email,
            })
            .then((res) => {
              let msg = "";
              if (res.status === 201) {
                msg = that.$i18n.t("thank_you_for_your_subscription");
                that.$root.notify(msg, "success");
              } else if (res.status === 204) {
                msg = that.$i18n.t("already_subscribed_to_newsletter");
                that.$root.notify(msg, "success");
              } else if (res.data.voucher) {
                msg =
                  that.$i18n.t("thank_you_for_your_subscription") +
                  ". " +
                  that.$i18n.t("your_promotional_code_is") +
                  " " +
                  res.data.voucher.label;
                that.$root.notify(msg, "success", 0);
              } else {
                msg = that.$i18n.t("thank_you_for_your_subscription");
                that.$root.notify(msg, "success");
              }

              // Clear and reset form
              that.newsletter_email = "";
              that.$validator.reset();
            })
            .catch((e) => this.$root.clientError(e))
            .finally(() => (this.newsletter_loading = false));
        }
      });
    },
    removeSignedUser() {
      Cookie.remove("token");
      Cookie.remove("c_token");
      if (this.$app.$route.name.includes("checkout-cart")) {
        window.location.reload();
      } else {
        this.$store.commit("SET_AUTH_TOKEN", null);
        this.$store.commit("SET_ME", null);
        this.$store.commit("UPDATE_CART_COUNT", 0);
        this.$store.commit("UPDATE_CART_TOTAL", 0);
        this.$store.commit("UPDATE_CART_ID", null);
        this.$store.commit("UPDATE_CART", []);
      }
    },
    // update cart in store if updateCart:true.
    signin(token) {
      Cookie.set("token", token);
    },
    getUser() {
      this.$axios.get("me").then((res) => {
        this.$store.commit("SET_ME", res.data.user);
        this.$store.commit("UPDATE_CART_COUNT", res.data.cart.count);
        this.$store.commit("UPDATE_CART_TOTAL", res.data.cart.total);
        this.$store.commit("UPDATE_CART_ID", res.data.cart.id);
        this.$store.commit("UPDATE_CART", res.data.cart.cart_items);

        this.$root.closeDrawer();
        this.auth_loading = false;
      });
    },
    signout() {
      this.$axios
        .get("logout")
        .then(() => {
          Cookie.remove("token");
          Cookie.remove("c_token");
          window.location.reload();
        })
        .catch((e) => this.$root.clientError(e));
    },
    getErrorMessage(error) {
      return error.msg;
    },
    // options : size(120x120), type(logo, product...), lazy: true/false, browserTests: true/false
    price(amount, currency, scale, decimalPoint, thousandsSep) {
      amount = amount * 1; // makes sure `number` is numeric value
      const str = amount
        .toFixed(scale || this.$config("price_scale"))
        .toString()
        .split(".");
      // eslint-disable-next-line prefer-const
      let parts = [];
      for (let i = str[0].length; i > 0; i -= 3) {
        parts.unshift(str[0].substring(Math.max(0, i - 3), i));
      }
      str[0] = parts.join(decimalPoint || this.$config("thousands_sep"));
      let formattedPrice = str.join(
        thousandsSep || this.$config("decimal_point")
      );

      formattedPrice = this.$config("price_format").replace(
        "{price}",
        formattedPrice
      );
      formattedPrice = formattedPrice.replace(
        "{currency}",
        currency || this.$config("currency_symbol")
      );

      return formattedPrice;
    },
    notify(content, color, timeout = 5000) {
      let icon =
        color == "success"
          ? "checkmark-circle"
          : color == "danger"
          ? "exclamation-triangle"
          : "info-circle";
      this.$oruga.notification.open({
        message: content,
        variant: color,
        type: color,
        hasIcon: true,
        icon: icon,
        iconSize: "notif-small",
        position: "bottom-right",
        duration: timeout,
      });
    },
  },
});

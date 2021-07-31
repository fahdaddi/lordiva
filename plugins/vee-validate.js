import Vue from "vue";
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize,
} from "vee-validate";

import { required, confirmed, email, min } from "vee-validate/dist/rules";

import fr from "vee-validate/dist/locale/fr.json";
import it from "vee-validate/dist/locale/it.json";

const OInputWithValidation = () =>
  import("~/components/common/OInputWithValidation");
const OAutocompleteWithValidation = () =>
  import("~/components/common/OAutocompleteWithValidation");

// Install English and Arabic locales.
localize({
  fr,
  it,
});

Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("OInputValidation", OInputWithValidation);
Vue.component("OAutocompleteValidation", OAutocompleteWithValidation);

export default ({ app }) => {
  extend("valid_email", {
    message: (fieldName) => {
      return app.i18n.t("x_already_exists", {
        field: fieldName,
      });
    },

    validate(value) {
      if (value) {
        return app.$axios
          .head("me/" + value + "/check")
          .then(() => {
            return true;
          })
          .catch((e) => {
            const code = parseInt(e.response && e.response.status);
            if (code === 409) return false;
          });
      } else {
        return false;
      }
    },
  });

  extend("valid_password", {
    message: (fieldName) => {
      return app.i18n.t("x_is_incorrect", {
        field: fieldName,
      });
    },
    validate(value) {
      if (value) {
        return app.$axios
          .head("me/password/" + value + "/check")
          .then(() => {
            return true;
          })
          .catch((e) => {
            const code = parseInt(e.response && e.response.status);
            if (code === 409) return false;
          });
      } else {
        return false;
      }
    },
  });

  extend("required", {
    ...required,
  });

  extend("confirmed", {
    ...confirmed,
  });

  extend("email", {
    ...email,
  });

  extend("min", {
    ...min,
  });
};

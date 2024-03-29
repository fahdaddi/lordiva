import locales from "assets/js/locales";
import { localize } from "vee-validate";

export default async ({ app, req }, inject) => {
  let locale = app.i18n.locales.filter((i) => i.code === app.i18n.locale);
  localize(locale[0].code.substr(0, 2));

  let config_tld = locale[0];
  let lang_country = config_tld && config_tld.iso.split("-");
  if (config_tld) {
    let url = process.server ? req.headers.host : window.location.host;
    config_tld.lang = lang_country && lang_country[0];
    config_tld.country_iso = lang_country[1];
    locales.global_rich_snippets = {
      "@context": "https://schema.org",
      "@type": "Organization",

      url: url,
      logo: url + require("/static/logo.png"),
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: config_tld.phone,
          contactType: "customer service",
        },
      ],
    };
  }

  let config = { ...locales, ...config_tld };
  inject("config", (string) => config[string]);
};

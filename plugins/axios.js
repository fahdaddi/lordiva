export default function ({ app, $axios, req, redirect, store }) {
  // server side
  // $axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

  $axios.onError((e) => {
    const code = parseInt(e.response && e.response.status);
    if (code === 404 && e.response.data.redirect)
      if (req) return redirect(301, e.response.data.redirect);
      else window.location.replace(e.response.data.redirect);

    if (e.response.data && code) {
      const message = e.response.data.message;
      if (code === 400) app.router.app.notify(message, "danger");
      else if (code === 429) app.router.app.notify(message, "danger");
    }
  });
  $axios.onRequest(() => {
    if (store.state.token)
      $axios.defaults.headers.common["Authorization"] =
        "Bearer " + store.state.token;
  });
}

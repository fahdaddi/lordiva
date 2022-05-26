// import Vue from "vue";
// import Cookie from "js-cookie";
export const strict = false;

export const state = () => ({
  meta_title: "",
  me: null,
  token: null,
  menu: null,
  cart: {
    items: [],
    total: 0,
    count: 0,
  },
});

export const getters = {};

export const mutations = {
  UPDATE_META_TITLE(state, data) {
    state.meta_title = data;
  },
  SET_ME(state, account) {
    state.me = account;
  },
  SET_AUTH_TOKEN(state, token) {
    state.token = token;
  },
  SET_MENU(state, data) {
    state.menu = data;
  },
  UPDATE_CART_COUNT(state, number) {
    state.cart.count = number;
  },
  UPDATE_CART_TOTAL(state, number) {
    state.cart.total = number;
  },
  UPDATE_CART_ID(state, id) {
    state.cart.id = id;
  },
  UPDATE_CART(state, items) {
    state.cart.items = items;
  },
};

export const actions = {
  async nuxtServerInit({ commit }, { req, app }) {
    console.log(req.headers);
    const cookie = req.headers.cookie ? req.headers.cookie.split(";") : null;
    for (let i = 0; i < cookie.length; ++i) {
      if (cookie[i].trim().match("^token=")) {
        commit("SET_AUTH_TOKEN", cookie[i].replace(`token=`, "").trim());
        app.$axios
          .get("me")
          .then((res) => {
            commit("SET_ME", res.data.user);
            commit("UPDATE_CART_COUNT", res.data.cart.count);
            commit("UPDATE_CART_TOTAL", res.data.cart.total);
            commit("UPDATE_CART_ID", res.data.cart.id);
            commit("UPDATE_CART", res.data.cart.cart_items);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  },
};

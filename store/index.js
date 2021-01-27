import Vue from 'vue'
import Cookie from 'js-cookie'
export const strict = false

export const state = () => ({
  skeleton: null,
  menu: [],
  brands: {},
  page_loading: false,
  store_category_loading: false,
  global_loading: false,
  checkout_loading: true,
  payment_loading: false,
  cart_loading: true,
  order_paid: 'inProgress',
  selected_payment_mean: {
    id: null,
    crypted: null
  },
  payment_confirmation_loading: false,
  payment_step: null,
  accessToken: null,
  c_token: null,
  payment_token: null,
  auth_token: null,
  auth_expires: null,
  tld: 'frFR',
  locales: ['en', 'fr'],
  locale: 'fr',
  amphtml: false,
  cart_count: 0,
  me: null,

  reviews: null,

  // Store variables
  product_page: null,
  pack_page: null,
  account_page: null,
  pack_avs: null,
  products: [],
  packs: [],

  /**
   * order : carriers, deals, user, shipping_address
   */

  order: null,
  carriers: [],
  deals: [],
  cart: null,
  dump_cart: null,
  merge: false,
  addresses: null,
  countries: null,
  confirmation: null,
  payment_means: [],

  // universal variables
  trustbox: null,
  drawer_loading: false,
  reference_loaded: false,

  supportWebp: true,
  isRetina: false,

  countdown: null,

  // Storelocation ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  userLocation: {},
  selectedLocation: {},
  selectedStore: null,
  stores: []
})

export const getters = {
  getUser (state) {
    return state.me
  },
  getMergeable (state) {
    return state.merge
  },
  getLocale (state) {
    return state.locale
  },

  // StoreLocation
  userLocation (state) {
    return state.userLocation
  },
  selectedLocation (state) {
    return state.selectedLocation
  },
  selectedStore (state) {
    return state.selectedStore
  },
  stores (state) {
    return state.stores
  },
  getStoreById (state) {
    return Ref => {
      return state.stores.find(item => {
        return item.ref === Ref
      })
    }
  },

  mapIcons (state) {
    return state.mapIcons
  }
}

export const mutations = {
  UPDATE_SKELETON (state, data) {
    state.skeleton = data
  },
  SET_MENU (state, data) {
    state.menu = data
  },
  SET_BRANDS (state, data) {
    state.brands = data
  },
  SET_AUTH_TOKEN (state, token) {
    state.auth_token = token
  },
  SET_AUTH_EXPIRES (state, expires) {
    state.auth_expires = expires
  },
  SET_C_TOKEN (state, token) {
    state.c_token = token
  },
  SET_PAYMENT_TOKEN (state, token) {
    state.payment_token = token
  },
  SET_PAYMENT_PAID (state, value) {
    state.order_paid = value
  },
  SELECTED_PAYMENT_MEAN (state, value) {
    state.selected_payment_mean = value
  },
  SET_PAYMENT_STEP (state, value) {
    state.payment_step = value
  },
  UPDATE_PAYMENT_CONFIRMATION_LOADING (state, value) {
    state.payment_confirmation_loading = value
  },
  UPDATE_PAYMENT_LOADING (state, value) {
    state.payment_loading = value
  },
  UPDATE_PAGE_LOADING (state, value) {
    state.page_loading = value
  },
  UPDATE_STORE_CATEGORY_LOADING (state, value) {
    state.store_category_loading = value
  },

  SET_ME (state, data) {
    state.me = data
  },
  SET_LOCALE (state, data) {
    state.locale = data
  },
  SET_AMPHTML (state, data) {
    state.amphtml = data
  },

  UPDATE_ADDRESSES (state, data) {
    state.addresses = data
  },
  REMOVE_ADDRESS (state, index) {
    Vue.delete(state.addresses, index)
  },
  UPDATE_CART_COUNT (state, data) {
    state.cart_count = data
  },
  ACTIVE_CART_CHECKOUT (state) {
    state.cart.checkout = true
  },

  // CART MUTATIONS
  UPDATE_CART (state, data) {
    state.cart = data
  },
  UPDATE_DUMP_CART (state, data) {
    state.dump_cart = data
  },
  UPDATE_CART_SUBTOTAL (state, data) {
    state.cart.subtotal = data
  },
  UPDATE_CART_SUMMARY (state, data) {
    state.cart.summary = data
  },
  UPDATE_CART_CARRIER (state, data) {
    state.cart.carrier = data
  },
  UPDATE_CART_SHIPPING_MSG (state, data) {
    state.cart.shipping_msg = data
  },
  DELETE_CART_ITEM (state, index) {
    Vue.delete(state.cart.items, index)
  },
  UPDATE_CART_ITEMS (state, data) {
    // data = {prod_ref_id : prod_ref_id, details: cart.details}
    if (data !== null) state.cart.items[data.index] = data.item
    else state.cart.items = null
  },
  UPDATE_CART_DISCOUNT (state, discount) {
    state.cart.discount = discount
  },
  SET_MERGE (state, bool) {
    state.merge = bool
  },

  // PRODUCT MUTATIONS
  UPDATE_REF_LOADING (state, data) {
    state.reference_loaded = data
  },
  SET_PRODUCT_PAGE (state, data) {
    state.product_page = data
  },
  SET_PRODUCT_RICH_SNIPPETS (state, data) {
    state.product_page.rich_snippets = data
  },
  UPDATE_PRODUCT_REFERENCE (state, data) {
    state.product_page.reference = data
  },

  // Reviews
  SET_REVIEWS (state, data) {
    state.reviews = data
  },
  UPDATE_REVIEWS_LIST (state, data) {
    state.reviews.list = data
  },
  UNSHIFT_REVIEWS_LIST (state, review) {
    const list = JSON.parse(JSON.stringify(state.reviews.list))
    list.unshift(review)
    state.reviews.list = list
  },
  UPDATE_REVIEWS_LIST_LENGTH (state, data) {
    state.reviews.num_reviews = data
  },
  UPDATE_REVIEWS_RATING (state, data) {
    state.reviews.rating = data
  },
  UPDATE_REVIEWS_BREAKDOWN (state, data) {
    state.reviews.breakdown = data
  },
  UPDATE_REVIEWS_PAGE_NUMBER (state, data) {
    state.reviews.page_num = data
  },
  UPDATE_REVIEWS_FILTERS (state, data) {
    state.reviews.filters = data
  },
  UPDATE_ENDPOINT_RESULT (state, data) {
    state.reviews.endpoint_result = data
  },

  // ORDER MUTATIONS

  UPDATE_CARRIERS (state, data) {
    state.carriers = data
  },
  UPDATE_PICKUP (state, data) {
    state.order.pickup = data
  },
  UPDATE_ORDER_SHIPPING_ADDRESS (state, data) {
    state.order.shipping_address = data
  },
  SET_ORDER_REVIEWS_PRODUCTS (state, data) {
    state.order_reviews.products = data
  },
  SET_ORDER_REVIEWS_USER_ID (state, data) {
    state.order_reviews.user_id = data
  },
  SET_ORDER_REVIEWS_ORDER_ID (state, data) {
    state.order_reviews.order_id = data
  },
  SET_DEALS (state, data) {
    state.deals = data
  },
  UPDATE_ORDER (state, data) {
    state.order = data
  },
  UPDATE_TOTAL_ORDER (state, data) {
    state.order.total = data
  },

  // OTHER MUTATIONS
  UPDATE_LOADING (state, data) {
    state.global_loading = data
  },

  UPDATE_CHECKOUT_LOADING (state, data) {
    state.checkout_loading = data
  },
  UPDATE_CART_LOADING (state, data) {
    state.cart_loading = data
  },
  UPDATE_COUNTRIES (state, data) {
    state.countries = data
  },
  UPDATE_DRAWER_LOADING (state, data) {
    state.drawer_loading = data
  },
  SET_PAYMENT_MEANS (state, data) {
    state.payment_means = data
  },
  SET_CONFIRMATION (state, data) {
    state.confirmation = data
  },
  UPDATE_COUNT_DOWN (state, data) {
    state.countdown = data
  },

  // PAGES MUTATIONS
  SET_PACK_PAGE (state, data) {
    state.pack_page = data
  },
  SET_PACK_AVS (state, data) {
    state.pack_avs = data
  },
  SET_ACCOUNT_TITLE (state, data) {
    state.account_page = data
  },

  UPDATE_SUPPORT_WEBP (state, data) {
    state.supportWebp = data
  },
  UPDATE_IS_RETINA (state, data) {
    state.isRetina = data
  },
  SET_TRUSTBOX (state, data) {
    state.trustbox = data
  },

  // Storelocation ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  SET_USER_LOCATION (state, location) {
    state.userLocation = location
  },
  SET_SELECTED_LOCATION (state, location) {
    state.selectedLocation = location
  },
  SET_STORES (state, stores) {
    state.stores = stores
  },
  SET_SELECTED_STORE (state, store) {
    state.selectedStore = store
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req, query, app, error }) {
    // commit('SET_BASEURL', app.$route.path)
    if (req) {
      if (req.headers.cookie) {
        const cookie = req.headers.cookie.split(';')
        for (let i = 0; i < cookie.length; ++i) {
          if (cookie[i].trim().match('^token=')) {
            commit('SET_AUTH_TOKEN', cookie[i].replace(`token=`, '').trim())
          }
          if (cookie[i].trim().match('^c_token=')) {
            commit('SET_C_TOKEN', cookie[i].replace(`c_token=`, '').trim())
          }
        }
      }
    }

    app.router.app.addTokens(app.$axios, {
      auth_token: this.state.auth_token,
      c_token: this.state.c_token
    })

    // try {
    //   let amp = ''
    //   if (query && query.amp === 1) amp = '?amp=1'
    //   const init = await app.$axios.get('init' + amp)
    //   const data = init.data
    //   console.log(data)
    //   commit('UPDATE_CART_COUNT', data.count.cart)
    //   commit('SET_ME', data.user)
    //   commit('SET_AUTH_EXPIRES', data.token.expires)
    //   commit('SET_MENU', data.nav)
    //   commit('SET_BRANDS', data.brands)
    //   commit('SET_TRUSTBOX', data.trustbox)
    // } catch (e) {
    //   app.router.app.serverError(e, error)
    // }
  },
  getReviews ({ commit }, params) {
    const prodId = params.id
    const filters = params.filters

    if (filters !== null) commit('UPDATE_REVIEWS_FILTERS', filters)

    const selectedFilters =
      this.state.reviews.filters == null ? '' : '/' + this.state.reviews.filters

    if (filters) commit('UPDATE_REVIEWS_PAGE_NUMBER', 1)
    else commit('UPDATE_REVIEWS_PAGE_NUMBER', this.state.reviews.page_num + 1)

    this.$axios
      .get(
        'products/' +
          prodId +
          '/reviews/' +
          this.state.reviews.page_num +
          selectedFilters
      )
      .then(
        response => {
          if (filters === null) {
            const reviewsList = this.state.reviews.list
              ? this.state.reviews.list
              : []
            commit('UPDATE_ENDPOINT_RESULT', response.data.length)
            const reviews = reviewsList.concat(response.data)
            commit('UPDATE_REVIEWS_LIST', reviews)
            // commit('UPDATE_REVIEWS_PAGE_NUMBER', this.state.reviews.page_num + 1)
          } else {
            commit('UPDATE_REVIEWS_LIST', response.data)
          }
          commit('UPDATE_LOADING', false)
        },
        error => {
          // eslint-disable-next-line no-undef
          reject(error)
          // http failed, let the calling function know that action did not work out
        }
      )
  },
  fetchCountries ({ commit }, type) {
    this.$axios
      .get('countries')
      .then(response => {
        commit('UPDATE_COUNTRIES', response.data)
      })
      .catch(e => this.$root.clientError(e))
  },
  // eslint-disable-next-line require-await
  async fetchCart ({ commit }, type) {
    if (this.state.auth_token)
      this.$axios.defaults.headers.common.jwtAuthorization = this.state.auth_token
    if (this.state.c_token)
      this.$axios.defaults.headers.common['C-Token'] = this.state.c_token

    if (type === 'cart') type = null
    commit('UPDATE_CART_LOADING', true)
    this.$axios
      .get('cart', {
        params: {
          type
        }
      })
      .then(cart => {
        commit('UPDATE_CART', cart.data)
        commit('UPDATE_CART_COUNT', cart.data.count.cart)
        commit('UPDATE_CART_LOADING', false)
      })
      .catch(e => {
        commit('UPDATE_CART', { items: [] })
        commit('UPDATE_CART_COUNT', 0)
        commit('UPDATE_CART_LOADING', false)
      })
  },
  getCookie (params) {
    // if server
    const req = params.req
    const cookieName = params.name
    if (req) {
      if (req.headers.cookie) {
        const cookie = req.headers.cookie.split(';')
        for (let i = 0; i < cookie.length; ++i) {
          if (cookie[i].trim().match('^' + cookieName + '=')) {
            const cookieValue = cookie[i].replace(`${cookieName}=`, '').trim()
            return cookieValue
          }
        }
        return null
      }
    }
    // if client
    if (process.client) {
      return Cookie.get(cookieName)
    }
  },

  // Storelocation ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updateUserLocation ({ commit }, payload) {
    // TODO: need to add function to detect user location using google maps location ws
    commit('SET_USER_LOCATION', payload)
  },
  updateSelectedStore ({ commit }, payload) {
    commit('SET_SELECTED_STORE', payload)
    // let store = this.state.stores.filter(s => s.ref === payload);
    // commit("SET_SELECTED_LOCATION", store[0]);
  }
}

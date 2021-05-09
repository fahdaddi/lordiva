import Vue from 'vue'
import Cookie from 'js-cookie'
export const strict = false

export const state = () => ({
  meta_title: '',
  me: null,
  token: null,
  cart: {
    items: [],
    count: 0
  }
})

export const getters = {}

export const mutations = {
  UPDATE_META_TITLE (state, data) {
    state.meta_title = data
  },
  SET_ME (state, account) {
    state.me = account
  },
  SET_AUTH_TOKEN (state, token) {
    state.token = token
  },
  UPDATE_CART_COUNT (state, number) {
    state.cart.count = number
  },
  UPDATE_CART (state, items) {
    state.cart.items = items
  }
}

export const actions = {
  async nuxtServerInit ({ commit }, { req, app }) {
    // commit('SET_BASEURL', app.$route.path)
    if (req) {
      if (req.headers.cookie) {
        const cookie = req.headers.cookie.split(';')
        for (let i = 0; i < cookie.length; ++i) {
          if (cookie[i].trim().match('^token=')) {
            commit('SET_AUTH_TOKEN', cookie[i].replace(`token=`, '').trim())
          }
        }
      }
    }
  },
  // getReviews({ commit }, params) {
  //   const prodId = params.id
  //   const filters = params.filters

  //   if (filters !== null) commit('UPDATE_REVIEWS_FILTERS', filters)

  //   const selectedFilters =
  //     this.state.reviews.filters == null ? '' : '/' + this.state.reviews.filters

  //   if (filters) commit('UPDATE_REVIEWS_PAGE_NUMBER', 1)
  //   else commit('UPDATE_REVIEWS_PAGE_NUMBER', this.state.reviews.page_num + 1)

  //   this.$axios
  //     .get(
  //       'products/' +
  //         prodId +
  //         '/reviews/' +
  //         this.state.reviews.page_num +
  //         selectedFilters
  //     )
  //     .then(
  //       (response) => {
  //         if (filters === null) {
  //           const reviewsList = this.state.reviews.list
  //             ? this.state.reviews.list
  //             : []
  //           commit('UPDATE_ENDPOINT_RESULT', response.data.length)
  //           const reviews = reviewsList.concat(response.data)
  //           commit('UPDATE_REVIEWS_LIST', reviews)
  //           // commit('UPDATE_REVIEWS_PAGE_NUMBER', this.state.reviews.page_num + 1)
  //         } else {
  //           commit('UPDATE_REVIEWS_LIST', response.data)
  //         }
  //         commit('UPDATE_LOADING', false)
  //       },
  //       (error) => {
  //         // eslint-disable-next-line no-undef
  //         reject(error)
  //         // http failed, let the calling function know that action did not work out
  //       }
  //     )
  // },
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
  }
}

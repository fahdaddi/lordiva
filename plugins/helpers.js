import Vue from 'vue'
import Cookie from 'js-cookie'

Vue.mixin({
  data () {
    return {
      count_down_interval: null,

      tld: null,
      blank_img: '/img/blank.svg',
      cdn: process.env.CDN,
      // Header
      qty: 0,
      total_qty: 0,
      cart_loaded: false,
      dialog_title: '',

      ddMenu: false,
      ddMenu_content: '',

      drawer: false,
      drawer_loading: true,
      drawer_content: '',
      drawer_width: 'md',
      drawer_class: 'md',
      drawer_options: {},

      dialog: {
        width: 500,
        open: false,
        loading: false,
        persistent: false,
        fullscreen: false,
        hide_overlay: true,
        transition: ''
      },
      dialog_content: '',
      dialog_options: {},

      confirm_deleting: false,
      snackbar: {
        show: false,
        content: null,
        color: 'info'
      },
      badge_data: {
        value: '!'
      },

      // Footer
      newsletter_msg: '',
      newsletter_valid: true,
      newsletter_loading: false,
      newsletter_email: '',

      // images types & sizes
      img_types: {
        logo: {
          format: { default: 'svg', fallback: 'svg' },
          retina: true,
          sizes: {
            main: { width: '90', height: '34' },
            checkout: { width: '75', height: '28' },
            mobile: { width: '80', height: '30' }
          }
        },
        home: {
          format: { default: 'webp', fallback: 'jpg' },
          retina: true,
          sizes: {
            slider: {
              width: { d: '1320', m: '310' },
              height: { d: '440', m: '180' }
            },
            main: { width: '380', height: '500' },
            tcat1: {
              width: { d: '872', m: '310' },
              height: { d: '450', m: '180' }
            },
            tcat2: {
              width: { d: '424', m: '310' },
              height: { d: '450', m: '180' }
            },
            tcat3: {
              width: { d: '424', m: '310' },
              height: { d: '200', m: '180' }
            },
            tcat4: {
              width: { d: '872', m: '310' },
              height: { d: '200', m: '180' }
            }
          }
        },
        product: {
          format: { default: 'webp', fallback: 'jpg' },
          retina: true,
          sizes: {
            views: { width: '45', height: '45' },
            cartMini: { width: '80', height: '80' },
            cart: { width: '120', height: '120' },
            thumbs: { width: '180', height: '180' },
            main: { width: '400', height: '400' },
            large: { width: '1000', height: '1000' } // also used in the xml sent to CAR & shopping feed
          }
        },
        brand: {
          format: { default: 'webp', fallback: 'png' },
          retina: true,
          sizes: {
            slider: { width: '80', height: '36', bg: '0' },
            list: { width: '62', height: '28', bg: '0' }
          }
        },
        partner: {
          format: { default: 'webp', fallback: 'png' },
          retina: true,
          sizes: {
            slider: { width: '80', height: '36', bg: '0' }
          }
        },
        blog: {
          format: { default: 'webp', fallback: 'jpg' },
          retina: true,
          sizes: {
            home: {
              width: { d: '1320', m: '375' },
              height: { d: '440', m: '280' }
            },
            list: { width: '495', height: '220' },
            main: { width: '990', height: '360' },
            mobile: { width: '420', height: '150' }
          }
        }
      }
    }
  },
  computed: {
    session () {
      return {
        expire: Cookie.get('token'),
        token: Cookie.get('token')
      }
    },
    supportWebp: {
      set (value) {
        return value
      },
      get () {
        return this.$store.state.supportWebp
      }
    },
    isRetina: {
      set (value) {
        return value
      },
      get () {
        return this.$store.state.isRetina
      }
    }
  },
  errorCaptured (e, vm, details) {
    if (process.env.NODE_ENV === 'development') console.log(e, vm, details)
    // Send captured error
    return false
  },
  methods: {
    openMenu () {
      this.ddMenu = true
      this.drawer_class = 'sm'

      const isIndex = this.$route.name.includes('home')
      // this.menu_loading = true;
      if (!isIndex && this.$store.state.menu[0].children.length <= 0) {
        this.$axios
          .get('menu')
          .then(response => {
            // this.menu_loading = false;
            // this.menu_loaded = true;
            this.$store.commit('SET_MENU', response.data.categories)
            this.$store.commit('SET_BRANDS', response.data.brands)
            this.ddMenu_content = this.view('layout/menu/DDMenu')
          })
          .catch(e => this.$root.clientError(e))
          .finally(() => {
            // this.menu_loading = false;
            // this.menu_loaded = true;
          })
      } else {
        this.ddMenu_content = this.view('layout/menu/DDMenu')
      }
    },
    closeMenu () {
      this.ddMenu = false
    },
    openDrawer (action, options = null) {
      this.$store.commit('UPDATE_DRAWER_LOADING', false)
      this.drawer = true
      this.drawer_class = 'md'

      if (action === 'beforeCheckout') {
        this.drawer_content = this.view(
          'modules/checkout/drawers/BeforeCheckout'
        )
        this.drawer_options = {
          action
        }
      } else if (action === 'drawer') {
        this.drawer_content = this.view('modules/checkout/drawers/Cart')

        if (options !== null && options.cart !== null) {
          this.drawer_options = {
            action,
            order_id: options.order_id
          }
          this.$store.commit('UPDATE_CART_LOADING', false)
          // this.$store.commit("UPDATE_CART", options.cart);
        } else {
          this.drawer_options = {
            action
          }
          this.$store.dispatch('fetchCart', 'mini')
        }

        this.drawer_class = 'md'
      } else if (action === 'addedToCart') {
        this.drawer_content = this.view('modules/checkout/drawers/AddedToCart')
        this.drawer_options = options
        this.drawer_class = 'md'
      } else if (action === 'signin') {
        this.drawer_content = this.view('modules/account/drawers/Signin')
        this.drawer_options = options || { action: 'signin' }
      } else if (action === 'addressForm') {
        this.drawer_content = this.view('modules/account/drawers/AddressForm')
        this.drawer_options = options
      } else if (action === 'register') {
        this.drawer_content = this.view('modules/account/drawers/Signup')
        this.drawer_options = null
      } else if (action === 'ticket') {
        this.drawer_content = this.view('modules/common/drawers/Ticket')
        this.drawer_options = null
      } else if (action === 'Preorder') {
        this.drawer_content = this.view('modules/store/drawers/Preorder')
        this.drawer_options = {
          prod_ref_id: options.prod_ref_id
        }
      } else if (action === 'showOrder') {
        this.drawer_content = this.view('modules/account/drawers/ShowOrder')
        this.drawer_class = 'md px-0'
        this.drawer_options = options
      } else if (action === 'review') {
        this.drawer_content = this.view('modules/store/drawers/Review')
        this.drawer_options = options
      }

      if (options != null && options.hasOwnProperty('close_after') === true) {
        const self = this
        setTimeout(function () {
          self.closeDrawer()
        }, options.close_after)
      }
    },
    assignCart (cart) {
      if (cart) {
        this.$store.commit('UPDATE_CART', {
          ...this.$store.state.cart,
          count: cart.count,
          checkout: cart.checkout,
          cid: cart.cid
        })
        this.$store.commit('SET_C_TOKEN', cart.cid)
        Cookie.set('c_token', cart.cid, {
          expires: cart.expires
        })
      }
    },
    openDialog (action, options = null) {
      // this.dialog.loading = true
      this.dialog.open = true
      this.dialog.hide_overlay = false
      if (action === 'deleteAccount') {
        this.dialog_content = this.view(
          'modules/account/modals/DeleteAccountConfirm'
        )
      } else if (action === 'termsConditions') {
        this.dialog_options = options
        this.dialog_content = this.view('modules/common/modals/TermsConditions')

        this.dialog.width = 1000
      } else if (action === 'missedDealsConfirm') {
        this.dialog_options = options
        this.dialog_content = this.view(
          'modules/checkout/modals/MissedDealsConfirm'
        )
      }
      // this.dialog.loading = false

      if (options != null && options.hasOwnProperty('close_after') === true) {
        const self = this
        setTimeout(function () {
          self.closeDrawer()
        }, options.close_after)
      }

      if (options != null && options.hasOwnProperty('persistent') === true) {
        this.dialog.persistent = true
      }
      if (options != null && options.hasOwnProperty('fullscreen') === true) {
        this.dialog.fullscreen = true
      }
      if (options != null && options.hasOwnProperty('hide_overlay') === true) {
        this.dialog.hide_overlay = true
      }
      if (options != null && options.hasOwnProperty('transition') === true) {
        this.dialog.transition = options.transition
      }
    },
    toLink (type, permalink, id = null) {
      if (type === 'product' || type === 'deal') {
        let query = ''
        if (id) query = '?ipr=' + id
        return (
          this.getUrl('store-products-permalink', {
            product: 'product',
            permalink
          }) + query
        )
      } else if (type === 'pack')
        return this.getUrl('store-packs-permalink', {
          pack: 'pack',
          permalink
        })
    },
    serverError (e, error) {
      const code = parseInt(e.response && e.response.status)
      const message = e.message

      if (code === 404)
        error({
          statusCode: 404
        })
      else if (code === 500)
        error({
          statusCode: 500
        })
      // Only for account/reset-password && account/verify
      else if (code === 400)
        error({
          statusCode: 400,
          message
        })
      else if (code === 422)
        error({
          statusCode: 422,
          message
        })
      else if (code === 429)
        error({
          statusCode: 429,
          message
        })
    },
    clientError (e) {
      if (e) {
        const code = parseInt(e.response && e.response.status)
        let message = e.message
        if (e.response && e.response.data && e.response.data.message !== null) {
          message = e.response.data.message
        }

        if (code) {
          // if(code === 400) this.notify(message, 'error')
          if (code === 404) this.notify(message, 'error')
          else if (code === 422) this.notify(message, 'error')
          else if (code === 401) this.openDrawer('signin')
        }
      }
    },
    closeDrawer () {
      this.drawer_content = null
      this.drawer = false
    },
    closeDialog () {
      this.dialog_content = null
      this.dialog.open = false
    },
    view (name) {
      return () => import('~/components/' + name + '.vue')
    },
    // Footer
    submitNewsletterForm () {
      this.newsletter_loading = true
      this.$validator.validateAll().then(result => {
        if (result) {
          const that = this
          this.$axios
            .post('newsletter', {
              email: this.newsletter_email
            })
            .then(res => {
              let msg = ''
              if (res.status === 201) {
                msg = that.$i18n.t('thank_you_for_your_subscription')
                that.$root.notify(msg, 'success')
              } else if (res.status === 204) {
                msg = that.$i18n.t('already_subscribed_to_newsletter')
                that.$root.notify(msg, 'success')
              } else if (res.data.voucher) {
                msg =
                  that.$i18n.t('thank_you_for_your_subscription') +
                  '. ' +
                  that.$i18n.t('your_promotional_code_is') +
                  ' ' +
                  res.data.voucher.label
                that.$root.notify(msg, 'success', 0)
              } else {
                msg = that.$i18n.t('thank_you_for_your_subscription')
                that.$root.notify(msg, 'success')
              }

              // Clear and reset form
              that.newsletter_email = ''
              that.$validator.reset()
            })
            .catch(e => this.$root.clientError(e))
            .finally(() => (this.newsletter_loading = false))
        }
      })
    },
    removeSignedUser () {
      Cookie.remove('token')
      Cookie.remove('c_token')
      if (this.$app.$route.name.includes('checkout-cart')) {
        window.location.reload()
      } else {
        this.$store.commit('SET_AUTH_TOKEN', null)
        this.$store.commit('SET_ME', null)
        this.$store.commit('UPDATE_CART_COUNT', 0)
      }
    },
    // update cart in store if updateCart:true.
    signin (data, updateCart = true) {
      this.$store.commit('SET_AUTH_TOKEN', data.token)
      this.$store.commit('SET_C_TOKEN', data.cart.cid)

      if (updateCart) {
        this.$store.commit('UPDATE_CART', data.cart)
        this.$store.commit('UPDATE_CART_COUNT', data.cart.count.cart)
      }
      this.$store.commit('SET_AUTH_EXPIRES', data.expires)
      this.$store.commit('SET_ME', data.me)
      this.$root.closeDrawer()
      // this.closeDrawer();
      this.addCookies({
        auth_token: { value: data.token, expires: data.expires }
      })
      this.addCookies({
        c_token: { value: data.cart.cid, expires: data.cart.expires }
      })

      if (this.$app.$route.name.includes('checkout-cart')) {
        this.$store.commit('ACTIVE_CART_CHECKOUT')
        // this.$store.dispatch('fetchCart')
      }
    },
    signout () {
      return new Promise((resolve, reject) => {
        const authToken = this.$store.state.auth_token
        if (authToken) {
          this.addTokens(this.$axios, {
            auth_token: authToken,
            c_token: this.$store.state.c_token
          })
          this.$axios
            .get('me/signout')
            .then(response => {
              Cookie.remove('token')
              Cookie.remove('c_token')
              window.location.reload()
              resolve(response)
            })
            .catch(e => this.$root.clientError(e))
        }
      })
    },
    getErrorMessage (error) {
      return error.msg
    },
    getUrl (urlName, params = null) {
      let routeParams = {}
      if (params !== null) routeParams = Object.assign(params, routeParams)

      return this.localePath({
        name: urlName,
        params: routeParams
      })
    },
    getBreadcrumbs (breadcrumbs) {
      const b = breadcrumbs.reduce((e, index) => {
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: e.label,
          item: this.$config('url') + e.url
        }
      }, [])

      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: b
      }
    },
    pushUrl (urlName, params = null) {
      this.$router.push(this.getUrl(urlName, params))
    },
    // eslint-disable-next-line vue/no-dupe-keys
    isRetina () {
      if (process.browser && window.matchMedia) {
        const mq = window.matchMedia(
          'only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)'
        )
        return (mq && mq.matches) || window.devicePixelRatio > 1
      }
    },
    getSsrImage (img, type) {
      if (img)
        return (
          process.env.CDN +
          img.path +
          img.filename +
          '.' +
          img.version +
          '.' +
          this.img_types[type].format.fallback
        )
      else return process.env.CDN + '/img/blank.svg'
    },
    // options : size(120x120), type(logo, product...), lazy: true/false, browserTests: true/false
    getImage (img, options, format = null) {
      const cdn = process.env.CDN
      let image = ''

      // Format (default and fallback)
      const formatObject = format || { default: 'webp', fallback: 'jpg' }

      // if (process.server) return "/img/blank.svg";

      if (typeof img === 'object') {
        const bg = options && options.bg ? 'bg' + options.bg : ''
        let isRetina = ''

        // No ssr the image comes without blank and retina support
        if (!options.ssr)
          isRetina = options && options.retina && this.isRetina ? '@2x' : ''

        let format = formatObject.fallback
        // No ssr the image comes without blank and default format (webp)
        if (!options.ssr)
          format =
            formatObject && this.supportWebp
              ? formatObject.default
              : formatObject.fallback

        format = formatObject.fallback

        const version = img.version ? '.' + img.version : ''

        // width and height and resize
        const w = options.width
        const h = options.height
        const resize = '-w' + w + 'h' + h

        image =
          cdn +
          img.path +
          img.filename +
          resize +
          bg +
          isRetina +
          version +
          '.' +
          format
      }
      return image
    },
    price (amount, currency, scale, decimalPoint, thousandsSep) {
      amount = amount * 1 // makes sure `number` is numeric value
      const str = amount
        .toFixed(scale || this.$config('price_scale'))
        .toString()
        .split('.')
      // eslint-disable-next-line prefer-const
      let parts = []
      for (let i = str[0].length; i > 0; i -= 3) {
        parts.unshift(str[0].substring(Math.max(0, i - 3), i))
      }
      str[0] = parts.join(decimalPoint || this.$config('thousands_sep'))
      let formattedPrice = str.join(
        thousandsSep || this.$config('decimal_point')
      )

      formattedPrice = this.$config('price_format').replace(
        '{price}',
        formattedPrice
      )
      formattedPrice = formattedPrice.replace(
        '{currency}',
        currency || this.$config('currency_symbol')
      )

      return formattedPrice
    },
    notify (content, color, timeout = 5000) {
      this.snackbar = {
        show: true,
        content,
        color,
        timeout
      }
    },
    addTokens ($axios, tokens) {
      if (tokens.auth_token)
        $axios.defaults.headers.common.jwtAuthorization = tokens.auth_token
      if (tokens.c_token)
        $axios.defaults.headers.common['C-Token'] = tokens.c_token
    },
    // cookies = Object : {'c_token': {value: cart.token, expires: cart.expires } }
    addCookies (cookies) {
      if (cookies.c_token) {
        Cookie.set('c_token', cookies.c_token.value, {
          expires: cookies.c_token.expires
        })
      } else if (cookies.auth_token) {
        if (cookies.auth_token.value !== null)
          Cookie.set('token', cookies.auth_token.value, {
            expires: cookies.auth_token.expires
          })
      }
    },
    // TODO: recreate this func.
    // finalizeOrder(payment_state, token = null) {
    //   this.$store.commit('UPDATE_PAYMENT_CONFIRMATION_LOADING', true)
    //   this.$store.commit('SET_PAYMENT_STEP', 4)
    //   let payment_mean_id = this.$store.state.selected_payment_mean.id || 0

    //   this.addTokens(this.$axios, {
    //     c_token: this.$store.state.c_token,
    //   })
    //   let p_token = ''
    //   if (token) p_token = '/' + token
    //   this.$axios
    //     .get('checkout/confirmation/' + payment_mean_id + p_token)
    //     .then((response) => {
    //       this.$store.commit('UPDATE_CART_COUNT', 0)
    //       let confirmation = response.data
    //       this.$store.commit('SET_CONFIRMATION', confirmation)
    //       this.$store.commit('SET_PAYMENT_PAID', 'success')

    //       // send dataLayer data - conversion
    //       var dataLayer = window.dataLayer || []
    //       dataLayer.push({
    //         event: 'finalizeOrder',
    //         user: {
    //           id: confirmation.user.id,
    //           new: confirmation.user.new,
    //         },
    //         ecommerce: {
    //           currencyCode: this.$config('currency_code'),
    //           paymentMean: confirmation.payment.name,
    //           purchase: {
    //             actionField: {
    //               id: confirmation.id,
    //               affiliation: 'Online Store',
    //               revenue: confirmation.gtm.subtotal,
    //               tax: confirmation.gtm.vat,
    //               shipping: confirmation.gtm.shipping,
    //               coupon: confirmation.gtm.voucher,
    //             },
    //             products: confirmation.gtm.items,
    //           },
    //         },
    //       })
    //     })
    //     .catch((e) => {
    //       const code = parseInt(e.response && e.response.status)
    //       if (code === 402) this.$store.commit('SET_PAYMENT_PAID', 'failure')
    //       else this.$store.commit('SET_PAYMENT_PAID', 'oups')
    //       this.$store.commit('SET_PAYMENT_TOKEN', null)
    //     })
    //     .finally(() =>
    //       this.$store.commit('UPDATE_PAYMENT_CONFIRMATION_LOADING', false)
    //     )
    // },
    getCountDown (distance) {
      const self = this
      // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hCounter = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      let mCounter = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      let sCounter = Math.floor((distance % (1000 * 60)) / 1000)

      let d = distance / 1000
      // Start Interval
      self.count_down_interval = setInterval(function () {
        let s = sCounter
        let m = mCounter
        let h = hCounter

        d -= 1
        if (sCounter === 59 && mCounter > 0) mCounter -= 1
        if (sCounter === 0) sCounter = 60

        if (mCounter === 0 && hCounter > 0) mCounter = 60
        if (mCounter === 59 && hCounter > 0) hCounter -= 1

        if (d < 0) {
          // Clear interval
          clearInterval(self.count_down_interval)
          self.$store.commit('UPDATE_COUNT_DOWN', {})
        } else {
          // Format result

          // For secondes
          if (sCounter === 60) s = '00'
          else if (sCounter.toString().length === 1) s = '0' + sCounter

          // For minutes
          if (mCounter === 60) m = '00'
          else if (mCounter.toString().length === 1) m = '0' + mCounter

          // For hours
          if (hCounter > 0) {
            h =
              hCounter.toString().length === 1
                ? '0' + hCounter.toString()
                : hCounter.toString()
          } else {
            h = '00'
          }

          // Null test
          if (h === null && m === '00') m = '00'
          else m = m.toString()
          self.$store.commit('UPDATE_COUNT_DOWN', {
            hours: d > 0 ? h : '00',
            minutes: d > 0 ? m : '00',
            seconds: d >= 0 ? s.toString() : '00'
          })
          sCounter -= 1
        }
      }, 1000)
    },
    filterArray (testArray) {
      let index = -1
      const arrLength = testArray ? testArray.length : 0
      let resIndex = -1
      // eslint-disable-next-line prefer-const
      let result = []

      while (++index < arrLength) {
        const value = testArray[index]

        if (value === 0 || value) {
          result[++resIndex] = value
        }
      }
      return result
    }
  }
})

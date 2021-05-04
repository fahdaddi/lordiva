import Vue from 'vue'
import Cookie from 'js-cookie'

Vue.mixin({
  data () {
    return {
      blank_img: '/img/blank.svg',

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
    }
  },
  // errorCaptured (e, vm, details) {
  //   if (process.env.NODE_ENV === 'development') console.log(e, vm, details)
  //   // Send captured error
  //   return false
  // },
  methods: {
    pushUrl (urlName, params = null) {
      this.$router.push(urlName, params)
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
      this.addCookies({
        auth_token: { value: data.token, expires: data.expires }
      })
    },
    signout () {
      return new Promise((resolve, reject) => {
        const authToken = this.$store.state.token
        if (authToken) {
          this.addTokens(this.$axios, {
            auth_token: authToken
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
    // eslint-disable-next-line vue/no-dupe-keys
    getSsrImage (img, type) {
      if (img)
        return (
          img.path +
          img.filename +
          '.' +
          img.version +
          '.' +
          this.img_types[type].format.fallback
        )
      else return '/img/blank.svg'
    },
    // options : size(120x120), type(logo, product...), lazy: true/false, browserTests: true/false
    getImage (img, options, format = null) {
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
    }
  }
})

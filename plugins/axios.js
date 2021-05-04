export default function ({
  app,
  $axios,
  req,
  params,
  query,
  redirect,
  store,
  error
}) {
  // server side
  let http = process.env.HTTP
  let origin = process.env.HTTP
  if (req) {
    origin = http + req.headers.host
    $axios.defaults.headers.common['X-SSR'] = true
    if (req.headers.cookie) {
      const cookie = req.headers.cookie.split(';')
      for (var i = 0; i < cookie.length; ++i) {
        if (cookie[i].trim().match('^token=')) {
          store.commit('SET_AUTH_TOKEN', cookie[i].replace(`token=`, '').trim())
        }
      }
    }
  } else origin = window.location.origin // Client side

  if (store.state.token)
    $axios.defaults.headers.common['jwtAuthorization'] = store.state.token

  $axios.defaults.baseURL = process.env.API_URL
  $axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
  $axios.defaults.headers.common['X-ORIGIN'] = origin

  if (query && query.amp !== undefined && query.amp == 1)
    $axios.defaults.headers.common['X-AMP'] = true

  $axios.onError(e => {
    const code = parseInt(e.response && e.response.status)
    if (code === 404 && e.response.data.redirect)
      if (req) return redirect(301, e.response.data.redirect)
      else window.location.replace(e.response.data.redirect)

    if (e.response.data && code) {
      const message = e.response.data.message
      if (code === 400) app.router.app.notify(message, 'error')
      else if (code === 429) app.router.app.notify(message, 'error')
    }
  })

  $axios.onResponse(res => {
    if (req && res.data.init) {
      store.commit('SET_ME', res.data.init.user)
    }
  })
}

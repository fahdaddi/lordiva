import Vue from 'vue'

import VueSmoothScroll from 'vue2-smooth-scroll'

Vue.use(VueSmoothScroll, {
  offset: -66, // $fixed-header-height + $padding-sm
  updateHistory: false,
  duration: 1000
})

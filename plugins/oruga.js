import Vue from 'vue'
import {
  Button,
  Collapse,
  Dropdown,
  Autocomplete,
  Checkbox,
  Field,
  Input,
  Radio,
  Select,
  Skeleton,
  Slider,
  Switch,
  Sidebar,
  Tabs,
  Config
} from '@oruga-ui/oruga'
// import '@oruga-ui/oruga/dist/oruga.css'
// import '@oruga-ui/oruga/dist/oruga-lite.css'

Vue.use(Config, {
  iconComponent: 'svg-icon'
})
Vue.use(Button)
Vue.use(Collapse)
Vue.use(Dropdown)
Vue.use(Autocomplete)
Vue.use(Checkbox)
Vue.use(Field)
Vue.use(Input)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Skeleton)
Vue.use(Slider)
Vue.use(Switch)
Vue.use(Sidebar)
Vue.use(Tabs)

//   Carousel,
//   Dialog,
//   Numberinput,
//   Rate,
//   Notification,
//   Tag,
//   ToastProgrammatic as Toast,

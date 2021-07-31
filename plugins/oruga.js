import Vue from "vue";
import {
  Autocomplete,
  Button,
  Checkbox,
  Collapse,
  Config,
  Dropdown,
  Field,
  Icon,
  Input,
  Modal,
  Notification,
  Pagination,
  Radio,
  Select,
  Sidebar,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  Tooltip,
} from "@oruga-ui/oruga";
// import '@oruga-ui/oruga/dist/oruga.css'
// import '@oruga-ui/oruga/dist/oruga-lite.css'

Vue.use(Config, {
  statusIcon: false,
  iconComponent: "c-svg",
  iconPack: "csvg",
  customIconPacks: {
    csvg: {
      sizes: {
        default: null,
        small: "sm",
        medium: "md",
        large: "lg",
      },
    },
  },
  // input: {
  //   autocomplete: "off",
  // },
});

Vue.use(Autocomplete);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Collapse);
Vue.use(Dropdown);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Modal);
Vue.use(Notification);
Vue.use(Pagination);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Sidebar);
Vue.use(Skeleton);
Vue.use(Slider);
Vue.use(Switch);
Vue.use(Tabs);
Vue.use(Tooltip);

//   Carousel,
//   Dialog,
//   Numberinput,
//   Rate,
//   Notification,
//   Tag,
//   ToastProgrammatic as Toast,

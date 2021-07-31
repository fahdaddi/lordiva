import Vue from "vue";

const Drawer = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          drawer: false,
          drawer_class: null,
          drawer_content: null,
          drawer_options: {},

          drawer_child: false,
          drawer_child_class: null,
          drawer_child_content: null,
          drawer_child_options: {},

          ddMenu: false,
          ddMenu_content: "",
        };
      },
      methods: {
        openDrawer(action, options = {}, level = 1) {
          let content, drawer_options;
          let drawer_class = "sm";

          switch (action) {
            case "signin":
              content = this.view("drawers/Signin");
              drawer_class = "sm";
              drawer_options = options || { action: "signin" };
              break;
            case "register":
              content = this.view("drawers/Signup");
              drawer_class = "sm";
              drawer_options = options || { action: "register" };
              break;
            case "ticket":
              content = this.view("drawers/Contact");
              drawer_options = null;
              break;
            case "addressForm":
              content = this.view("drawers/Address");
              drawer_options = options;
              break;
            case "termsConditions":
              content = this.view("drawers/TermsConditions");
              drawer_options = options;
              break;
            case "review":
              content = this.view("drawers/Review");
              drawer_options = options;
              break;
            case "Preorder":
              content = this.view("drawers/Preorder");
              drawer_class = "sm";
              drawer_options = options;
              break;
            case "beforeCheckout":
              content = this.view("drawers/BeforeCheckout");
              drawer_options = options;
              break;
            case "editProfile":
              content = this.view("drawers/Informations");
              drawer_class = "lg";
              drawer_options = options;
              break;
            default:
              break;
          }

          setTimeout(() => {
            if (level == 1) {
              this.drawer = true;
              this.drawer_content = content;
              this.drawer_options = drawer_options;
              this.drawer_class = drawer_class;
            } else {
              this.drawer_child = true;
              this.drawer_child_content = content;
              this.drawer_child_options = drawer_options;
              this.drawer_child_class = drawer_class;
            }

            if (options.close_after) {
              setTimeout(() => {
                this.closeDrawer(level);
              }, options.close_after);
            }
          }, 50);
        },
        closeDrawer(level = 1) {
          if (level == 1) {
            this.drawer = false;
            this.drawer_content = null;
          } else {
            this.drawer_child = false;
            this.drawer_child_content = null;
          }
        },
      },
    });
  },
};

Vue.use(Drawer);

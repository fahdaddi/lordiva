<template>
  <Drawer :title="$t('menu')" class="dd-menu" @close="$emit('close')">
    <template v-if="loading">
      <ul>
        <li class="label">
          <o-skeleton width="30%" :height="24" />
        </li>

        <template v-for="n in 2">
          <li :key="`${n}`">
            <a href="javascript;:">
              <span class="flex-1">
                <o-skeleton width="50%" :height="18" />
              </span>
              <c-svg name="chevron-right" class="baseline sm" />
            </a>
          </li>

          <li v-for="k in 5" :key="`${n}_${k}`" class="sub-child">
            <a href="javascript;:">
              <span class="flex-1">
                <o-skeleton width="60%" :height="18" />
              </span>
              <c-svg name="chevron-right" class="baseline sm" />
            </a>
          </li>
        </template>
      </ul>
    </template>

    <template v-else>
      <ul v-if="categories">
        <li class="label">{{ $tc("category", 2) }}</li>

        <template v-for="category in categories">
          <MenuItem :key="category.id" type="categories" :item="category" />

          <template v-for="subCategory in category.children">
            <MenuItem
              :key="subCategory.id"
              class="sub-child"
              type="categories"
              :item="subCategory"
            />
          </template>
          <!-- <nuxt-link
          :to="`/categories/${category.slug}`"
          :title="category.name"
          class="dark"
        >
          <span>
            {{ category.name }}
          </span>

          <c-svg name="chevron-right" class="baseline sm" />
        </nuxt-link> -->
        </template>
      </ul>

      <ul v-if="brands.length">
        <li class="label">{{ $tc("brand", 2) }}</li>
        <li v-for="brand in brands" :key="brand.id">
          {{ brand.name }}
        </li>
      </ul>
    </template>
  </Drawer>
</template>

<script>
const Drawer = () => import("~/components/drawers/index");
const MenuItem = () => import("~/components/modules/menu/Item.vue");
export default {
  components: {
    Drawer,
    MenuItem,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    brands() {
      return this.$store.state.menu ? this.$store.state.menu.brands : [];
    },
    categories() {
      return this.$store.state.menu ? this.$store.state.menu.categories : [];
    },
  },
  mounted() {
    if (!this.$store.state.menu) {
      this.getMenu();
    }
  },
  methods: {
    getMenu() {
      this.loading = true;
      this.$axios
        .get("menu")
        .then((res) => {
          this.$store.commit("SET_MENU", res.data);
        })
        .catch((e) => {
          this.$root.clientError(e);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style></style>

<template>
  <section v-if="product" :key="product.slug" class="product-page">
    <div class="product container fw">
      <div class="imgs-container">
        <div class="main-image">
          <c-img
            :key="image"
            :src="image"
            :alt="`${product.name}`"
            type="product"
            size="main"
          />
        </div>

        <ul class="views no-wrap">
          <li
            v-for="(view, i) in views"
            :key="i"
            v-bind:class="{ active: i == viewIndex }"
            @click="selectImage(view, i)"
          >
            <c-img
              :src="view"
              :alt="`${product.name} ${i}`"
              type="product"
              size="views"
            />
          </li>
        </ul>
      </div>

      <div class="details">
        <h1>{{ product.name }}</h1>
        <nuxt-link
          v-if="product.brand"
          class="brand"
          :to="`brands/${product.brand.slug}`"
          >{{ product.brand.name }}</nuxt-link
        >

        <div class="price-rating">
          <div
            v-if="selectedSize.discount_price || product.discount_price"
            class="price"
          >
            <span class="strike old">{{
              price(selectedSize.price || product.price)
            }}</span>
            <span class="selling">{{
              price(selectedSize.discount_price || product.discount_price)
            }}</span>
          </div>
          <div v-else class="price">
            <span class="selling">{{
              price(selectedSize.price || product.price)
            }}</span>
          </div>

          <div v-if="product.rating" class="rating mb-6">
            <Rating :rating="product.rating.value" />
          </div>
        </div>

        <div v-if="selectedSize.id" class="size">
          <span class="mr-2">
            {{ selectedSize.name }}
          </span>
          <Tag
            :color="selectedSize.stock > 0 ? 'success' : 'warning'"
            outlined
            small
            rounded
            >{{ $t(selectedSize.stock > 0 ? "in_stock" : "sold_out") }}</Tag
          >
        </div>

        <div v-else class="size">
          <Tag
            :color="product.stock > 0 ? 'success' : 'warning'"
            outlined
            small
            rounded
            >{{ $t(product.stock > 0 ? "in_stock" : "sold_out") }}</Tag
          >
        </div>

        <ul class="views no-wrap">
          <li
            v-for="size in product.sizes"
            :key="`${size.id}`"
            :class="{
              active: size.id == selectedSize.id,
              soldout: size.stock == 0,
            }"
            @click="selectSize(size)"
          >
            <c-img
              v-if="size.image"
              class="logo"
              :src="size.image"
              type="logo"
              size="main"
              :alt="size.name"
            />

            <template v-else>
              {{ size.name }}
            </template>
          </li>
        </ul>

        <div class="qty">
          <div class="qty-selector">
            <c-svg name="minus" @click="qtyLess()" />
            <input
              v-model="qty"
              :max="product.stock"
              type="number"
              min="0"
              autocomplete="off"
              @blur="onBlurQty()"
              @input="checkMax()"
            />
            <c-svg name="plus" @click="qtyMore()" />
          </div>
          <o-button
            :variant="
              (selectedSize.id ? selectedSize.stock : product.stock) > 0
                ? 'success'
                : 'warning'
            "
            :loading="add_to_cart_loading"
            :disabled="add_to_cart_loading"
            expanded
            @click="addToCart"
          >
            <c-svg
              :name="
                (selectedSize.id ? selectedSize.stock : product.stock) > 0
                  ? 'shopping-cart'
                  : 'mail'
              "
              class="baseline mr-1"
            />
            {{
              $t(
                (selectedSize.id ? selectedSize.stock : product.stock) > 0
                  ? "add_to_cart"
                  : "notify_me"
              )
            }}
          </o-button>
        </div>

        <div
          v-if="product.meta_description"
          class="description"
          v-html="product.meta_description"
        />
      </div>
    </div>

    <ul class="products container fw mt-2">
      <div class="title">
        <span>{{ $t("related_products") }}</span>
      </div>
      <ul class="no-wrap">
        <ProductCard
          v-for="related in product.related"
          :key="related.id"
          :product="related"
        />
      </ul>
    </ul>
  </section>
</template>

<script>
import Tag from "~/components/common/Tag.vue";
const Rating = () => import("~/components/modules/product/Rating.vue");
const ProductCard = () => import("~/components/modules/product/Card");

export default {
  components: {
    Rating,
    ProductCard,
    Tag,
  },
  async asyncData({ app, store, route, params, query, error }) {
    return app.$axios
      .get("products/" + params.slug, { params: query })
      .then(({ data }) => {
        store.commit("UPDATE_META_TITLE", data.meta_title);
        let meta = [
          {
            hid: "description",
            name: "description",
            content: data.meta_description,
          },
        ];

        let product = data;

        let product_rich_snippets = {
          "@context": "http://schema.org/",
          "@type": "Product",
          name: product.name,
          description: product.meta_description,
          // first split .

          sku: product.id,

          offers: {
            "@type": "AggregateOffer",
            acceptedPaymentMethod: "http://purl.org/goodrelations/v1#Cash",
            price: product.price,
            url: app.router.app.$config("url") + route.path,
            priceCurrency: app.router.app.$config("currency_code"),
            itemCondition: "https://schema.org/NewCondition",
            availability: product.stock
              ? "https://schema.org/PreOrder"
              : "https://schema.org/InStock",
          },
        };

        if (product.brand) {
          product_rich_snippets.brand = {
            "@type": "Thing",
            name: product.brand.label,
          };
        }

        // only if reviews
        if (product.rating && product.rating.count > 0)
          product_rich_snippets.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: product.rating.value,
            ratingCount: product.rating.count,
          };

        return {
          rich_snippets: [
            app.router.app.$config("global_rich_snippets"),
            product_rich_snippets,
          ],
          meta: meta,
          product: product,
          image: product.image,
          //   ipr: query.ipr,
        };
      })
      .catch((e) => app.router.app.serverError(e, error));
  },
  data() {
    return {
      add_to_cart_loading: false,
      views: [],
      viewIndex: 0,
      selectedSize: {},
      qty: 1,
    };
  },
  watch: {
    "$route.params.slug"() {
      let selectedSize = this.product.sizes.find((s) => s.stock > 0);
      if (selectedSize) {
        this.selectSize(selectedSize);
      }
    },
  },
  beforeDestroy() {
    this.product = undefined;
    this.image = undefined;
    this.rich_snippets = undefined;
    this.meta = undefined;
  },
  created() {
    let selectedSize = this.product.sizes.find((s) => s.stock > 0);
    if (selectedSize) {
      this.selectSize(selectedSize);
    }
  },
  methods: {
    qtyMore() {
      this.qty = Number(this.qty) + 1;
      this.checkMax();
    },
    qtyLess() {
      if (this.qty > 1) this.qty = Number(this.qty) - 1;
    },
    checkMax() {
      if (this.qty > this.product.stock) {
        this.qty = Number(this.product.stock);
      }
    },
    onBlurQty() {
      if (this.qty == "") this.qty = 1;
    },
    addToCart() {
      if (!this.$store.state.me) {
        return this.$root.openDrawer("signin");
      }

      if (this.isSoldout()) {
        return this.$root.openDrawer("notify_me", {
          productId: this.product.id,
          sizeId: this.selectedSize.id,
        });
      }
      this.add_to_cart_loading = true;

      this.$axios
        .post(`carts/${this.$store.state.cart.id}`, {
          slug: this.product.slug,
          size_id: this.selectedSize.id,
          qty: this.qty,
        })
        .then((res) => {
          this.$store.commit("UPDATE_CART_COUNT", res.data.cart.count);
          this.$store.commit("UPDATE_CART_TOTAL", res.data.cart.total);
          this.$store.commit("UPDATE_CART", res.data.cart.cart_items);
          this.$root.notify(this.$t("product_added_to_cart"), "success");
        })
        .catch((e) => this.$root.clientError(e))
        .finally(() => (this.add_to_cart_loading = false));
    },
    isSoldout() {
      return this.selectedSize.id
        ? this.selectedSize.stock == 0
        : this.product.stock == 0;
    },
    selectImage(src, index) {
      this.image = src;
      this.viewIndex = index;
    },
    selectSize(size) {
      this.selectedSize = { ...size };

      let views = size.views ? [...size.views] : [];
      if (size.image) views.unshift(size.image);
      this.image = views[0];
      this.views = views;

      this.viewIndex = 0;
    },
  },
};
</script>

<style></style>

<template>
  <section class="product-page">
    <div class="product container fw">
      <div class="imgs-container">
        <div class="main-image">
          <c-img
            :src="image"
            :alt="`${product.name}`"
            type="product"
            size="main"
          />
        </div>

        <ul class="views no-wrap">
          <li
            v-for="(view, i) in product.views"
            :key="i"
            v-bind:class="{ active: i == viewIndex }"
            @mouseover="selectImage(view, i)"
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
          <div v-if="product.discount_price" class="price">
            <span class="strike old">{{ price(product.price) }}</span>
            <span class="selling">{{ price(product.discount_price) }}</span>
          </div>
          <div v-else class="price">
            <span class="selling">{{ price(product.price) }}</span>
          </div>

          <div v-if="product.rating" class="rating">
            <Rating :rating="product.rating.value" />
          </div>
        </div>

        <p class="description">{{ product.meta_description }}</p>

        <div class="atc">
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
            variant="success"
            :loading="add_to_cart_loading"
            :disabled="add_to_cart_loading"
            expanded
            @click="addToCart"
          >
            <c-svg name="shopping-cart" class="baseline mr-1" />
            {{ $t("add_to_cart") }}
          </o-button>
        </div>
      </div>
    </div>

    <ul class="products container fw my-2">
      <div class="title">
        <span>{{ $t("related_products") }}</span>
      </div>
      <ul class="no-wrap">
        <ProductCard v-for="i in related" :key="i" />
      </ul>
    </ul>
  </section>
</template>

<script>
const Rating = () => import("~/components/modules/product/Rating.vue");
const ProductCard = () => import("~/components/modules/product/Card");

export default {
  components: {
    Rating,
    ProductCard,
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

        let image;
        if (product.views) {
          product.views &&
            product.image &&
            product.views.unshift(product.image);
          image = product.views.map((img) => img);
        }

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

        if (product.views && product.views.length > 0)
          product_rich_snippets.image = image;

        return {
          rich_snippets: [
            app.router.app.$config("global_rich_snippets"),
            product_rich_snippets,
          ],
          meta: meta,
          product: product,
          related: data.related,
          permalink: params.slug,
          //   ipr: query.ipr,
        };
      })
      .catch((e) => app.router.app.serverError(e, error));
  },
  data() {
    return {
      add_to_cart_loading: false,
      image: null,
      viewIndex: 0,
      qty: 1,
    };
  },
  created() {
    this.image = this.product.image;
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
      this.add_to_cart_loading = true;

      this.$axios
        .post(`carts/${this.$store.state.cart.id}`, {
          slug: this.product.slug,
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
    selectImage(src, index) {
      this.image = src;
      this.viewIndex = index;
    },
  },
};
</script>

<style></style>

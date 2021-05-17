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
        <nuxt-link class="brand" :to="`brands/${product.brand.slug}`">{{
          product.brand.label
        }}</nuxt-link>

        <div class="price-rating">
          <div class="price">
            <span v-if="product.price.old" class="strike old">{{
              price(product.price.old)
            }}</span>
            <span class="selling">{{ price(product.price.selling) }}</span>
          </div>

          <div v-if="product.rating" class="rating">
            <Rating :rating="product.rating.value" />
          </div>
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
    // return app.$axios
    //   .get("products/" + params.permalink, { params: query })
    //   .then((res) => {
    let data = {
      product: {
        id: 1,
        img:
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
        views: [
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
          "https://content.rolex.com/dam/2021/upright-bba-with-shadow/m226570-0001.png?imwidth=840",
        ],
        name: "Explorer II",
        meta_title: "Explorer II",
        meta_description: "",
        soldout: false,
        slug: "explorer_2",
        brand: {
          slug: "rolex",
          label: "Rolex",
        },
        price: {
          old: 120,
          selling: 100,
        },
        rating: {
          formatted: "3,7",
          value: 3.7,
          count: 100,
        },
      },

      related: 5, // TODO: Related Products list
    };
    store.commit("UPDATE_META_TITLE", data.product.meta_title);
    let meta = [
      {
        hid: "description",
        name: "description",
        content: data.product.meta_description,
      },
    ];

    let product = data.product;

    product.views && product.img && product.views.unshift(product.img);
    let image = product.views.map((img) => img);

    let product_rich_snippets = {
      "@context": "http://schema.org/",
      "@type": "Product",
      name: product.name,
      description: product.meta_description,
      // first split .

      sku: product.id,
      brand: {
        "@type": "Thing",
        name: product.brand.label,
      },

      offers: {
        "@type": "AggregateOffer",
        acceptedPaymentMethod: "http://purl.org/goodrelations/v1#Cash",
        price: product.price.selling,
        url: app.router.app.$config("url") + route.path,
        priceCurrency: app.router.app.$config("currency_code"),
        itemCondition: "https://schema.org/NewCondition",
        availability: product.soldout
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      },
    };

    // only if reviews
    if (product.rating.count > 0)
      product_rich_snippets.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: product.rating.value,
        ratingCount: product.rating.count,
      };

    if (product.views.length > 0) product_rich_snippets.image = image;

    return {
      rich_snippets: [
        app.router.app.$config("global_rich_snippets"),
        product_rich_snippets,
      ],
      meta: meta,
      product: product,
      related: data.related,
      permalink: params.permalink,
      //   ipr: query.ipr,
    };
    //   })
    //   .catch((e) => app.router.app.serverError(e, error));
  },
  data() {
    return {
      image: null,
      viewIndex: 0,
    };
  },
  created() {
    this.image = this.product.img;
  },
  methods: {
    selectImage(src, index) {
      this.image = src;
      this.viewIndex = index;
    },
  },
};
</script>

<style></style>

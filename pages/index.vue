<template>
  <section class="home">
    <KeenSlider
      :autoplay="4000"
      loop
      :navigation-arrows="$device.isDesktop"
      :navigation-dots="false"
    >
      <KeenSlide v-for="(slide, i) in home.slides" :key="i">
        <div
          class="slide-container"
          @click="
            () => {
              if (slide.slug) pushUrl(slide.slug);
            }
          "
        >
          <c-img
            :key="i"
            :src="slide.image"
            :alt="slide.title"
            :lazy="i != 0"
            type="home"
            size="slider"
          />
        </div>
      </KeenSlide>
    </KeenSlider>

    <div class="intro">
      <div class="container">
        <div class="img-container">
          <c-img
            class="logo"
            :src="$root.default_logo"
            :lazy="false"
            :alt="$t('logo') + ' ' + $config('site')"
            type="logo"
            size="150x150"
            @click="pushUrl('index')"
          />
        </div>

        <div class="text">
          <span class="site">{{ $config("site") }},</span>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit alias
          omnis officiis aspernatur, commodi voluptatem hic beatae repudiandae.
          Rem quaerat vel vero consequuntur saepe consectetur officia, a
          perspiciatis voluptatem velit! Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Velit alias omnis officiis aspernatur, commodi
          voluptatem hic beatae repudiandae. Rem quaerat vel vero consequuntur
          saepe consectetur officia, a perspiciatis voluptatem velit! Lorem,
          ipsum dolor sit amet consectetur adipisicing elit. Velit alias omnis
          officiis aspernatur, commodi voluptatem hic beatae repudiandae. Rem
          quaerat vel vero consequuntur saepe consectetur officia, a
          perspiciatis voluptatem velit!s
        </div>
      </div>
    </div>

    <div class="products container pt-0">
      <div class="title">
        <span>{{ $t("latest_products") }}</span>
      </div>
      <ul class="no-wrap">
        <ProductCard
          v-for="(product, i) in home.last_products"
          :key="product.id"
          :product="product"
        />
      </ul>
    </div>

    <div class="usp">
      <div class="container">
        <ul class="items no-wrap">
          <li v-for="item in usp" :key="item.title">
            <c-svg>{{ item.icon }}</c-svg>
            <p>
              <span class="block">{{ item.title }}</span>
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <div class="products container pb-0">
      <div class="title">
        <span>{{ $t("top_products") }}</span>
      </div>
      <ul class="no-wrap">
        <ProductCard
          v-for="product in home.best_products"
          :key="product.id"
          :product="product"
        />
      </ul>
    </div>
  </section>
</template>

<script>
const KeenSlider = () => import("~/components/common/slider/KeenSlider");
const KeenSlide = () => import("~/components/common/slider/KeenSlide");
const ProductCard = () => import("~/components/modules/product/Card");

export default {
  components: {
    KeenSlider,
    KeenSlide,
    ProductCard,
  },
  async asyncData({ app, error }) {
    return app.$axios
      .get("home")
      .then((res) => {
        return {
          home: res.data,
        };
      })
      .catch((e) => app.router.app.serverError(e, error));
  },
  data() {
    return {
      slides: [
        {
          title: "name 1",
          img:
            "https://content.rolex.com/dam/new-watches-2021/family-pages/explorer/family-page-explorer-beauty_explorer-ii_2bis_a2_v2f.jpg?imwidth=1112",
          path: "/",
        },
        {
          title: "name 2",
          img:
            "https://images.pexels.com/photos/158741/gshock-watch-sports-watch-stopwatch-158741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          path: "/",
        },
        {
          title: "name 3",
          img:
            "https://images.pexels.com/photos/1190830/pexels-photo-1190830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          path: "/",
        },
      ],
      usp: [
        {
          icon: "package",
          title: "Livraison Gratuite.",
          description: "Toutes les commandes de 1,000 MAD ou plus.",
        },
        {
          icon: "dollar-sign",
          title: "Méthodes de Payement.",
          description: "Paiement à la livraison, virement bancaire et PayPal",
        },
        {
          icon: "back",
          title: "Retours et Remboursements.",
          description:
            "Tout article acheté dans les 10 jours suivant la date de livraison.",
        },
      ],
    };
  },
  created() {
    this.$store.commit("UPDATE_META_TITLE", this.$t("homepage"));
  },
};
</script>

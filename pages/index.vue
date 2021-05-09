<template>
  <section class="home">
    <KeenSlider :autoplay="4000" loop navigation-arrows navigation-dots>
      <KeenSlide v-for="(slide, i) in slides" :key="i">
        <div class="slide-container" @click="pushUrl(slide.url)">
          <c-img
            :key="i"
            :src="slide.img"
            :alt="slide.title"
            :lazy="i != 0"
            :force-retina="i == 0"
            type="home"
            size="slider"
          />
        </div>
      </KeenSlide>
    </KeenSlider>
    <div class="usp">
      <div class="container">
        <ul class="items no-wrap">
          <li v-for="item in usp" :key="item.title">
            <c-svg>{{ item.icon }}</c-svg>
            <p>
              <span>{{ item.title }}</span>
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <ul class="products container">
      <div class="title">
        <span>{{ $t("top_products") }}</span>
      </div>
      <ul class="no-wrap">
        <ProductCard v-for="i in 5" :key="i" />
      </ul>
    </ul>

    <div class="intro">
      <div class="container">
        <div class="img-container">
          <c-img
            class="logo"
            :src="require('/assets/images/logo.png')"
            :lazy="false"
            :alt="$t('logo') + ' ' + $config('site')"
            type="logo"
            size="150x150"
            @click="pushUrl(`/`)"
          />
        </div>

        <div class="text">
          <span class="site">{{ $config("site") }},</span>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit alias
          omnis officiis aspernatur, commodi voluptatem hic beatae repudiandae.
          Rem quaerat vel vero consequuntur saepe consectetur officia, a
          perspiciatis voluptatem velit!
        </div>
      </div>
    </div>
    <!--  -->

    <ul class="products container">
      <div class="title">
        <span>{{ $t("latest_products") }}</span>
      </div>
      <ul class="no-wrap">
        <ProductCard v-for="i in 5" :key="i" />
      </ul>
    </ul>
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
          title: "Free Shipping.",
          description:
            "All orders of 599 DH or more of eligible items across any product category qualify.",
        },
        {
          icon: "dollar-sign",
          title: "Payment Methods.",
          description: "Cash on delivery, bank transfer, and PayPal",
        },
        {
          icon: "back",
          title: "Returns & Refunds.",
          description:
            "You can return any item purchased on Shella within 10 days of the delivery date.",
        },
      ],
    };
  },
  created() {
    this.$store.commit("UPDATE_META_TITLE", this.$t("homepage"));
  },
};
</script>

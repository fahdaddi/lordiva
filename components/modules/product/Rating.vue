<template>
  <div class="stars">
    <c-svg v-for="(icon, index) in data_rating" :key="index">
      {{ icon }}
    </c-svg>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      data_rating: [],
    };
  },
  created() {
    let rating = this.rating;

    for (var i = rating; i >= 1; i--) this.data_rating.push("star");

    if (i > 0) this.data_rating.push("star_half");

    // for (let i = 5 - rating; i >= 1; i--) {
    //   this.data_rating.push("star_border");
    // }
  },
};
</script>

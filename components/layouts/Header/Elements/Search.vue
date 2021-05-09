<template>
  <div v-on-clickaway="close" class="search">
    <div class="input">
      <c-svg class="sm">search</c-svg>
      <input
        ref="input"
        v-model="search_query"
        :placeholder="$t('search_brand_product')"
        type="text"
        autocomplete="false"
        @change="suggest"
        @keyup.enter="onSearchEnter"
      />
      <c-svg class="sm link" @click="close">close</c-svg>
    </div>

    <div class="result">
      <div v-if="!results_length" class="tags">
        <!-- suggestions -->
        <ul>
          <li class="label">{{ $tc("suggestion", 2) }}</li>
          <li
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="tag"
            @click="pushUrl('/search/' + suggestion)"
          >
            <span v-html="highlight(suggestion)"></span>
          </li>
        </ul>

        <!-- search history -->
        <ul v-if="suggesthistory.length > 0" class="mt-5">
          <li class="label">
            {{ $t("history") }}
            <span class="link" @click="clearSearchHistory()"
              ><c-svg class="ml-2">trash</c-svg></span
            >
          </li>
          <li
            v-for="history in suggesthistory"
            :key="history"
            class="tag"
            @click="pushUrl('/search/' + history)"
          >
            <span v-html="highlight(history)"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";

export default {
  mixins: [clickaway],
  data() {
    return {
      suggesthistory: [],
      suggestions: this.$config("search").suggestions,
      search_query: "",
      results: {},
    };
  },
  computed: {
    results_length() {
      return this.results &&
        Object.keys(this.results).length > 0 &&
        ((this.results.brands && this.results.brands.length > 0) ||
          (this.results.categories && this.results.categories.length > 0) ||
          (this.results.products && this.results.products.length > 0)) &&
        this.search_query.length > 1
        ? true
        : false;
    },
  },
  mounted() {
    this.suggesthistory = localStorage.getItem("suggesthistory")
      ? JSON.parse(localStorage.getItem("suggesthistory"))
      : [];

    this.$refs.input.focus();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    suggest() {},
    highlight(result) {
      if (this.search_query.length > 1) {
        return result.replace(
          this.search_query,
          "<b>" + this.search_query + "</b>"
        );
      } else return result;
    },
    onSearchEnter() {
      if (this.search_query.length > 1) {
        let new_suggest_history = this.suggesthistory;
        if (!this.suggesthistory.includes(this.search_query))
          new_suggest_history.unshift(this.search_query);
        this.suggesthistory = new_suggest_history.slice(0, 5);
        localStorage.setItem(
          "suggesthistory",
          JSON.stringify(this.suggesthistory)
        );
        this.pushUrl("/search/" + this.search_query);
      }
    },
  },
};
</script>

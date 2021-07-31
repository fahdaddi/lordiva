<template>
  <ValidationProvider
    v-slot="{ errors }"
    slim
    :vid="vid"
    :name="$attrs.name || label"
    :rules="rules"
    :mode="validationMode"
  >
    <o-field
      v-model="innerValue"
      :label="label"
      :label-size="labelSize"
      :variant="variant"
      :message="hideDetails ? null : errors[0] || message || ' '"
    >
      <o-autocomplete
        v-model="search"
        :placeholder="placeholder"
        :disabled="disabled"
        :size="size"
        :data="filteredDataObj"
        :field="itemText"
        open-on-focus
        @select="selectitem"
        @typing="getFilteredData"
      >
        <template slot-scope="props">
          <template v-if="type == 'phone-code'">
            {{ `${props.option.country} (${props.option.code})` }}
          </template>

          <template v-else-if="type == 'country'">
            {{ props.option.country }}
          </template>
          <template>
            <slot :props="props" />
          </template>
        </template>
        <slot name="header" />
        <slot name="footer" />
        <template slot="empty">
          <slot name="empty">{{ $t("no_result_found") }}</slot>
        </template>
      </o-autocomplete>

      <slot name="addon" />
    </o-field>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    vid: {
      type: String,
      default: "",
    },
    rules: {
      type: [Object, String],
      default: "",
    },
    type: {
      type: String,
      default: null,
    },
    // must be included in props
    data: {
      type: Array,
      default: () => [],
    },
    itemText: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    itemSearch: {
      type: String,
      required: true,
    },
    value: {
      type: null,
      default: "",
    },
    placeholder: {
      type: [String, Number],
      default: "Choisir",
    },
    label: {
      type: String,
      default: "",
    },
    labelSize: {
      type: String,
      default: "small",
    },
    message: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "text",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "",
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    validationMode: {
      type: String,
      default: "eager",
    },
    inputRef: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      search: "",
      innerValue: "",
      filteredDataObj: this.data,
    };
  },
  watch: {
    value(newVal) {
      if (!newVal) {
        this.innerValue = newVal;
      }
    },
  },
  created() {
    this.innerValue = this.value;

    if (this.value) {
      let op = this.data.find((item) => {
        let ids = this.itemId.split(".");

        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          item = item[id];
        }

        return item == this.value;
      });

      if (op) {
        let ids = this.itemText.split(".");

        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          op = op[id];
        }
      }
      this.search = op || "";
    }
  },
  methods: {
    getFilteredData(search) {
      this.search = search;
      this.selectitem(null);
      this.filteredDataObj = this.data.filter((option) => {
        let itemSearch = this.itemSearch.split(",");
        let val = "";
        for (let i = 0; i < itemSearch.length; i++) {
          const element = itemSearch[i];
          val += option[element];
        }
        return val.toLowerCase().indexOf(this.search.toLowerCase()) != -1;
      });
    },
    selectitem(option) {
      if (option) {
        let ids = this.itemId.split(".");

        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          option = option[id];
        }
      }

      this.innerValue = option;
      this.$emit("input", this.innerValue);
    },
  },
};
</script>

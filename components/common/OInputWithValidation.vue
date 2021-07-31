<template>
  <ValidationProvider
    v-slot="{ errors }"
    slim
    :vid="vid"
    :name="name || label"
    :rules="rules"
    :mode="validationMode"
  >
    <o-field
      :label="label"
      :label-size="labelSize"
      :variant="variant"
      :message="hideDetails ? null : errors[0] || message || ' '"
    >
      <o-input
        :ref="inputRef"
        v-model="innerValue"
        :placeholder="placeholder"
        :size="size"
        v-bind:disabled="disabled"
        v-bind:expanded="expanded"
        :type="type"
        v-bind:rows="rows"
        v-bind:auto-focus="autoFocus"
        v-bind:maxlength="maxlength"
        v-bind:minlength="minlength"
        :password-reveal="passwordReveal"
        @input="emitInput"
        @blur="emitBlur"
        @focus="emitFocus"
      />

      <slot />
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
    // must be included in props
    value: {
      type: null,
      default: "",
    },
    placeholder: {
      type: [String, Number],
      default: "",
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
    expanded: {
      type: Boolean,
      default: null,
    },
    variant: {
      type: String,
      default: "text",
    },
    type: {
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
    isError: {
      type: Boolean,
      default: false,
    },
    validationMode: {
      type: String,
      default: "lazy",
    },
    inputRef: {
      type: String,
      default: "",
    },
    maxlength: {
      type: [String, Number],
      default: null,
    },
    minlength: {
      type: [String, Number],
      default: null,
    },
    passwordReveal: {
      type: Boolean,
      default: false,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: [Number, String],
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    innerValue: "",
  }),
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit("input", newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
  methods: {
    emitInput(e) {
      this.$emit("typing", e);
    },
    emitBlur(e) {
      this.$emit("blur", e);
    },
    emitFocus(e) {
      this.$emit("focus", e);
    },
    emitIconRightClick(e) {
      this.$emit("icon-right-click", e);
    },
  },
};
</script>

<template>
  <div
    class="navigation-wrapper"
    v-bind="extraAttributes"
    @mouseover="focused = true"
    @mouseleave="focused = false"
  >
    <div ref="sliderRef" class="keen-slider" v-bind="extraAttributes">
      <!-- @slot Contains the slides -->
      <slot></slot>
    </div>
    <template>
      <c-svg v-if="navigationArrows" class="arrow arrow--right" @click="next">
        chevron-right
      </c-svg>
      <c-svg v-if="navigationArrows" class="arrow arrow--left" @click="prev">
        chevron-left
      </c-svg>
      <div v-if="navigationDots" class="dots" v-bind="extraAttributes">
        <button
          v-for="(_, idx) in dotHelper"
          :key="idx"
          :aria-label="`slider_button_${idx}`"
          v-bind="extraAttributes"
          :class="{ dot: true, active: current === idx }"
          @click="moveToSlideRelative(idx)"
        ></button>
      </div>
    </template>
  </div>
</template>

<script>
import KeenSliderLib from 'keen-slider'

export default {
  name: 'KeenSlider',
  props: {
    // Control slider with mouse or touch gestures
    controls: {
      default: () => true,
      type: Boolean,
    },
    // Adjust the speed that is translated to the slider when dragging - minus values would invert the swipe direction
    dragSpeed: {
      default: () => 1,
      type: Number,
    },
    // Index of the initial activated slide
    initial: {
      default: () => 0,
      type: Number,
    },
    // Set the slider direction to vertical
    vertical: {
      default: () => false,
      type: Boolean,
    },
    // Infinite loop of slides
    loop: {
      default: () => true,
      type: Boolean,
    },
    // Set the mode of movement of the slider ['snap', 'free-snap', 'free']
    mode: {
      default: () => 'snap',
      type: String,
    },
    // Set the animation duration for the "snap"-mode
    duration: {
      default: () => 500,
      type: Number,
    },
    // Reset to initial when the breakpoint changes
    resetSlide: {
      default: () => false,
      type: Boolean,
    },
    // Number of slides per view
    slidesPerView: {
      default: () => 1,
      type: Number,
    },
    // Spacing between slides in pixel
    spacing: {
      default: () => 0,
      type: Number,
    },
    // Simulate rubberband if moving or dragging above the slider edge
    rubberband: {
      default: () => true,
      type: Boolean,
    },
    // Control the slider with arrows
    navigationArrows: {
      default: () => false,
      type: Boolean,
    },
    // Control the slider with dots
    navigationDots: {
      default: () => false,
      type: Boolean,
    },
    // Applies the parent css scope id to the slider
    useParentScopeId: {
      type: Boolean,
      default: () => false,
    },
    // Active slide will be centered - only makes sense, when slidesPerView is greater than `1`
    centered: {
      type: Boolean,
      default: () => false,
    },
    // Auto change the slide. Set the interval with this attribute as string or number in ms. Default interval: `3000`
    autoplay: {
      type: [Boolean, Number, String],
      default: () => 6000,
    },
    // Change the options or event hooks for a given breakpoint. The breakpoint is set by the media query syntax. Note: The last options of the last matching breakpoint will be merged with the options on the root level.
    breakpoints: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    keenSlider: null,
    current: 0,
    interval: null,
    focused: false,
  }),
  computed: {
    sliderOptions() {
      return {
        breakpoints: this.breakpoints,
        controls: this.controls,
        dragSpeed: this.dragSpeed,
        initial: this.initial,
        vertical: this.vertical,
        loop: this.loop,
        mode: this.mode,
        duration: this.duration,
        resetSlide: this.resetSlide,
        slidesPerView: this.slidesPerView,
        spacing: this.spacing,
        rubberband: this.rubberband,
        centered: this.centered,
      }
    },
    dotHelper() {
      return this.keenSlider
        ? [...Array(this.keenSlider.details().size).keys()]
        : []
    },
    extraAttributes() {
      if (this.useParentScopeId && this.parentScopeId) {
        let parentScope = this.parentScopeId
        return {
          [parentScope]: true,
        }
      } else {
        return {}
      }
    },
    parentScopeId() {
      return this.$parent.$options._scopeId
    },
  },
  mounted() {
    if (typeof window !== 'undefined') {
      this.$nextTick(() => {
        this.initialize()
      })
    }
    this.current = this.initial
  },
  beforeDestroy() {
    if (this.keenSlider) {
      this.keenSlider.destroy()
    }
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.$emit('destroy')
  },
  methods: {
    initialize() {
      this.keenSlider = new KeenSliderLib(
        this.$refs.sliderRef,
        this.getCombinedOptions()
      )
      this.initAutoplay()
      this.$watch('$props', () => {
        this.refresh()
      })
    },
    refresh() {
      if (this.keenSlider) {
        this.keenSlider.refresh(this.getCombinedOptions())
        this.initAutoplay()
      }
    },
    initAutoplay() {
      if (this.interval) {
        clearInterval(this.interval)
      }
      if (this.autoplay) {
        let time = 3000
        if (typeof this.autoplay === 'number') {
          time = this.autoplay
        } else if (typeof this.autoplay === 'string') {
          let parsedTime = parseInt(this.autoplay)
          if (parsedTime > 0) {
            time = parsedTime
          }
        }
        this.interval = setInterval(() => {
          if (!this.focused) {
            this.next()
          }
        }, time)
      }
    },
    getCombinedOptions() {
      return {
        ...this.sliderOptions,
        ...this.generateEventHooks(),
      }
    },
    generateEventHooks() {
      const events = [
        'afterChange',
        'beforeChange',
        'mounted',
        'created',
        'slideChanged',
        'dragEnd',
        'dragStart',
        'move',
      ]
      const hookObject = {}
      for (const Key of events) {
        if (Key === 'slideChanged') {
          hookObject[Key] = (...args) => {
            if (this.keenSlider) {
              this.current = this.keenSlider.details().relativeSlide
            }
            this.$emit(Key, ...args)
          }
        } else {
          hookObject[Key] = (...args) => {
            if (Key === 'dragStart' && this.interval) {
              clearInterval(this.interval)
            }
            if (Key === 'dragEnd') {
              this.initAutoplay()
            }
            this.$emit(Key, ...args)
          }
        }
      }
      return hookObject
    },
    moveToSlide(slide, duration) {
      if (this.keenSlider) {
        this.keenSlider.moveToSlide(slide, duration)
      }
    },
    moveToSlideRelative(slide, nearest, duration) {
      if (this.keenSlider) {
        this.keenSlider.moveToSlideRelative(slide, nearest, duration)
      }
    },
    next() {
      if (this.keenSlider) {
        this.keenSlider.next()
      }
    },
    prev() {
      if (this.keenSlider) {
        this.keenSlider.prev()
      }
    },
    resize() {
      if (this.keenSlider) {
        this.keenSlider.resize()
      }
    },
  },
}
</script>

<template>
  <div
    class="ssr-carousel"
    v-if="$slots.default() && $slots.default().length"
    :key="$slots.default().length"
    :data-ssrc-id="scopeId"
    @keyup.tab="onTab"
  >
    <span v-html="instanceStyles" />
    <div class="ssr-carousel-slides">
      <div class="ssr-peek-values" ref="peekValues" :style="peekStyles"></div>
      <div
        class="ssr-carousel-mask"
        ref="mask"
        v-on="maskListeners"
        :class="{
          pressing,
          disabled,
          'no-mask': overflowVisible,
          'not-draggable': noDrag
        }"
      >
        <ssr-carousel-track
          ref="track"
          v-bind="{
            dragging,
            trackTranslateX,
            slideOrder,
            activeSlides,
            leftPeekingSlideIndex,
            rightPeekingSlideIndex
          }"
        >
          <template #default>
            <slot></slot>
          </template>

          <template v-if="hasPeekClones" #clones>
            <slot></slot>
          </template>
        </ssr-carousel-track>
      </div>
      <ssr-carousel-arrows
        v-if="showArrows"
        v-bind="{ index, pages, shouldLoop }"
        @back="back"
        @next="next"
      >
        <template #back="props">
          <slot name="back-arrow" v-bind="props"></slot>
        </template>
        <template #next="props">
          <slot name="next-arrow" v-bind="props"></slot>
        </template>
      </ssr-carousel-arrows>
      <ssr-carousel-dots
        v-if="showDots"
        v-bind="{ boundedIndex, pages }"
        @goto="gotoDot"
      >
        <template #dot="props">
          <slot name="dot" v-bind="props"></slot>
        </template>
      </ssr-carousel-dots>
      <div
        class="ssr-carousel-visually-hidden"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ currentSlideMessage }}
      </div>
    </div>
  </div>
</template>

<script>
// Child components
import SsrCarouselArrows from './ssr-carousel-arrows';
import SsrCarouselDots from './ssr-carousel-dots';
import SsrCarouselTrack from './ssr-carousel-track';

// Concerns
import accessibility from './concerns/accessibility';
import autoplay from './concerns/autoplay';
import dimensions from './concerns/dimensions';
import dragging from './concerns/dragging';
import feathering from './concerns/feathering';
import focus from './concerns/focus';
import gutters from './concerns/gutters';
import looping from './concerns/looping';
import pagination from './concerns/pagination';
import peeking from './concerns/peeking';
import responsive from './concerns/responsive';
import tweening from './concerns/tweening';
import variableWidth from './concerns/variable-width';

export default {
  name: 'SsrCarousel',
  mixins: [
    accessibility,
    autoplay,
    dimensions,
    dragging,
    feathering,
    focus,
    gutters,
    looping,
    pagination,
    responsive,
    peeking, // After `responsive` so prop can access `gutter` prop
    tweening,
    variableWidth
  ],
  components: {
    SsrCarouselArrows,
    SsrCarouselDots,
    SsrCarouselTrack
  },
  emits: [
    'update:modelValue',
    'tween:start',
    'tween:end',
    'drag:start',
    'drag:end',
    'change',
    'release',
    'press'
  ],
  props: {
    showArrows: {
      type: Boolean
    },
    showDots: {
      type: Boolean
    }
  },
  computed: {
    // Combine the different factors that come together to determine the x
    // transform of the track.  We don't return a value until the carousel
    // width is measured since the calculation depends on that.
    trackTranslateX() {
      if (!(this.carouselWidth && !this.disabled)) return;
      return (
        this.currentX + // The value from tweening or dragging
        this.trackLoopOffset + // Offset from re-ordering slides for looping
        this.peekLeftPx // Offset slides for the left peek
      );
    },
    watchesHover() {
      return this.autoplayDelay > 0;
    },
    maskListeners() {
      if (this.disabled) return {};
      return {
        ...(this.noDrag
          ? {}
          : {
              mousedown: this.onPointerDown,
              touchstart: this.onPointerDown
            }),
        ...(!this.watchesHover
          ? {}
          : {
              mouseenter: this.onEnter,
              mouseleave: this.onLeave
            })
      };
    }
  }
};
</script>

<style lang="scss">
.ssr-carousel {
  touch-action: pan-y;
}

.ssr-carousel-slides {
  position: relative;
}

.ssr-peek-values {
  position: absolute;
}

.ssr-carousel-mask {
  position: relative;

  &:not(.no-mask) {
    overflow: hidden;
  }

  &:not(.disabled):not(.not-draggable) {
    cursor: grab;
  }

  &:not(.disabled):not(.not-draggable).pressing {
    cursor: grabbing;
  }
}

.ssr-carousel-visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
}
</style>

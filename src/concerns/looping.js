// Code related to looping / infinite scroll
export default {
  props: {
    // Add prop to enable looping
    loop: Boolean,
    // Place the first slide in the center of the layout
    center: Boolean
  },
  data() {
    return {
      slideOrder: []
    };
  },
  computed: {
    // Disable looping when the user is using keyboard navigation
    shouldLoop() {
      return this.loop && !this.usingKeyboard;
    },
    // This represents the current (as in while scrolling / animating) left most
    // slide index. This is used in looping calculation so that the reordering
    // of slides isn't affected by paginatePerSlide setting.
    currentSlideIndex() {
      return Math.floor((this.currentX / this.slideWidth) * -1);
    },
    // When looping, slides get re-ordered. This value is added to the
    // track transform so that the slides don't feel like they were re-ordered.
    trackLoopOffset() {
      if (!this.shouldLoop) return 0;
      let offsetSlideCount = this.currentSlideIndex;
      if (this.hasLeftPeekClone) offsetSlideCount -= 1;
      return offsetSlideCount * this.slideWidth;
    },
    // Get slideIndex of the right most and left most slides indexes
    leftMostSlideIndex() {
      return this.slideOrder.findIndex((index) => index === 0);
    },
    rightMostSlideIndex() {
      return this.slideOrder.findIndex(
        (index) => index === this.slideOrder.length - 1
      );
    }
  },
  watch: {
    // This represents the current (as in while scrolling / animating) left most
    // slide index. This is used in looping calculation so that the reordering
    // of slides isn't affected by paginatePerSlide setting.
    currentSlideIndex: {
      immediate: true,
      handler() {
        this.setSlideOrder();
      }
    },
    // Also update the slide order when the slides per page changes
    currentSlidesPerPage() {
      this.setSlideOrder();
    }
  },
  methods: {
    // Calculating via watcher to prevent unnecessary recalculations (I noticed a
    // bunch of calls when this was done via a computed property)
    setSlideOrder() {
      // Make an array as long as the slides count with incrementing values
      let indices = [...Array(this.slidesCount).keys()];
      let count = indices.length;

      // Shift the order to apply centering effect
      if (this.center) {
        let split = Math.floor(this.currentSlidesPerPage / 2);
        indices = [...indices.slice(split), ...indices.slice(0, split)];
      }

      // Re-order while looping
      if (this.shouldLoop) {
        let split = (count - this.currentSlideIndex) % count;
        indices = [...indices.slice(split), ...indices.slice(0, split)];
      }

      // Set the new index order
      this.slideOrder = indices;
    },
    // Reorder the initial slide state using CSS because the order is dependent
    // on the slides per page which isn't known via JS until hydrating
    makeBreakpointSlideOrderStyle(breakpoint) {
      if (!this.center) return;
      let slidesPerPage = this.getResponsiveValue('slidesPerPage', breakpoint);
      let split = Math.floor(slidesPerPage / 2);
      let rules = [];
      for (let i = 0; i <= this.slidesCount; i++) {
        rules.push(`
          ${this.scopeSelector} .ssr-carousel-slide:nth-child(${i + 1}) {
            order: ${(i + split) % this.slidesCount};
          }
        `);
      }
      return rules.join('');
    }
  }
};

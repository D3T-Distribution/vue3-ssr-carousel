// Code related to measuring the size of the carousel after mounting

export default {
  data() {
    return {
      viewportWidth: null, // Width of the viewport, for media query calculation
      carouselWidth: null, // Width of a page of the carousel
      gutterWidth: 0 // Computed width of gutters, since they support css vars
    };
  },

  // Add resize listening
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },

  // Cleanup listeners
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  computed: {
    // The width of a page of slides, which may be less than the carouselWidth
    // if there is peeking. This includes the affect of gutters.
    pageWidth() {
      return this.carouselWidth - this.combinedPeek;
    },

    // Calculate the width of a slide based on client side measured pageWidth
    // rather than measuring it explicitly in the DOM. This value includes the
    // gutter.
    slideWidth() {
      return this.pageWidth / this.currentSlidesPerPage;
    },

    // Calculate the width of the whole track from the slideWidth.
    trackWidth() {
      if (this.isVariableWidth) {
        return this.measuredTrackWidth + this.gutterWidth;
      } else {
        return this.slideWidth * this.slidesCount;
      }
    },

    // Figure out the width of the last page, which may not have enough slides
    // to fill it.
    lastPageWidth() {
      // Determine how many slides are on the final page of pagination. If the
      // remainder was 0, that means the page is flush with slides, so swap
      // the 0 for the max amount.
      const slidesPerPage = this.currentSlidesPerPage;
      let slidesOnLastPage = this.slidesCount % slidesPerPage;
      if (slidesOnLastPage === 0) {
        slidesOnLastPage = slidesPerPage;
      }

      // Turn the slide count into a width value
      return slidesOnLastPage * this.slideWidth;
    },

    // The ending x value, only used when not looping. The peeking values in
    // here result in the final page using the left peeking value and the
    // actualy peeking appearing to apply to the left. The +1 is to fix subpixel
    // rounding issues.
    endX() {
      return this.disabled
        ? 0
        : this.pageWidth -
            this.trackWidth -
            this.peekLeftPx +
            this.peekRightPx +
            1;
    },

    // Check if the drag is currently out bounds
    isOutOfBounds() {
      return this.currentX > 0 || this.currentX < this.endX;
    }
  },

  methods: {
    // Measure the component width for various calculations. Using
    // getBoundingClientRect so we can get fractional values.  We also need
    // the width of the gutter since that's effectively part of the page.
    onResize() {
      if (!this.$el?.nodeType === Node.ELEMENT_NODE) {
        return;
      }

      const firstSlide = this.$refs.track?.$el.firstElementChild;
      if (!firstSlide) {
        return;
      }

      this.gutterWidth = parseInt(getComputedStyle(firstSlide).marginRight);
      this.carouselWidth =
        this.$el.getBoundingClientRect().width + this.gutterWidth;
      this.viewportWidth = window.innerWidth;
      this.capturePeekingMeasurements();

      if (this.isVariableWidth) {
        this.captureTrackWidth();
      }
    },

    // Make the width style that gives a slide it's width given
    // slidesPerPage. Reduce this width by the gutter if present
    makeBreakpointSlideWidthStyle(breakpoint) {
      if (this.isVariableWidth) {
        return;
      }

      return `
        ${this.scopeSelector} .ssr-carousel-slide {
          width: ${this.makeSlideWidthCalc(breakpoint)};
        }
      `;
    },

    // Build the calc string which makes a percentage width for a slide and
    // reduces it by combined peeking and gutter influence. The computed
    // style this produces should have an equal value to the `slideWidth`
    // computed property which is client side JS dependent.

    makeSlideWidthCalc(breakpoint) {
      const isDisabled = this.isDisabledAtBreakpoint(breakpoint);
      const slidesPerPage = this.getResponsiveValue(
        'slidesPerPage',
        breakpoint
      );
      const gutter = this.getResponsiveValue('gutter', breakpoint);

      // A common use case when not looping is to have a larger peek on just the
      // right.  But when disabled, this looks strange.  So this balances out
      // the peeking in the disbaled state.
      let peekLeft = this.getResponsiveValue('peekLeft', breakpoint);
      let peekRight = this.getResponsiveValue('peekRight', breakpoint);
      if (this.matchPeekWhenDisabled && isDisabled) {
        peekRight = peekLeft;
      }

      // Render the styles
      return `calc(
				${100 / slidesPerPage}% -
				(${this.autoUnit(peekLeft)} + ${this.autoUnit(peekRight)}) / ${slidesPerPage} -
				(${this.autoUnit(gutter)} * ${slidesPerPage - 1}) / ${slidesPerPage}
			)`;
    }
  }
};

// Code related to allowing edge slides to peek in from the side, including empty
// gutter space.
export default {
  props: {
    // Use gutter's as the peeking value
    peekGutter: Boolean,
    // Set both peeking values at once
    peek: {
      type: [Number, String],
      default(rawProps) {
        // Prevent subpixel rounding issues from causing a sliver of offscreen
        // slide from peaking in.
        if (!rawProps.peekGutter) return 0;
        return `calc(${rawProps.gutter} - 1px)`;
      }
    },
    // Distinct left/right peeking values
    peekLeft: {
      type: [Number, String],
      default(rawProps) {
        return rawProps.peek;
      }
    },
    peekRight: {
      type: [Number, String],
      default(rawProps) {
        return rawProps.peek;
      }
    },
    // When true, the peekLeft is used for the peekRight if the carousel is
    // disabled.  This behavior is expecting that there may be a different
    // peekRight (to hint at additional slides) but when there
    // aren't more slide to peek in, the peek value should functional like padding.
    matchPeekWhenDisabled: {
      type: Boolean,
      default: true
    },
    // Disable the overflow:hidden on the mask
    overflowVisible: Boolean
  },
  data() {
    return {
      // Store clones of the slides used for peeking
      clones: [],
      // Store computed peek values
      peekLeftPx: 0,
      peekRightPx: 0
    };
  },
  computed: {
    // Determine if clones should be created
    hasPeekClones() {
      return this.hasLeftPeekClone || this.hasRightPeekClone;
    },
    hasPeekPrerequisites() {
      return this.shouldLoop && this.slidesCount > 1;
    },
    hasLeftPeekClone() {
      return this.hasPeekPrerequisites && this.peekLeft;
    },
    hasRightPeekClone() {
      return this.hasPeekPrerequisites && this.peekRight;
    },
    // Figure out which slide indexes to show in the left and right peek slots
    leftPeekingSlideIndex() {
      if (this.hasLeftPeekClone) {
        return this.rightMostSlideIndex;
      }
    },
    rightPeekingSlideIndex() {
      if (this.hasRightPeekClone) {
        return this.leftMostSlideIndex;
      }
    },
    // Combine the peeking values, which is needed commonly
    combinedPeek() {
      return this.peekLeftPx + this.peekRightPx;
    },
    // Make the styles object for reading computed styles
    peekStyles() {
      const breakpoint = this.currentResponsiveBreakpoint;
      return {
        left: this.autoUnit(this.getResponsiveValue('peekLeft', breakpoint)),
        right: this.autoUnit(this.getResponsiveValue('peekRight', breakpoint))
      };
    }
  },
  watch: {
    // Recapture peeking values if the source props change
    peekLeft() {
      this.capturePeekingMeasurements();
    },
    peekRight() {
      this.capturePeekingMeasurements();
    },
    peek() {
      this.capturePeekingMeasurements();
    },
    peekGutter() {
      this.capturePeekingMeasurements();
    },
    responsive() {
      this.capturePeekingMeasurements();
    }
  },
  methods: {
    // Capture measurements of peeking values
    capturePeekingMeasurements() {
      if (!this.$refs.peekValues) return;
      const styles = getComputedStyle(this.$refs.peekValues);
      this.peekLeftPx = parseInt(styles.left);
      this.peekRightPx = parseInt(styles.right);
    },
    // Calculate the offset that gets added to the current position to account
    // for prepended slides from peeking. This replicates the JS required to
    // make `trackLoopOffset` using CSS only so there is now reflow when JS
    // hydrates.  This gets overridden by the track's inline translateX style.
    makeBreakpointTrackTransformStyle(breakpoint) {
      if (this.isDisabledAtBreakpoint(breakpoint)) return;
      const peekLeft = this.getResponsiveValue('peekLeft', breakpoint);
      // If no peeking slide, just add the offset
      let rule;
      if (!this.hasLeftPeekClone) {
        rule = `transform: translateX(${this.autoUnit(peekLeft)});`;
      } else {
        const gutter = this.getResponsiveValue('gutter', breakpoint);
        rule = `transform: translateX(calc(${this.autoUnit(
          peekLeft
        )} - (${this.makeSlideWidthCalc(breakpoint)} + ${this.autoUnit(
          gutter
        )})));`;
      }
      // Wrap rule in selector
      return `${this.scopeSelector} .ssr-carousel-track { ${rule} }`;
    }
  }
};

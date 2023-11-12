import { Fragment } from 'vue';

const getSlotChildrenText = (node) => {
  if (!node.children || typeof node.children === 'string')
    return node.children || '';
  else if (Array.isArray(node.children))
    return getSlotChildrenText(node.children);
  else if (node.children.default)
    return getSlotChildrenText(node.children.default());
};

// Code related to dealing with advancing between pages
export default {
  props: {
    // If true, advance whole pages when navigating
    paginateBySlide: Boolean,
    // Syncs to the `index` value via v-model
    modelValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      index: this.modelValue, // The current page; when looping may exceed slideCount
      currentX: 0, // The actual left offset of the slides container
      targetX: 0 // Where we may be tweening the slide to
    };
  },
  computed: {
    // The current number of pages
    pages() {
      if (this.paginateBySlide) {
        if (this.shouldLoop) {
          return this.slidesCount;
        }
        return this.slidesCount - this.currentSlidesPerPage + 1;
      }
      return Math.ceil(this.slidesCount / this.currentSlidesPerPage);
    },
    // Disable carousel-ness when there aren't enough slides
    disabled() {
      if (this.isVariableWidth) {
        return Math.round(this.trackWidth) <= Math.round(this.carouselWidth);
      }
      return this.slidesCount <= this.currentSlidesPerPage;
    },
    // Get just the slotted slides that are components, ignoring text nodes
    // which may exist as a result of whitespace
    slides() {
      return (
        this.getDefaultSlides(this.$slots.default()) ||
        [].filter((vnode) => !getSlotChildrenText(vnode))
      );
    },
    // Get the total number of slides
    slidesCount() {
      return this.slides.length;
    },
    // Apply boundaries to the index, which will exceed them when looping
    boundedIndex() {
      const boundedIndex = this.index % this.pages;
      if (boundedIndex < 0) {
        return this.pages + boundedIndex;
      } else {
        return boundedIndex;
      }
    },
    // The current incomplete page offset
    currentIncompletePageOffset() {
      return this.makeIncompletePageOffset(this.index);
    },
    // Get an array of slide offsets of the slides that are 100% in the
    // viewport. Aka, the count will be equal the currentSlidesPerPage per page.
    activeSlides() {
      // If variable width, we're not currently measuring the width of the slides
      // in JS, so we can't know which are active, so treat all of them as active.
      if (this.isVariableWidth) {
        return [...Array(this.slidesCount).keys()];
      }

      // Get the offset of the leftmost slide in the current viewport
      let start = this.paginateBySlide
        ? this.boundedIndex
        : this.boundedIndex * this.currentSlidesPerPage;

      // Adjust the start if not looping and on the last page of slides and there
      // aren't enough slides to make a full page
      if (!this.shouldLoop) {
        start -= this.boundedIndex % this.currentSlidesPerPage;
      }
      const results = [];
      for (let i = start; i < start + this.currentSlidesPerPage; i++) {
        results.push(i);
      }

      return results.reduce((slides, offset) => {
        // When looping, use modulo to loop back around
        if (this.shouldLoop) {
          slides.push(offset % this.slidesCount);
          // Else, cap the offset to the last slide
        } else if (offset < this.slidesCount) {
          slides.push(offset);
        }
        // Return updated slides
        return slides;
      }, []);
    }
  },
  watch: {
    // Treat v-model update:modelValue as a "goto" request
    modelValue() {
      // If the value exceeds the bounds, immediately emit a new input event
      // with the corrected value
      if (this.modelValue !== this.applyIndexBoundaries(this.modelValue)) {
        this.$emit('update:modelValue', this.boundedIndex);
      }
      // Else if the incoming value is different than the current value
      // then tween to it
      else if (this.modelValue !== this.boundedIndex) {
        this.goto(this.modelValue);
      }
    },
    // Emit events on index change
    boundedIndex() {
      this.$emit('change', { index: this.boundedIndex });
      this.$emit('update:modelValue', this.boundedIndex); // For v-model
    }
  },
  methods: {
    getDefaultSlides(vnodes) {
      return vnodes.reduce((acc, vnode) => {
        if (vnode.type === Fragment) {
          if (Array.isArray(vnode.children)) {
            acc = [...acc, ...this.getDefaultSlides(vnode.children)];
          }
        } else {
          acc.push(vnode);
        }
        return acc;
      }, []);
    },
    // Advance methods
    next() {
      this.goto(this.index + 1);
    },
    back() {
      this.goto(this.index - 1);
    },
    // The dots are ignorant of looping, so convert their bounded index to the
    // true index so we don't animate through a ton of pages going to the
    // clicked dot.
    gotoDot(dotIndex) {
      this.goto(dotIndex - this.boundedIndex + this.index);
    },
    // Go to a specific index
    goto(index) {
      this.index = this.applyIndexBoundaries(index);
      this.tweenToIndex(this.index);
    },
    // Go to the beginning of track
    gotoStart() {
      if (this.isVariableWidth) {
        this.tweenToX(0);
      } else {
        this.goto(0);
      }
    },
    // Go to the end of the track
    gotoEnd() {
      if (this.isVariableWidth) {
        this.tweenToX(this.endX);
      } else {
        this.goto(this.pages - 1);
      }
    },
    // Tween to a specific index
    tweenToIndex(index) {
      this.targetX = this.getXForIndex(index);
      this.startTweening();
    },
    // Jump to an index with no tween
    jumpToIndex(index) {
      this.currentX = this.targetX = this.getXForIndex(index);
    },
    // Calculate the X value given an index
    getXForIndex(index) {
      // Figure out the new x position
      let x = this.paginateBySlide
        ? index * this.slideWidth * -1
        : index * this.pageWidth * -1;

      // Apply adjustments to x value and persist
      x += this.makeIncompletePageOffset(index);
      return Math.round(this.applyXBoundaries(x));
    },
    // Creates a px value to represent adjustments that should be made to
    // account for incomplete pages of slides when looping is enabled. Like
    // when there are 3 slotted slides and 2 slides per page and you have looped
    // over to the 2nd page index of 0. The track needs to be shifted to the
    // left by one slideWidth in this case.
    makeIncompletePageOffset(index) {
      if (!(this.shouldLoop && !this.paginateBySlide)) {
        return 0;
      }
      const incompleteWidth = this.pageWidth - this.lastPageWidth;
      return Math.floor(index / this.pages) * incompleteWidth;
    },
    // Apply boundaries to the index
    applyIndexBoundaries(index) {
      return this.shouldLoop
        ? index
        : Math.max(0, Math.min(this.pages - 1, index));
    }
  }
};

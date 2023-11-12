<!-- The track that hosts the slides -->
<script>
import { h, Fragment } from 'vue';

const interactiveSelector = 'a, button, input, textarea, select';
const getSlotChildrenText = (node) => {
  if (!node.children || typeof node.children === 'string')
    return node.children || '';
  else if (Array.isArray(node.children))
    return getSlotChildrenText(node.children);
  else if (node.children.default)
    return getSlotChildrenText(node.children.default);
};

export default {
  props: {
    dragging: {
      type: Boolean
    },
    trackTranslateX: {
      type: Number
    },
    slideOrder: {
      type: Array
    },
    activeSlides: {
      type: Array
    },
    leftPeekingSlideIndex: {
      type: Number
    },
    rightPeekingSlideIndex: {
      type: Number
    }
  },

  // Set tabindex of inactive slides on mount
  mounted() {
    this.denyTabIndex(this.inactiveSlides);
    this.denyTabIndex(this.clonedSlides);
  },

  computed: {
    // Get the count of non-cloned slides
    uniqueSlidesCount() {
      return this.slideOrder.length;
    },

    // Get the total slides count, including clones
    allSlidesCount() {
      return this.getSlideComponents().length;
    },

    // Make an array of inactive slide indices
    // Make an array of inactive slide indices
    inactiveSlides() {
      return Array.from(
        { length: this.uniqueSlidesCount },
        (_, index) => index
      ).filter((index) => !this.activeSlides.includes(index));
    },

    // An array of the cloned slides indices
    clonedSlides() {
      return Array.from(
        { length: this.allSlidesCount - this.uniqueSlidesCount },
        (_, index) => index + this.uniqueSlidesCount
      );
    },

    // Styles that are used to position the track
    styles() {
      if (this.trackTranslateX) {
        return {
          transform: `translateX(${this.trackTranslateX}px)`
        };
      }
    }
  },

  // Update the tabindex of interactive elements when slides change
  watch: {
    activeSlides() {
      this.allowTabIndex(this.activeSlides);
      this.denyTabIndex(this.inactiveSlides);
    }
  },
  methods: {
    makeSlides() {
      return this.getSlideComponents().map((vnode, index) => {
        // This is a peeking clone if it's index is greater than the slide count
        const slideCount = this.uniqueSlidesCount;
        const isPeekingClone = index >= slideCount;
        const peekingIndex = index - slideCount;

        let {
          class: staticClass = '',
          style = {},
          attrs = {}
        } = vnode.props || {};
        let key = vnode.key;

        // Add the slide class using staticClass since it isn't reactive to data
        const cssClass = 'ssr-carousel-slide';
        staticClass += staticClass ? ` ${cssClass}` : cssClass;

        // Order the slide, like for looping
        if (!isPeekingClone) {
          style.order = this.slideOrder[index] || 0;
        }

        // Or put at the beginning / end if peeking
        else {
          style.order =
            peekingIndex === this.leftPeekingSlideIndex
              ? '-1'
              : peekingIndex === this.rightPeekingSlideIndex
              ? this.slideOrder.length
              : undefined;
        }

        // Hide cloned slides that aren't involved in peeking
        if (
          isPeekingClone &&
          ![this.leftPeekingSlideIndex, this.rightPeekingSlideIndex].includes(
            peekingIndex
          )
        ) {
          style.display = 'none';
        }

        // Make peeking clones and slides not in viewport as aria-hidden
        if (isPeekingClone || !this.activeSlides.includes(index)) {
          attrs['aria-hidden'] = 'true';
        }

        // Prevent duplicate keys on clones
        if (isPeekingClone && key) {
          key += `-clone-${index}`;
        }

        vnode.key = key;
        vnode.props = {
          ...vnode.props,
          class: staticClass,
          style,
          ...attrs
        };

        // Return modified vnode
        return vnode;
      });
    },
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
    // Get the list of non-text slides, including peeking clones. This doesn't
    // work as a computed function
    getSlideComponents() {
      const defaultSlots = this.getDefaultSlides(this.$slots.default() || []);
      const clonedSlots = this.getDefaultSlides(this.$slots.clones?.() || []);
      return [...defaultSlots, ...clonedSlots].filter(
        (vnode) => !getSlotChildrenText(vnode)
      );
    },

    // Prevent tabbing to interactive elements in slides with the passed in
    // index values
    denyTabIndex(indices) {
      this.setTabIndex(indices, -1);
    },

    // Allow tabindex on interactive elements in slides with the passed in
    // index values
    allowTabIndex(indices) {
      this.setTabIndex(indices, 0);
    },

    // Set tabindex value on interactive elements in slides with the passed in slides
    setTabIndex(indices, tabindexValue) {
      for (const el of this.getSlideElementsByIndices(indices)) {
        // Set tabindex value on the slide, like in the case that the slide is
        // an <a>
        if (el.matches(interactiveSelector)) {
          el.tabIndex = tabindexValue;
        }

        // Set tabindex values on all interactive children
        el.querySelectorAll(interactiveSelector).forEach((el) => {
          el.tabIndex = tabindexValue;
        });
      }
    },

    // Get the slide elements that match the array of indices
    getSlideElementsByIndices(slideIndices) {
      return Array.from(this.$el.children).filter((el, i) => i in slideIndices);
    }
  },
  render() {
    return h(
      'div',
      {
        class: ['ssr-carousel-track', { dragging: this.dragging }],
        style: this.styles
      },
      this.makeSlides()
    );
  }
};
</script>

<style lang="scss">
// Setup slides for horizontal layout
.ssr-carousel-track {
  display: flex;

  // Don't allow text selection
  user-select: none;

  // When dragging, disable pointer events. This clears a tick after the mouse
  // is released so links aren't followed on mouse up.
  &.dragging {
    pointer-events: none;
  }
}

.ssr-carousel-slide {
  flex-shrink: 0;
}

.ssr-carousel-mask.disabled .ssr-carousel-slide[aria-hidden='true'] {
  display: none;
}
</style>

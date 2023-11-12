// Code related to changing the slides per page at different viewport widths
export default {
  props: {
    // How many slides are visible at once in the viewport if no responsive
    // rules apply
    slidesPerPage: {
      type: Number,
      default: 1
    },
    // Provide different slides per page at different viewport widths
    responsive: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // Make the css scopeId from things that can influence the styles, like the
    // slides count and props.
    scopeId() {
      return this.hashString(
        this.slidesCount + '|' + JSON.stringify(this.$props)
      );
    },
    // Massage media queries into the responsive prop
    responsiveRules() {
      return this.responsive.map((breakpoint) => {
        return {
          ...breakpoint,
          mediaQuery: this.makeMediaQuery(breakpoint),
          active: this.isBreakpointActive(breakpoint),
          peekLeft:
            breakpoint.peekLeft ||
            breakpoint.peek ||
            (breakpoint.gutter && breakpoint.peekGutter),
          peekRight:
            breakpoint.peekRight ||
            breakpoint.peek ||
            (breakpoint.gutter && breakpoint.peekGutter)
        };
      });
    },
    // Get current responsive values
    currentSlidesPerPage() {
      return this.getResponsiveValue(
        'slidesPerPage',
        this.currentResponsiveBreakpoint
      );
    },
    // Get the current responsive rule by looping backwards through the
    // responsiveRules to return the last matching rule.
    currentResponsiveBreakpoint() {
      const reversedRules = [...this.responsiveRules].reverse();
      const match = reversedRules.find(({ active }) => active);

      if (match) {
        return match;
      } else {
        // Defaults
        return {
          slidesPerPage: this.slidesPerPage,
          gutter: this.gutter,
          peekLeft:
            this.peekLeft || this.peek || (this.gutter && this.peekGutter),
          peekRight:
            this.peekRight || this.peek || (this.gutter && this.peekGutter),
          feather: this.feather
        };
      }
    },
    // Make the scoping selector
    scopeSelector() {
      return `[data-ssrc-id='${this.scopeId}']`;
    },
    // Assemble all the dynamic instance styles
    instanceStyles() {
      return (
        '<style>' +
        this.makeBreakpointStyles(this.$props) +
        this.responsiveRules
          .map((breakpoint) => {
            return `@media ${breakpoint.mediaQuery} {
              ${this.makeBreakpointStyles(breakpoint)}
            }`;
          })
          .join(' ') +
        '</style>'
      );
    }
  },
  watch: {
    // Fix alignment of slides while resizing
    pageWidth() {
      this.jumpToIndex(this.index);
    },
    // If resizing the browser leads to disabling, reset the slide to the first
    // page.  Like if a user had switched to the 2nd page on mobile and then
    // resized to desktop
    disabled() {
      if (this.disabled) this.goto(0);
    }
  },
  methods: {
    // Take an item from the responsive array and make a media query from it
    makeMediaQuery(breakpoint) {
      const rules = [];
      if (breakpoint.maxWidth) {
        rules.push(`(max-width: ${breakpoint.maxWidth}px)`);
      }
      if (breakpoint.minWidth) {
        rules.push(`(min-width: ${breakpoint.minWidth}px)`);
      }
      return rules.join(' and ');
    },
    // Make the block of styles for a breakpoint
    makeBreakpointStyles(breakpoint) {
      return [
        this.makeBreakpointDisablingRules(breakpoint),
        this.makeBreakpointFeatheringStyle(breakpoint),
        this.makeBreakpointTrackTransformStyle(breakpoint),
        this.makeBreakpointSlideWidthStyle(breakpoint),
        this.makeBreakpointSlideGutterStyle(breakpoint),
        this.makeBreakpointSlideOrderStyle(breakpoint)
      ].join(' ');
    },
    // Apply disabling styles via breakpoint when there are not enough slides
    // for the slidesPerPage
    makeBreakpointDisablingRules(breakpoint) {
      const slidesPerPage = this.getResponsiveValue(
        'slidesPerPage',
        breakpoint
      );
      // Disabled, center slides, and hide carousel UI
      if (this.slidesCount <= slidesPerPage) {
        return `
          ${this.scopeSelector} .ssr-carousel-track { justify-content: center; }
          ${this.scopeSelector} .ssr-carousel-arrows,
          ${this.scopeSelector} .ssr-carousel-dots { display: none; }
        `;
      } else {
        // Enabled, restore default styles
        return `
          ${this.scopeSelector} .ssr-carousel-track { justify-content: start; }
          ${this.scopeSelector} .ssr-carousel-arrows { display: block; }
          ${this.scopeSelector} .ssr-carousel-dots { display: flex; }
        `;
      }
    },
    // Check if carousel disabled at the breakpoint
    isDisabledAtBreakpoint(breakpoint) {
      const slidesPerPage = this.getResponsiveValue(
        'slidesPerPage',
        breakpoint
      );
      return this.slidesCount <= slidesPerPage;
    },
    // Check if a breakpoint would apply currently. Not using window.matchQuery
    // so I can consume via a computed property
    isBreakpointActive(breakpoint) {
      if (!this.viewportWidth) return false;
      if (breakpoint.maxWidth && this.viewportWidth > breakpoint.maxWidth)
        return false;
      return !(breakpoint.minWidth && this.viewportWidth < breakpoint.minWidth);
    },
    // Find the first breakpoint with a property set
    getResponsiveValue(property, breakpoint) {
      // If this breakpoint has a value, use it
      if (breakpoint[property] !== undefined) return breakpoint[property];
      // If no responsive rules, use default
      if (!this.responsiveRules.length) return this[property];
      // Check responsive rules to see if any of them contain a value for the
      // property
      const ruleMatch = this.responsiveRules.find((rule) => {
        // Rule must contain this property
        if (!rule[property]) return;
        // Match if rule's min-width is less than the target max-width
        if (
          breakpoint.maxWidth &&
          rule.minWidth &&
          rule.minWidth < breakpoint.maxWidth
        )
          return true;
        // Match if rule's max-width is less than the target max-width
        if (
          breakpoint.maxWidth &&
          rule.maxWidth &&
          rule.maxWidth < breakpoint.maxWidth
        )
          return true;
        // Match if rule's min-width is greater than the target min-width
        if (
          breakpoint.minWidth &&
          rule.minWidth &&
          rule.minWidth > breakpoint.minWidth
        )
          return true;
        // Match if rule's max-width is greater than the target min-width
        if (
          breakpoint.minWidth &&
          rule.maxWidth &&
          rule.minWidth > breakpoint.minWidth
        )
          return true;
      });
      // Return matching property or fallback to the main component prop
      return ruleMatch ? ruleMatch[property] : this[property];
    },
    // Make a hash from a string, adapted from:
    // https://stackoverflow.com/a/33647870/59160
    hashString(str) {
      let hash = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) << 0;
      }
      return hash.toString(36);
    },
    // Add px unit to a value if numeric
    autoUnit(val) {
      return val ? (String(val).match(/^[\d\-.]+$/) ? `${val}px` : val) : '0px';
    }
  }
};

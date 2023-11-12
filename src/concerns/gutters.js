// Code related to the gutters between slides
export default {
  props: {
    // The gutters between slides
    gutter: {
      type: [Number, String],
      default: 20
    }
  },
  methods: {
    // Apply gutters between slides via margins
    makeBreakpointSlideGutterStyle(breakpoint) {
      const gutter = this.getResponsiveValue('gutter', breakpoint);

      // If the carousel would be disabled for not having enough slides, then remove
      // gutter from the last slide.
      const lastChildGutter = this.isDisabledAtBreakpoint(breakpoint)
        ? 0
        : gutter;

      // Render styles
      return `
        ${this.scopeSelector} .ssr-carousel-slide {
          margin-right: ${this.autoUnit(gutter)};
        }
        ${this.scopeSelector} .ssr-carousel-slide:is(:last-child) {
          margin-right: ${this.autoUnit(lastChildGutter)};
        }
      `;
    }
  }
};

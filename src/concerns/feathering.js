// Code related to implementing feathering effect
export default {
  props: {
    // Shorthand for enabling boolean and setting its width
    feather: {
      type: [Boolean, String, Number],
      default: false
    }
  },
  methods: {
    // Add feathering styles via breakpoint
    makeBreakpointFeatheringStyle(breakpoint) {
      // Disable feathering if not enough slides
      if (this.isDisabledAtBreakpoint(breakpoint)) return;

      // Get feathering amount
      let feather = this.getResponsiveValue('feather', breakpoint);
      if (feather === false || feather === null) return;
      feather = feather && typeof feather !== 'boolean' ? feather : 20;
      feather = this.autoUnit(feather);

      // Make the rule value
      let cssValue = `
        linear-gradient(to right,
          transparent, black ${feather},
          black calc(100% - ${feather}),
          transparent)
      `;

      // Write the style, with browser prefixes
      return `
        ${this.scopeSelector} .ssr-carousel-mask {
          -webkit-mask-image: ${cssValue};
          mask-image: ${cssValue};
        }
      `;
    }
  }
};

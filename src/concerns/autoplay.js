// Code related to the autoplay features of the carousel
export default {
  props: {
    // A delay provided in seconds for the autoplay. 0 is disabled
    autoplayDelay: {
      type: Number,
      default: 0
    },
    // Should we pause on hover
    pauseOnFocus: {
      type: Boolean,
      default: true
    }
  },
  // Start autolaying on mount
  mounted() {
    this.autoplayStart();
  },
  beforeDestroy() {
    this.autoplayStop();
  },
  computed: {
    // Conditions that result in pausing autoplay
    autoplayPaused() {
      if (this.usingKeyboard) {
        return true;
      }

      if (this.pauseOnFocus) {
        return this.windowHidden || this.isFocused;
      }
    }
  },
  watch: {
    autoplayPaused(paused) {
      if (paused) {
        this.autoplayStop();
      } else {
        this.autoplayStart();
      }
    }
  },
  methods: {
    autoplayStart() {
      // Require a delay amount
      if (!this.autoplayDelay) {
        return;
      }

      // Don't loop if we only have one page
      if (!this.pages) {
        return;
      }

      // Start autoplaying
      this.autoPlayInterval = setInterval(() => {
        if (!this.autoplayPaused) {
          this.autoplayNext();
        }
        // Only play if not paused
      }, this.autoplayDelay * 1000);
    },
    autoplayStop() {
      clearInterval(this.autoPlayInterval);
    },
    autoplayNext() {
      if (this.shouldLoop || this.index < this.pages - 1) {
        this.next();
      } else {
        // Reset because loop wasn't enabled
        this.goto(0);
      }
    }
  }
};

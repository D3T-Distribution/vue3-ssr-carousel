// Code related to focus and hover state
export default {
  data() {
    return {
      hovered: false,
      windowVisible: true
    };
  },
  computed: {
    isFocused() {
      return this.windowVisible && this.hovered;
    },
    windowHidden() {
      return !this.windowVisible;
    }
  },
  methods: {
    onEnter() {
      this.hovered = true;
    },
    onLeave() {
      this.hovered = false;
    },
    updateVisibility() {
      this.windowVisible = !document.hidden;
    }
  },
  mounted() {
    if (!this.watchesHover) return;
    document.addEventListener('visibilitychange', this.updateVisibility);
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this.updateVisibility);
  }
};

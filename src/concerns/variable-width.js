export default {
  data() {
    return {
      measuredTrackWidth: 0
    };
  },
  computed: {
    isVariableWidth() {
      return this.slidesPerPage == null;
    }
  },
  methods: {
    captureTrackWidth() {
      if (!this.$refs.track) return;
      this.measuredTrackWidth = this.$refs.track.$el.scrollWidth;
    }
  }
};

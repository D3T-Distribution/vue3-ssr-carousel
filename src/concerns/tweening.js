export default {
  props: {
    tweenDampening: {
      type: Number,
      default: 0.12
    },
    tweenInertia: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      currentX: 0,
      targetX: 0,
      tweening: false,
      rafId: null
    };
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.rafId);
  },
  watch: {
    tweening() {
      if (this.tweening) {
        this.$emit('tween:start', { index: this.index });
        this.tweenToTarget();
      } else {
        window.cancelAnimationFrame(this.rafId);
        this.$emit('tween:end', { index: this.index });
      }
    }
  },
  methods: {
    tweenToX(x) {
      this.targetX = Math.round(x);
      this.startTweening();
    },
    startTweening() {
      if (this.tweening) return;
      if (this.currentX === this.targetX) return;
      this.tweening = true;
    },
    stopTweening() {
      this.tweening = false;
    },
    tweenToTarget() {
      this.currentX =
        this.currentX + (this.targetX - this.currentX) * this.tweenDampening;
      if (Math.abs(this.targetX - this.currentX) < 1) {
        this.currentX = this.targetX;
        this.tweening = false;
      } else {
        this.rafId = window.requestAnimationFrame(this.tweenToTarget);
      }
    },
    tweenToStop() {
      this.targetX = this.applyXBoundaries(
        this.currentX + this.dragVelocity * this.tweenInertia
      );
      this.startTweening();
    }
  }
};

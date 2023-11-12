// Code related to handling dragging of the track
const passive = { passive: true };
const notPassive = { passive: false };

export default {
  props: {
    // Boundary drag dampening modifier. Increase to allow greater travel outside the boundaries.
    boundaryDampening: {
      type: Number,
      default: 0.6
    },
    // The percentage of a pageWidth that was dragged before we advance to another page on slide
    dragAdvanceRatio: {
      type: Number,
      default: 0.33
    },
    // The ratio of X:Y mouse travel. Decrease this number to allow for greater y dragging before the drag is cancelled.
    verticalDragTreshold: {
      type: Number,
      default: 1
    },
    // Turn off draggability
    noDrag: {
      type: Boolean
    }
  },
  data() {
    return {
      pressing: false, // The user pressing pointer down
      dragging: false, // The user has translated while pointer was down
      isTouchDrag: false, // Is the browser firing touch events
      startPointer: null, // Where was the mouse when the drag started
      lastPointer: null, // Where was the mouse on the last move event
      dragVelocity: null, // The px/tick while dragging, negative is rightward
      dragDirectionRatio: null // The ratio of horizontal vs vertical dragging
    };
  },
  // Cleanup listeners
  beforeDestroy() {
    window.removeEventListener('mousemove', this.onPointerMove, passive);
    window.removeEventListener('mouseup', this.onPointerUp, passive);
    window.removeEventListener('touchmove', this.onPointerMove, passive);
    window.removeEventListener('touchend', this.onPointerUp, passive);
    window.removeEventListener('touchmove', this.onWinMove, notPassive);
  },
  computed: {
    // The current slide or page index. It rounds differently depending on the direction of the velocity.
    // So that it eases to a stop in the direction the user was dragging.
    dragIndex() {
      // If there is very little velocity, go to the closest page
      if (Math.abs(this.dragVelocity) <= 2)
        return Math.round(this.fractionalIndex);
      // User was moving forward
      if (this.dragVelocity < 0) return Math.ceil(this.fractionalIndex);
      // User was moving backward
      return Math.floor(this.fractionalIndex);
    },
    // Determine the current index given the currentX as a fraction. For instance, when dragging forward,
    // it will be like 0.1 and when you've dragged almost a full page, forward it would be 0.9.
    // This got complicated because the final page may not have a full compliment of slides like if we have 2 per page and 3 slides.
    fractionalIndex() {
      if (!this.trackWidth) return 0;
      let x = this.currentX * -1;
      let setIndex = Math.floor(x / this.trackWidth);
      let widthDivisor = this.paginateBySlide
        ? this.slideWidth
        : this.pageWidth;
      let pageIndex = Math.floor(
        (x - setIndex * this.trackWidth) / widthDivisor
      );
      let distanceIntoPage =
        x - setIndex * this.trackWidth - pageIndex * widthDivisor;
      let slidesPerPage = this.currentSlidesPerPage;
      let remainingSlides = this.shouldLoop
        ? this.slidesCount - pageIndex * slidesPerPage
        : this.slidesCount - (pageIndex + 1) * slidesPerPage;
      let isLastPage = remainingSlides <= slidesPerPage;
      let pageWidth = isLastPage ? this.lastPageWidth : widthDivisor;
      let pageProgressPercent = distanceIntoPage / pageWidth;
      return pageProgressPercent + setIndex * this.pages + pageIndex;
    },
    // Determine if the user is dragging vertically
    isVerticalDrag() {
      if (!this.dragDirectionRatio) return false;
      return this.dragDirectionRatio < this.verticalDragTreshold;
    },
    // If we're horizontally swiping on a touch device, prevent vertical scroll
    preventVerticalScroll() {
      return this.pressing && this.isTouchDrag && !this.isVerticalDrag;
    }
  },
  watch: {
    // Watch for mouse move changes when the user starts dragging
    pressing() {
      let moveEvent, upEvent;
      if (this.isTouchDrag) {
        [moveEvent, upEvent] = ['touchmove', 'touchend'];
      } else {
        [moveEvent, upEvent] = ['mousemove', 'mouseup'];
      }
      if (this.pressing) {
        window.addEventListener(moveEvent, this.onPointerMove, passive);
        window.addEventListener(upEvent, this.onPointerUp, passive);
        window.addEventListener('contextmenu', this.onPointerUp, passive);
        this.dragVelocity = 0; // Reset any previous velocity
        this.preventContentDrag();
        this.stopTweening();
      } else {
        if (this.isOutOfBounds && !this.shouldLoop) {
          if (this.currentX >= 0) this.gotoStart();
          else this.gotoEnd();
        } else if (this.isVariableWidth) {
          this.tweenToStop();
        } else if (this.isVerticalDrag) {
          this.goto(this.index);
        } else {
          this.goto(this.dragIndex);
        }
        window.removeEventListener(moveEvent, this.onPointerMove, passive);
        window.removeEventListener(upEvent, this.onPointerUp, passive);
        window.removeEventListener('contextmenu', this.onPointerUp, passive);
        this.dragging = false;
        this.startPointer = this.lastPointer = this.dragDirectionRatio = null;
      }
      if (this.pressing) this.$emit('press');
      else this.$emit('release');
    },
    // Fire events related to dragging
    dragging() {
      if (this.dragging) this.$emit('drag:start');
      else this.$emit('drag:end');
    },
    // If the user is dragging vertically, end the drag based on the assumption
    // that the user is attempting to scroll the page via touch rather than pan the carousel.
    isVerticalDrag() {
      if (!this.isVerticalDrag && this.isTouchDrag) this.pressing = false;
    },
    // Stop vertical scrolling by listening for touchmove events on the body and cancel them.
    // Need to explicitly set passive because some mobile browsers set it to true by default.
    preventVerticalScroll(shouldPrevent) {
      if (shouldPrevent) {
        window.addEventListener('touchmove', this.stopEvent, notPassive);
      } else {
        window.removeEventListener('touchmove', this.stopEvent, notPassive);
      }
    }
  },
  methods: {
    // Cancel an Event
    stopEvent(e) {
      e.preventDefault();
    },
    // Keep track of whether the user is dragging
    onPointerDown(pointerEvent) {
      this.isTouchDrag = TouchEvent && pointerEvent instanceof TouchEvent;
      this.startPointer = this.lastPointer =
        this.getPointerCoords(pointerEvent);
      this.pressing = true;
      this.usingKeyboard = false;
    },
    // Keep track of release of press
    onPointerUp() {
      this.pressing = false;
    },
    // Keep x values up to date while dragging
    onPointerMove(pointerEvent) {
      this.dragging = true;
      let pointer = this.getPointerCoords(pointerEvent);
      this.dragVelocity = pointer.x - this.lastPointer.x;
      this.targetX += this.dragVelocity;
      this.lastPointer = pointer;
      this.dragDirectionRatio = Math.abs(
        (pointer.x - this.startPointer.x) / (pointer.y - this.startPointer.y)
      );
      this.currentX = this.applyBoundaryDampening(this.targetX);
    },
    // Helper to get the x position of either a touch or mouse event
    getPointerCoords(pointerEvent) {
      return {
        x: pointerEvent.touches?.[0]?.pageX || pointerEvent.pageX,
        y: pointerEvent.touches?.[0]?.pageY || pointerEvent.pageY
      };
    },
    // Prevent dragging from exceeding the min/max edges
    applyBoundaryDampening(x) {
      if (this.shouldLoop) return x; // Don't apply dampening
      if (x > 0) return Math.pow(x, this.boundaryDampening);
      if (x < this.endX)
        return this.endX - Math.pow(this.endX - x, this.boundaryDampening);
      return this.applyXBoundaries(x);
    },
    // Constraint the x value to the min and max values
    applyXBoundaries(x) {
      if (this.shouldLoop) return x; // Don't apply boundaries
      return Math.max(this.endX, Math.min(0, x));
    },
    // Prevent the anchors and images from being draggable (like via their ghost outlines).
    // Using this approach because the draggable HTML attribute didn't work in FF.
    // This only needs to be run once.
    preventContentDrag() {
      if (this.contentDragPrevented) return;
      this.$refs.track.$el.querySelectorAll('a, img').forEach((el) => {
        el.addEventListener('dragstart', (e) => {
          e.preventDefault();
        });
      });
      this.contentDragPrevented = true;
    }
  }
};

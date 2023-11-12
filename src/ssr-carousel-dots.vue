<template>
  <div class="ssr-carousel-dots">
    <button
      class="ssr-carousel-dot-button"
      v-for="i in pages"
      :key="i"
      :aria-label="`Page ${i}`"
      :disabled="isDisabled(i)"
      @click="$emit('goto', i - 1)"
    >
      <slot name="dot" :index="i" :disabled="isDisabled(i)"
        ><span class="ssr-carousel-dot-icon"></span
      ></slot>
    </button>
  </div>
</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script>
export default {
  props: {
    boundedIndex: {
      type: Number
    },
    pages: {
      type: Number
    }
  },
  methods: {
    // Check if dot index should be disabled
    isDisabled(index) {
      return this.boundedIndex === index - 1;
    }
  }
};
</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang="scss">
@mixin circle($size, $color: null) {
  border-radius: 50%;
  height: $size;
  width: $size;
  @if ($color != null) {
    background: $color;
  }
}

.ssr-carousel-dot-button {
  display: inline-block;
  appearance: none;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.ssr-carousel-dots {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.ssr-carousel-dot-icon {
  display: inline-block;
  @include circle(12px);
  border: 2px solid rgba(0, 0, 0, 0.7);
  margin-left: 4px;
  margin-right: 4px;
  transition: opacity 0.2s;
  @media (hover: hover) {
    &:hover {
      opacity: 0.85;
    }
    &:active.active {
      opacity: 1;
    }
  }
}
[disabled] {
  & > .ssr-carousel-dot-icon {
    opacity: 1;
    background: rgba(0, 0, 0, 0.7);
    cursor: default;
  }
}
:not([disabled]) {
  & > .ssr-carousel-dot-icon {
    opacity: 0.5;
  }
}
</style>

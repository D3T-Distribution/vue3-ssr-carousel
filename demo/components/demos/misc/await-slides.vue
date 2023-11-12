<template>
  <div data-cy="await-slides">
    <ssr-carousel show-dots :key="slides.length">
      <slide v-for="slide in slides" :key="slide" :index="slide"></slide>
    </ssr-carousel>
    <button class="add-slide" @click="addSlide">Add a slide</button>
  </div>
</template>

<script>
import Slide from '~/components/slide.vue';

export default {
  components: {
    Slide
  },
  data() {
    return {
      slides: []
    };
  },
  methods: {
    addSlide() {
      this.slides.push(this.slides.length + 1);
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  border: 1px solid currentColor;
  padding: 0.5em;
  border-radius: 0.5em;
  margin-bottom: 1em;
}
</style>

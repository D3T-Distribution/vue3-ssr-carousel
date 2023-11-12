<template>
  <ssr-carousel :slides-per-page="2" show-dots show-arrows>
    <slide :index="1" to="#1"></slide>
    <slide :index="2" to="#2"></slide>
    <slide :index="3" to="#3"></slide>
  </ssr-carousel>
</template>

<script>
import Slide from '~/components/slide.vue';

export default {
  components: {
    Slide
  }
};
</script>

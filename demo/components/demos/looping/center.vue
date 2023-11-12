<template>
  <ssr-carousel :slides-per-page="3" loop center show-dots show-arrows>
    <slide :index="1"></slide>
    <slide :index="2"></slide>
    <slide :index="3"></slide>
    <slide :index="4"></slide>
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

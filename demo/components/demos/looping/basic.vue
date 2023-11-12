<template>
  <ssr-carousel data-cy="basic" loop show-dots show-arrows>
    <slide :index="1"></slide>
    <slide :index="2"></slide>
    <slide :index="3"></slide>
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

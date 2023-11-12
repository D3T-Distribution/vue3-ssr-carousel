<template>
  <ssr-carousel show-dots data-cy="dots">
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

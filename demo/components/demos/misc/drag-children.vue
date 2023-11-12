<template>
  <ssr-carousel :slides-per-page="2">
    <slide :index="1">
      <img src="/img/gradient.png" />
      <p><a href="https://www.bukwild.com">Example link</a></p>
    </slide>
    <slide :index="2">
      <img src="/img/gradient.png" />
      <p><a href="https://www.bukwild.com">Example link</a></p>
    </slide>
    <slide :index="3">
      <img src="/img/gradient.png" />
      <p><a href="https://www.bukwild.com">Example link</a></p>
    </slide>
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

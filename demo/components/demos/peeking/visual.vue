<template>
  <ssr-carousel
    loop
    :slides-per-page="2"
    :peek="80"
    paginate-by-slide
    show-arrows
  >
    <NuxtImg
      src="https://via.placeholder.com/1920x1080/BA3298/FFFFFF?text=Slide+1"
      loading="lazy"
      width="1920"
      height="1080"
    >
    </NuxtImg>
    <NuxtImg
      src="https://via.placeholder.com/1920x1080/5E339E/FFFFFF?text=Slide+2"
      loading="lazy"
      width="1920"
      height="1080"
    >
    </NuxtImg>
    <NuxtImg
      src="https://via.placeholder.com/1920x1080/315AAD/FFFFFF?text=Slide+3"
      loading="lazy"
      width="1920"
      height="1080"
    >
    </NuxtImg>
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

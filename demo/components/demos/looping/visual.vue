<template>
  <ssr-carousel loop>
    <slide>
      <NuxtImg
        src="https://via.placeholder.com/1920x1080?text=Slide+1"
        loading="lazy"
        width="1920"
        height="1080"
      >
      </NuxtImg>
    </slide>
    <slide>
      <NuxtImg
        src="https://via.placeholder.com/1920x1080?text=Slide+2"
        loading="lazy"
        width="1920"
        height="1080"
      >
      </NuxtImg>
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

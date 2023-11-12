<template>
  <div data-cy="v-model">
    <ssr-carousel v-model="page" :loop="loop">
      <slide :index="1"></slide>
      <slide :index="2"></slide>
      <slide :index="3"></slide>
    </ssr-carousel>

    <span class="now">Current Page: {{ page + 1 }}</span>
    <button @click="page--">Back</button>
    <button @click="page++">Next</button>
  </div>
</template>

<script>
import Slide from '~/components/slide.vue';
export default {
  components: {
    Slide
  },
  props: {
    loop: Boolean
  },
  data() {
    return {
      page: 1
    };
  }
};
</script>

<style lang="scss" scoped>
.now {
  margin-right: 1em;
}

button {
  border: 1px solid currentColor;
  padding: 0.5em;
  border-radius: 0.5em;
  margin-bottom: 1em;
}
</style>

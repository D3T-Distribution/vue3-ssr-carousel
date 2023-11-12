import { defineNuxtPlugin } from 'nuxt/app';
import SsrCarousel from '../../src/ssr-carousel.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ssr-carousel', SsrCarousel);
});

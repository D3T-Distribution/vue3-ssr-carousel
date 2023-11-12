import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/image'],
  css: [
    '~/assets/app.scss',
    '~/assets/defaults.scss',
    '~/assets/definitions.scss',
    '~/assets/transitions.scss',
    '~/assets/typography.scss',
    '~/assets/utils.scss',
    '~/assets/whitespace.scss'
  ],

  components: {
    global: true,
    dirs: ['~/components']
  },

  plugins: ['~/plugins/ssr-carousel'],

  // Enable crawler to find dynamic pages
  generate: {
    routes: ['/']
  },

  // @nuxt/content
  content: {
    liveEdit: false,
    documentDriven: true,
    markdown: {
      anchorLinks: false,
      prism: {
        theme: 'prism-themes/themes/prism-atom-dark.css'
      }
    }
  }
});

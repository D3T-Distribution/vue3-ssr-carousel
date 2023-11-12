<!-- The navigation menu -->

<template>
  <ul class="layout-nav">
    <li v-for="link in links" :key="link.path">
      <NuxtLink :to="link.path">{{ link.title }}</NuxtLink>
    </li>
  </ul>
</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script>
export default {
  data() {
    return {
      links: [
        {
          title: 'Introduction',
          path: '/'
        },
        {
          title: 'Events',
          path: '/events'
        },
        {
          title: 'Responsive',
          path: '/responsive'
        },
        {
          title: 'Gutters',
          path: '/gutters'
        },
        {
          title: 'UI',
          path: '/ui'
        },
        {
          title: 'Looping',
          path: '/looping'
        },
        {
          title: 'Peeking',
          path: '/peeking'
        },
        {
          title: 'Accessibility',
          path: '/accessibility'
        },
        {
          title: 'Miscellaneous',
          path: '/misc'
        }
      ]
    };
  }
};
</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang="scss" scoped>
li {
  display: inline-block;
  margin-top: 2px;
  margin-bottom: 2px;

  &:not(:last-child) {
    margin-right: 1em;
  }
}

a {
  opacity: 0.4;
  transition: opacity 0.3s;
  font-size: 14px;

  &.nuxt-link-exact-active {
    opacity: 1;
    font-weight: 600;
  }

  @media (hover: hover) {
    &:hover {
      &:not(.nuxt-link-exact-active) {
        transition-duration: 0.1s;
        opacity: 0.8;
      }
    }
  }
}
</style>

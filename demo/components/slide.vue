<!-- A slide used in demo examples -->

<template>
  <div class="slide" :is="to ? 'a' : 'div'" :href="to || undefined">
    <div class="contents">
      <div v-if="tint" class="tint" :style="{ background: tint }"></div>
      <div v-if="index" class="title">Slide {{ index }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script>
export default {
  props: {
    index: Number,
    tint: String,
    to: String // Optional wrapping link
  }
};
</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang="css">
.slide {
  font-size: 0;
  background: linear-gradient(#32327b, #442768);
  box-shadow:
    inset 0 0 3px 3px #ed1e79,
    inset 0 0 30px 5px #ed1e79;
  border-radius: calc(6.591549295774648px + 0.375586854460094vw);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: calc(21.887323943661972px + 0.563380281690141vw);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.1s;
}

.slide:before {
  content: '';
  padding-top: calc(100% / 1.777777777777778);
  height: 100%;
}

.slide:before,
.slide > * {
  display: inline-block;
  vertical-align: middle;
}

.slide > * {
  font-size: 16px;
}

@media (max-width: 375px) {
  .slide {
    border-radius: 8px;
  }
}

@media (min-width: 1440px) {
  .slide {
    border-radius: 12px;
  }
}

@media (max-width: 375px) {
  .slide {
    padding: 24px;
  }
}

@media (min-width: 1440px) {
  .slide {
    padding: 30px;
  }
}

.slide > div {
  width: 100%;
}

a.slide {
  outline: none;
}

a.slide:hover {
  box-shadow:
    inset 0 0 3px 3px #ed1e79,
    inset 0 0 30px 5px #f0408d;
}

a.slide.focus-visible,
a.slide:focus-visible {
  box-shadow:
    inset 0 0 3px 3px #0cffe1,
    inset 0 0 30px 5px #0cffe1;
}

.tint {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.title {
  font-size: calc(14.366197183098592px + 1.502347417840376vw);
  font-weight: 200;
  text-shadow:
    0 0 5px rgba(12, 255, 225, 0.2),
    0 0 20px #0cffe1;
  text-decoration: none !important;
}

@media (max-width: 375px) {
  .title {
    font-size: 20px;
  }
}

@media (min-width: 1440px) {
  .title {
    font-size: 36px;
  }
}

p {
  margin-top: 0;
  margin-bottom: 0;
}

.contents a {
  text-decoration: underline;
}

article {
  --fluid-gutter: calc(12.95774647887324px + 1.877934272300469vw);
}

@media (min-width: 768px) {
  article {
    padding-top: 60px;
  }
}

@media (max-width: 767px) {
  article {
    padding-top: 40px;
  }
}

@media (max-width: 375px) {
  article {
    --fluid-gutter: 20px;
  }
}

@media (min-width: 1440px) {
  article {
    --fluid-gutter: 40px;
  }
}

header {
  margin-bottom: calc(35.66197183098592px + 1.690140845070422vw);
}

@media (max-width: 375px) {
  header {
    margin-bottom: 42px;
  }
}

@media (min-width: 1440px) {
  header {
    margin-bottom: 60px;
  }
}

@media (min-width: 768px) {
  header {
    display: flex;
    align-items: center;
  }

  header > :last-child {
    flex-grow: 1;
    text-align: right;
  }
}

h1 {
  font-family: 'Nunito', sans-serif;
  font-weight: 400;
  font-size: calc(28.529577464788723px + 1.352112676056339vw);
  line-height: 1.1;
  color: #ed1e79;
}

@media (max-width: 375px) {
  h1 {
    font-size: 33.599999999999994px;
  }
}

@media (min-width: 1440px) {
  h1 {
    font-size: 48px;
  }
}

@media (max-width: 767px) {
  .layout-logo {
    display: none;
  }
}

.layout-nav {
  margin-top: 5px;
}

h2 {
  margin-top: calc(41.32394366197183px + 3.380281690140845vw);
  font-family: 'Nunito', sans-serif;
  font-weight: 400;
  font-size: calc(14.264788732394361px + 0.676056338028169vw);
  line-height: 1.2;
}

@media (max-width: 375px) {
  h2 {
    margin-top: 54px;
  }
}

@media (min-width: 1440px) {
  h2 {
    margin-top: 90px;
  }
}

@media (max-width: 375px) {
  h2 {
    font-size: 16.799999999999997px;
  }
}

@media (min-width: 1440px) {
  h2 {
    font-size: 24px;
  }
}

pre {
  background: #212152;
  border: 1px solid #1b1b43;
  border-radius: calc(6.591549295774648px + 0.375586854460094vw);
  margin-bottom: calc(21.887323943661972px + 0.563380281690141vw);
}

@media (max-width: 375px) {
  pre {
    border-radius: 8px;
  }
}

@media (min-width: 1440px) {
  pre {
    border-radius: 12px;
  }
}

@media (max-width: 375px) {
  pre {
    margin-bottom: 24px;
  }
}

@media (min-width: 1440px) {
  pre {
    margin-bottom: 30px;
  }
}

code {
  font-size: 14px;
  line-height: 1.2;
}

p,
ul {
  line-height: 1.5;
  color: #7a7ac9;
}

p a,
ul a {
  text-decoration: underline;
}

p code,
ul code {
  border: 1px solid #373788;
  border-radius: 2px;
  padding-left: 0.3em;
  padding-right: 0.3em;
  background: #232356;
}

.ssr-carousel {
  margin-top: calc(21.887323943661972px + 0.563380281690141vw);
  margin-bottom: calc(21.887323943661972px + 0.563380281690141vw);
}

@media (max-width: 375px) {
  .ssr-carousel {
    margin-top: 24px;
    margin-bottom: 24px;
  }
}

@media (min-width: 1440px) {
  .ssr-carousel {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}

.clear-page-gutters {
  margin-left: calc(-9.361702127659575px + -2.127659574468085vw);
  margin-right: calc(-9.361702127659575px + -2.127659574468085vw);
  overflow: hidden;
}

@media (max-width: 500px) {
  .clear-page-gutters {
    margin-left: -20px;
    margin-right: -20px;
  }
}

@media (min-width: 1440px) {
  .clear-page-gutters {
    margin-left: -40px;
    margin-right: -40px;
  }
}

.layout-logo {
  font-weight: 600;
  text-shadow:
    0 0 7px #0cffe1,
    0 0 10px #0cffe1,
    0 0 20px rgba(12, 255, 225, 0.5);
}

li {
  display: inline-block;
  margin-top: 2px;
  margin-bottom: 2px;
}

li:not(:last-child) {
  margin-right: 1em;
}

a {
  opacity: 0.4;
  transition: opacity 0.3s;
  font-size: 14px;
}

a.nuxt-link-exact-active {
  opacity: 1;
  font-weight: 600;
}

@media (hover: hover) {
  a:hover,
  a:not(.nuxt-link-exact-active) {
    transition-duration: 0.1s;
    opacity: 0.8;
  }
}
</style>

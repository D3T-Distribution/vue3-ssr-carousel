---
title: 'Miscellaneous'
---

## Carousel is disabled when fewer slides than viewport

Note how this carousel is enabled on mobile viewports but automatically disables on wider viewports.

<demos-misc-disabling></demos-misc-disabling>

```vue
<ssr-carousel
  show-arrows
  show-dots
  loop
  :peek="20"
  :slides-per-page="3"
  :responsive="[
    {
      maxWidth: 767,
      gutter: 10,
      slidesPerPage: 1
    }
  ]"
>
  <slide :index="1"></slide>
  <slide :index="2"></slide>
</ssr-carousel>
```

## Slide images and anchors can be dragged

This is a challenge for some carousels, dragging on an image or anchor results in dragging a ghost image of the element rather than the slide.

<demos-misc-drag-children></demos-misc-drag-children>

```vue
<ssr-carousel :slides-per-page="2">
  <slide :index="1">
    <img src="/img/gradient.png">
    <p><a href="https://www.bukwild.com">Example link</a></p>
  </slide>
  <slide :index="2">
    <img src="/img/gradient.png">
    <p><a href="https://www.bukwild.com">Example link</a></p>
  </slide>
  <slide :index="3">
    <img src="/img/gradient.png">
    <p><a href="https://www.bukwild.com">Example link</a></p>
  </slide>
</ssr-carousel>
```

## Autoplay

Autoplay is typically used in conjunction with `loop`.

<demos-misc-autoplay></demos-misc-autoplay>

```vue
<ssr-carousel :slides-per-page="1" :autoplay-delay="3" loop>
  <slide :index="1"></slide>
  <slide :index="2"></slide>
  <slide :index="3"></slide>
</ssr-carousel>
```

## Slide components stay reactive

Slide properties, like `class`, stay externally reactive as you'd expect. This includes slides cloned for peeking.

<demos-misc-reactivity></demos-misc-reactivity>

```vue
<template>
  <div>
    <ssr-carousel :slides-per-page="2" loop peek="40px">
      <slide :index="1" :class="{ invert }">
        <button @click="invert = !invert">Invert the slides</button>
      </slide>
      <slide :index="2" :class="{ invert }"></slide>
      <slide :index="3" :class="{ invert }"></slide>
    </ssr-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return { invert: false };
  }
};
</script>

<style scoped>
.invert {
  filter: invert(100%);
}
</style>
```

## Carousel doesn't render until there are slides

When you add slides, a `:key` on the root element will cause `vue-ssr-carousel` render a new instance. In other words, your pagination page will be lost and any animations in slides will restart. Generally, you should strive to have all slides ready for render on the initial `create` to benefit from the SSR features of the component.

<demos-misc-await-slides></demos-misc-await-slides>

```vue
<template>
  <div>
    <ssr-carousel show-dots :key="slides.length">
      <slide v-for="slide in slides" :key="slide" :index="slide"></slide>
    </ssr-carousel>
    <button class="add-slide" @click="addSlide">Add a slide</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slides: []
    };
  },
  methods: {
    addSlide() {
      this.slides.push(this.slides.length + 1);
    }
  }
};
</script>
```

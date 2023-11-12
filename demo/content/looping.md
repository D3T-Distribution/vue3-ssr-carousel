---
title: 'Looping'
---

## Basic looping

Looping is also known as `wrapAround` or `infinite` in other carousels.

<demos-looping-basic></demos-looping-basic>

```vue
<ssr-carousel loop show-dots show-arrows>
  <slide :index="1"></slide>
  <slide :index="2"></slide>
  <slide :index="3"></slide>
</ssr-carousel>
```

## Looping with multiple slides per page

Note how the incomplete 2nd page is handled. The 3rd and 1st slide are shown simulataneously. On the next advance forward, the track advances a half width so that the _new_ first page contains the 1st and 2nd slide.

<demos-looping-multiple></demos-looping-multiple>

```vue
<ssr-carousel :slides-per-page="2" loop show-dots show-arrows>
  <slide :index="1"></slide>
  <slide :index="2"></slide>
  <slide :index="3"></slide>
</ssr-carousel>
```

## Looping with centering

This is an example of `center` used with `loop`, a useful pattern for focusing on a featured slide, like in a product carousel.

<demos-looping-center></demos-looping-center>

```vue
<ssr-carousel :slides-per-page="3" loop center show-dots show-arrows>
  <slide :index="1"></slide>
  <slide :index="2"></slide>
  <slide :index="3"></slide>
  <slide :index="4"></slide>
</ssr-carousel>
```

## Cloned slides can contain components

In this case, we're using [NuxtImg](https://image.nuxt.com/usage/nuxt-img) components to render image assets. Note how lazy loading prevents the loading of the second image until you advance forward.

<demos-looping-visual></demos-looping-visual>

```vue
<ssr-carousel loop>
  <slide>
    <NuxtImg
      src="https://via.placeholder.com/1920x1080?text=Slide+1"
      loading="lazy"
      width="1920"
			height="1080">
    </NuxtImg>
  </slide>
  <slide>
    <NuxtImg
      src="https://via.placeholder.com/1920x1080?text=Slide+2"
      loading="lazy"
      width="1920"
			height="1080">
    </NuxtImg>
  </slide>
</ssr-carousel>
```

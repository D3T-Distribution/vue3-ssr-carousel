---
title: 'UI Options'
---

## Built-in arrow nav

<demos-ui-arrows></demos-ui-arrows>

```vue
<ssr-carousel show-arrows>
  <slide :index='1'></slide>
  <slide :index='2'></slide>
  <slide :index='3'></slide>
</ssr-carousel>
```

## Replace the icons through slots

<demos-ui-custom-arrows></demos-ui-custom-arrows>

```vue
<ssr-carousel show-arrows>

  <template>
    <slide :index="1"></slide>
    <slide :index="2"></slide>
    <slide :index="3"></slide>
  </template>

  <template #back-arrow="{ disabled }">
    Back {{ disabled ? "(Disabled)" : "" }}
  </template>

  <template #next-arrow="{ disabled }">
    Next {{ disabled ? "(Disabled)" : "" }}
  </template>
</ssr-carousel>
```

## Built-in dot pagination nav

<demos-ui-dots></demos-ui-dots>

```vue
<ssr-carousel show-dots>
  <slide :index="1"></slide>
  <slide :index="2"></slide>
  <slide :index="3"></slide>
</ssr-carousel>
```

## Per-slide pagination

<demos-ui-paginate-by-slide></demos-ui-paginate-by-slide>

```vue
<ssr-carousel
  show-arrows
  show-dots
  paginate-by-slide
  :slides-per-page="2"
  :gutter="20"
>
  <slide :index="1"></slide>
  <slide :index="2"></slide>
  <slide :index="3"></slide>
  <slide :index="4"></slide>
  <slide :index="5"></slide>
  <slide :index="6"></slide>
</ssr-carousel>
```

## Disable dragging

Also, you can use the `no-drag` prop to disable dragging.

<demos-ui-no-drag></demos-ui-no-drag>

```vue
<ssr-carousel no-drag show-arrows>
  <slide :index="1"></slide>
  <slide :index="2"></slide>
  <slide :index="3"></slide>
</ssr-carousel>
```

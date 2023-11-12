<!-- General layout -->

<template>
  <main class="default-layout max-w">
    <NuxtPage></NuxtPage>
  </main>
</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script>
export default {
  name: 'DefaultLayout'
};
</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang="scss">
@import url(https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;600&display=swap);

.__nuxt-error-page {
  padding: 1rem;
  background: #f7f8fb;
  color: #47494e;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
  font-weight: 100 !important;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.__nuxt-error-page .error {
  max-width: 450px;
}

.__nuxt-error-page .title {
  font-size: 1.5rem;
  margin-top: 15px;
  color: #47494e;
  margin-bottom: 8px;
}

.__nuxt-error-page .description {
  color: #7f828b;
  line-height: 21px;
  margin-bottom: 10px;
}

.__nuxt-error-page a {
  color: #7f828b !important;
  text-decoration: none;
}

.__nuxt-error-page .logo {
  position: fixed;
  left: 12px;
  bottom: 12px;
}

.nuxt-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  width: 0;
  opacity: 1;
  transition:
    width 0.1s,
    opacity 0.4s;
  background-color: #000;
  z-index: 999999;
}

.nuxt-progress.nuxt-progress-notransition {
  transition: none;
}

.nuxt-progress-failed {
  background-color: red;
}

a {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

*,
:after,
:before {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  height: auto;
}

button,
input,
select,
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  border: 1px solid;
  color: inherit;
}

blockquote,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

iframe {
  border: none;
}

table {
  border-collapse: collapse;
}

.clearfix:after {
  content: '';
  display: table;
  clear: both;
}

.wysiwyg blockquote,
.wysiwyg h1,
.wysiwyg h2,
.wysiwyg h3,
.wysiwyg h4,
.wysiwyg h5,
.wysiwyg h6,
.wysiwyg ol,
.wysiwyg p,
.wysiwyg ul {
  margin-top: 1em;
  margin-bottom: 1em;
}

.wysiwyg > :first-child {
  margin-top: 0 !important;
}

.wysiwyg > :last-child {
  margin-bottom: 0 !important;
}

.wysiwyg b,
.wysiwyg strong {
  font-weight: 700;
}

.wysiwyg em,
.wysiwyg i {
  font-style: italic;
}

.wysiwyg ul {
  list-style-type: disc;
}

.wysiwyg ol,
.wysiwyg ul {
  list-style-position: outside;
  margin-left: 2.3em;
  padding-left: 0;
}

.wysiwyg ol {
  list-style-type: decimal;
}

.wysiwyg ol ul,
.wysiwyg ul ul {
  list-style-type: circle;
  list-style-position: outside;
  margin: 0 auto 0 2.3em;
}

.wysiwyg ol ol,
.wysiwyg ul ol {
  list-style-type: decimal;
  list-style-position: outside;
  margin: 0 auto 0 2.3em;
}

.wysiwyg blockquote {
  margin-left: 2.3em;
  margin-right: 2.3em;
  display: block;
}

.wysiwyg img {
  height: auto;
}

.wysiwyg a {
  text-decoration: underline;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

audio,
canvas,
iframe,
img,
svg,
video {
  vertical-align: middle;
}

textarea {
  resize: vertical;
}

body {
  line-height: 1;
  background: #272760;
  font-family: 'Nunito', sans-serif;
  font-weight: 400;
  font-size: calc(13.295774647887324px + 0.187793427230047vw);
  color: #0cffe1;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

@media (max-width: 375px) {
  body {
    font-size: 14px;
  }
}

@media (min-width: 1440px) {
  body {
    font-size: 16px;
  }
}

ol,
ul {
  padding-left: 1.2em;
}

button {
  display: inline-block;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  touch-action: manipulation;
  letter-spacing: inherit;
  border: none;
  padding: 0;
}

:focus {
  outline: 2px solid #0cffe1;
  outline-offset: 4px;
}

.wysiwyg {
  line-height: 1.3;
}

.wysiwyg img {
  max-width: 100%;
}

.wysiwyg a {
  white-space: nowrap;
}

.wysiwyg .style-h1 {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.wysiwyg .style-h2 {
  margin-top: 0.6em;
  margin-bottom: 0.6em;
}

.wysiwyg .style-h3 {
  margin-top: 0.7em;
  margin-bottom: 0.7em;
}

.wysiwyg .style-h4 {
  margin-top: 0.8em;
  margin-bottom: 0.8em;
}

.wysiwyg .style-h5 {
  margin-top: 0.9em;
  margin-bottom: 0.9em;
}

.wysiwyg .body,
.wysiwyg .body-small {
  margin-top: 1em;
  margin-bottom: 1em;
}

.style-h1,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 400;
}

.style-h1 {
  font-family: 'Nunito', sans-serif;
  font-size: calc(28.529577464788723px + 1.352112676056339vw);
  line-height: 1.1;
  font-weight: 200;
}

@media (max-width: 375px) {
  .style-h1 {
    font-size: 33.599999999999994px;
  }
}

@media (min-width: 1440px) {
  .style-h1 {
    font-size: 48px;
  }
}

.style-h2 {
  font-family: 'Nunito', sans-serif;
  font-weight: 400;
  font-size: calc(14.264788732394361px + 0.676056338028169vw);
  line-height: 1.2;
}

@media (max-width: 375px) {
  .style-h2 {
    font-size: 16.799999999999997px;
  }
}

@media (min-width: 1440px) {
  .style-h2 {
    font-size: 24px;
  }
}

.body {
  font-family: 'Nunito', sans-serif;
  font-weight: 400;
  font-size: calc(13.295774647887324px + 0.187793427230047vw);
  line-height: 1.3;
}

@media (max-width: 375px) {
  .body {
    font-size: 14px;
  }
}

@media (min-width: 1440px) {
  .body {
    font-size: 16px;
  }
}

.relative {
  position: relative;
}

.max-w,
.max-w-medium,
.max-w-small {
  margin-left: auto;
  margin-right: auto;
  padding-left: calc(9.361702127659575px + 2.127659574468085vw);
  padding-right: calc(9.361702127659575px + 2.127659574468085vw);
  width: 100%;
}

@media (max-width: 500px) {
  .max-w,
  .max-w-medium,
  .max-w-small {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (min-width: 1440px) {
  .max-w,
  .max-w-medium,
  .max-w-small {
    padding-left: 40px;
    padding-right: 40px;
  }
}

.max-w-small {
  max-width: 830px;
}

.max-w-medium {
  max-width: 1140px;
}

.max-w {
  max-width: 1360px;
}

.max-w-full {
  max-width: 2560px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

body {
  --gutter: calc(9.361702127659575px + 2.127659574468085vw);
}

@media (max-width: 500px) {
  body {
    --gutter: 20px;
  }
}

@media (min-width: 1440px) {
  body {
    --gutter: 40px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.full-slide-right-enter-active,
.full-slide-right-leave-active {
  transition:
    opacity 0.6s,
    transform 0.6s cubic-bezier(0.86, 0, 0.07, 1);
}

.full-slide-right-enter,
.full-slide-right-leave-to {
  opacity: 0;
}

.full-slide-right-enter {
  transform: translateX(-100%);
}

.full-slide-right-leave-to {
  transform: translateX(100%);
}

.full-slide-right-leave-active {
  position: absolute;
  width: 100%;
}

.full-slide-left-enter-active,
.full-slide-left-leave-active {
  transition:
    opacity 0.6s,
    transform 0.6s cubic-bezier(0.86, 0, 0.07, 1);
}

.full-slide-left-enter,
.full-slide-left-leave-to {
  opacity: 0;
}

.full-slide-left-enter {
  transform: translateX(100%);
}

.full-slide-left-leave-to {
  transform: translateX(-100%);
}

.full-slide-left-leave-active {
  position: absolute;
  width: 100%;
}

@-webkit-keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

.default-layout {
  padding-bottom: calc(41.32394366197183px + 3.380281690140845vw);
}

@media (max-width: 375px) {
  .default-layout {
    padding-bottom: 54px;
  }
}

@media (min-width: 1440px) {
  .default-layout {
    padding-bottom: 90px;
  }
}

.ssr-carousel-back-button,
.ssr-carousel-next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.ssr-carousel-back-button {
  left: 2%;
}

.ssr-carousel-next-button {
  right: 2%;
}

.ssr-carousel-back-icon,
.ssr-carousel-next-icon {
  border-radius: 50%;
  height: 42px;
  width: 42px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

[disabled] > .ssr-carousel-back-icon,
[disabled] > .ssr-carousel-next-icon {
  opacity: 0.1;
  cursor: default;
}

:not([disabled]) > .ssr-carousel-back-icon,
:not([disabled]) > .ssr-carousel-next-icon {
  opacity: 0.5;
}

@media (hover: hover) {
  :not([disabled]) > .ssr-carousel-back-icon:hover,
  :not([disabled]) > .ssr-carousel-next-icon:hover {
    opacity: 0.85;
  }
}

:not([disabled]) > .ssr-carousel-back-icon:active.active,
:not([disabled]) > .ssr-carousel-next-icon:active.active {
  opacity: 1;
}

.ssr-carousel-back-icon:before,
.ssr-carousel-next-icon:before {
  content: '';
  position: relative;
}

.ssr-carousel-back-icon:before {
  height: 0;
  width: 0;
  background: 0;
  border-color: transparent #fff transparent transparent;
  border-style: solid;
  border-width: 9px 12px 9px 0;
  left: -2px;
}

.ssr-carousel-next-icon:before {
  height: 0;
  width: 0;
  background: 0;
  border-color: transparent transparent transparent #fff;
  border-style: solid;
  border-width: 9px 0 9px 12px;
  left: 2px;
}

.ssr-carousel-dot-button {
  display: inline-block;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.ssr-carousel-dots {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.ssr-carousel-dot-icon {
  display: inline-block;
  border-radius: 50%;
  height: 12px;
  width: 12px;
  border: 2px solid rgba(0, 0, 0, 0.7);
  margin-left: 4px;
  margin-right: 4px;
  transition: opacity 0.2s;
}

@media (hover: hover) {
  .ssr-carousel-dot-icon:hover {
    opacity: 0.85;
  }

  .ssr-carousel-dot-icon:active.active {
    opacity: 1;
  }
}

[disabled] > .ssr-carousel-dot-icon {
  opacity: 1;
  background: rgba(0, 0, 0, 0.7);
  cursor: default;
}

:not([disabled]) > .ssr-carousel-dot-icon {
  opacity: 0.5;
}

.ssr-carousel-track {
  display: flex;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.ssr-carousel-track.dragging {
  pointer-events: none;
}

.ssr-carousel-slide {
  flex-shrink: 0;
}

.ssr-carousel-mask.disabled .ssr-carousel-slide[aria-hidden='true'] {
  display: none;
}

.ssr-carousel {
  touch-action: pan-y;
}

.ssr-carousel-slides {
  position: relative;
}

.ssr-peek-values {
  position: absolute;
}

.ssr-carousel-mask {
  position: relative;
}

.ssr-carousel-mask:not(.no-mask) {
  overflow: hidden;
}

.ssr-carousel-mask:not(.disabled):not(.not-draggable) {
  cursor: -webkit-grab;
  cursor: grab;
}

.ssr-carousel-mask:not(.disabled):not(.not-draggable).pressing {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}

.ssr-carousel-visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  -webkit-clip-path: inset(50%);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
}

// Prevent horizontal scrolling when using overflow-visible
#__layout {
  overflow: hidden;
}
</style>

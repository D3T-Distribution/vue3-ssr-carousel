<template>
  <article>
    <header>
      <h1>{{ page?.title }}</h1>
      <nav>
        <layout-logo />
        <layout-nav />
      </nav>
    </header>
    <ContentDoc />
  </article>
</template>

<script setup>
const { page } = useContent();
</script>

<style lang="css">
html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
}

main {
  display: block;
}

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

pre {
  font-family: monospace, monospace;
  font-size: 1em;
}

a {
  background-color: transparent;
}

abbr[title] {
  border-bottom: none;
  text-decoration: underline;
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}

b,
strong {
  font-weight: bolder;
}

code,
kbd,
samp {
  font-family: monospace, monospace;
  font-size: 1em;
}

small {
  font-size: 80%;
}

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

img {
  border-style: none;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}

button,
input {
  overflow: visible;
}

button,
select {
  text-transform: none;
}

[type='button'],
[type='reset'],
[type='submit'],
button {
  -webkit-appearance: button;
}

[type='button']::-moz-focus-inner,
[type='reset']::-moz-focus-inner,
[type='submit']::-moz-focus-inner,
button::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

[type='button']:-moz-focusring,
[type='reset']:-moz-focusring,
[type='submit']:-moz-focusring,
button:-moz-focusring {
  outline: 1px dotted ButtonText;
}

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

legend {
  box-sizing: border-box;
  color: inherit;
  display: table;
  max-width: 100%;
  padding: 0;
  white-space: normal;
}

progress {
  vertical-align: baseline;
}

textarea {
  overflow: auto;
}

[type='checkbox'],
[type='radio'] {
  box-sizing: border-box;
  padding: 0;
}

[type='number']::-webkit-inner-spin-button,
[type='number']::-webkit-outer-spin-button {
  height: auto;
}

[type='search'] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}

[type='search']::-webkit-search-decoration {
  -webkit-appearance: none;
}

::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}

details {
  display: block;
}

summary {
  display: list-item;
}

[hidden],
template {
  display: none;
}

code[class*='language-'],
pre[class*='language-'] {
  color: #c5c8c6;
  text-shadow: 0 1px rgba(0, 0, 0, 0.3);
  font-family: Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace;
  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  hyphens: none;
}

pre[class*='language-'] {
  padding: 1em;
  margin: 0.5em 0;
  overflow: auto;
  border-radius: 0.3em;
}

:not(pre) > code[class*='language-'],
pre[class*='language-'] {
  background: #1d1f21;
}

:not(pre) > code[class*='language-'] {
  padding: 0.1em;
  border-radius: 0.3em;
}

.token.cdata,
.token.comment,
.token.doctype,
.token.prolog {
  color: #7c7c7c;
}

.token.punctuation {
  color: #c5c8c6;
}

.namespace {
  opacity: 0.7;
}

.token.keyword,
.token.property,
.token.tag {
  color: #96cbfe;
}

.token.class-name {
  color: #ffffb6;
  text-decoration: underline;
}

.token.boolean,
.token.constant {
  color: #9c9;
}

.token.deleted,
.token.symbol {
  color: #f92672;
}

.token.number {
  color: #ff73fd;
}

.token.attr-name,
.token.builtin,
.token.char,
.token.inserted,
.token.selector,
.token.string {
  color: #a8ff60;
}

.token.variable {
  color: #c6c5fe;
}

.token.operator {
  color: #ededed;
}

.token.entity {
  color: #ffffb6;
  cursor: help;
}

.token.url {
  color: #96cbfe;
}

.language-css .token.string,
.style .token.string {
  color: #87c38a;
}

.token.atrule,
.token.attr-value {
  color: #f9ee98;
}

.token.function {
  color: #dad085;
}

.token.regex {
  color: #e9c062;
}

.token.important {
  color: #fd971f;
}

.token.bold,
.token.important {
  font-weight: 700;
}

.token.italic {
  font-style: italic;
}

[data-js-focus-visible] :focus:not([data-focus-visible-added]) {
  outline: none;
}

.vv-visual {
  position: relative;
  overflow: hidden;
  font-size: 0;
}

.vv-expand,
.vv-expand .vv-asset,
.vv-expand .vv-picture,
.vv-expand .vv-wrapper,
.vv-has-aspect .vv-asset,
.vv-has-aspect .vv-picture,
.vv-has-aspect .vv-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.vv-aspect-shim {
  display: inline-block;
  height: 100%;
}

.vv-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.vv-slot {
  font-size: 1rem;
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.vv-align-bottom {
  vertical-align: bottom;
}

.vv-align-middle {
  vertical-align: middle;
}

.vv-align-top {
  vertical-align: top;
}

.vv-align-left {
  text-align: left;
}

.vv-align-center {
  text-align: center;
}

.vv-align-right {
  text-align: right;
}

.vv-fade-enter-active,
.vv-fade-leave-active {
  transition: opacity 0.3s;
}

.vv-fade-leave-active {
  position: absolute;
  transition-delay: 0.3s;
}

.vv-fade-enter,
.vv-fade-leave-to {
  opacity: 0;
}
</style>

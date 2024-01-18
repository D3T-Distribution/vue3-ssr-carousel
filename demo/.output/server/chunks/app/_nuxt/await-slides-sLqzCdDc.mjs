import __nuxt_component_0 from './slide-JIve9Y_5.mjs';
import { resolveComponent, mergeProps, withCtx, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
import '../../nitro/node-server.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'unified';
import 'mdast-util-to-string';
import 'micromark';
import 'unist-util-stringify-position';
import 'micromark-util-character';
import 'micromark-util-chunked';
import 'micromark-util-resolve-all';
import 'micromark-util-sanitize-uri';
import 'slugify';
import 'remark-parse';
import 'remark-rehype';
import 'remark-mdc';
import 'hast-util-to-string';
import 'github-slugger';
import 'detab';
import 'remark-emoji';
import 'remark-gfm';
import 'rehype-external-links';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'ipx';
import '@unhead/shared';
import 'vue-router';

const _sfc_main = {
  components: {
    Slide: __nuxt_component_0
  },
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
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel = resolveComponent("ssr-carousel");
  const _component_slide = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ "data-cy": "await-slides" }, _attrs))} data-v-adc24eb6>`);
  _push(ssrRenderComponent(_component_ssr_carousel, {
    "show-dots": "",
    key: $data.slides.length
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($data.slides, (slide) => {
          _push2(ssrRenderComponent(_component_slide, {
            key: slide,
            index: slide
          }, null, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList($data.slides, (slide) => {
            return openBlock(), createBlock(_component_slide, {
              key: slide,
              index: slide
            }, null, 8, ["index"]);
          }), 128))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<button class="add-slide" data-v-adc24eb6>Add a slide</button></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/misc/await-slides.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const awaitSlides = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-adc24eb6"]]);

export { awaitSlides as default };
//# sourceMappingURL=await-slides-sLqzCdDc.mjs.map

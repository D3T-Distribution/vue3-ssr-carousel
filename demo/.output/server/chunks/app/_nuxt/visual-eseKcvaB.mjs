import { _ as __nuxt_component_0$1 } from './nuxt-img-wERH53kC.mjs';
import __nuxt_component_0 from './slide-JIve9Y_5.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
import './index-4HFg2MPZ.mjs';
import 'unhead';
import '@unhead/shared';
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
import 'vue-router';

const _sfc_main = {
  components: {
    Slide: __nuxt_component_0
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel = resolveComponent("ssr-carousel");
  const _component_NuxtImg = __nuxt_component_0$1;
  _push(ssrRenderComponent(_component_ssr_carousel, mergeProps({
    loop: "",
    "slides-per-page": 2,
    peek: 80,
    "paginate-by-slide": "",
    "show-arrows": ""
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtImg, {
          src: "https://via.placeholder.com/1920x1080/BA3298/FFFFFF?text=Slide+1",
          loading: "lazy",
          width: "1920",
          height: "1080"
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_NuxtImg, {
          src: "https://via.placeholder.com/1920x1080/5E339E/FFFFFF?text=Slide+2",
          loading: "lazy",
          width: "1920",
          height: "1080"
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_NuxtImg, {
          src: "https://via.placeholder.com/1920x1080/315AAD/FFFFFF?text=Slide+3",
          loading: "lazy",
          width: "1920",
          height: "1080"
        }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtImg, {
            src: "https://via.placeholder.com/1920x1080/BA3298/FFFFFF?text=Slide+1",
            loading: "lazy",
            width: "1920",
            height: "1080"
          }),
          createVNode(_component_NuxtImg, {
            src: "https://via.placeholder.com/1920x1080/5E339E/FFFFFF?text=Slide+2",
            loading: "lazy",
            width: "1920",
            height: "1080"
          }),
          createVNode(_component_NuxtImg, {
            src: "https://via.placeholder.com/1920x1080/315AAD/FFFFFF?text=Slide+3",
            loading: "lazy",
            width: "1920",
            height: "1080"
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/peeking/visual.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const visual = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { visual as default };
//# sourceMappingURL=visual-eseKcvaB.mjs.map

import __nuxt_component_0 from './slide-JIve9Y_5.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel = resolveComponent("ssr-carousel");
  const _component_slide = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "clear-page-gutters" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_ssr_carousel, {
    "slides-per-page": 3,
    "paginate-by-slide": "",
    loop: "",
    "peek-gutter": "",
    gutter: "var(--fluid-gutter)",
    responsive: [
      {
        minWidth: 1440,
        feather: "calc(var(--fluid-gutter) * 0.5)"
      },
      {
        maxWidth: 768,
        slidesPerPage: 2
      },
      {
        maxWidth: 500,
        slidesPerPage: 1
      }
    ]
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_slide, { index: 1 }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 2 }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 3 }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 4 }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 5 }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_slide, { index: 1 }),
          createVNode(_component_slide, { index: 2 }),
          createVNode(_component_slide, { index: 3 }),
          createVNode(_component_slide, { index: 4 }),
          createVNode(_component_slide, { index: 5 })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/peeking/gutters.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const gutters = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { gutters as default };
//# sourceMappingURL=gutters-J8UbI3hD.mjs.map
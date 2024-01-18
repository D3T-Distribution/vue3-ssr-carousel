import __nuxt_component_0 from './slide-JIve9Y_5.mjs';
import { resolveComponent, withCtx, createVNode, useSSRContext } from 'vue';
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
  },
  data() {
    return { invert: false };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel = resolveComponent("ssr-carousel");
  const _component_slide = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-fd392c9f>`);
  _push(ssrRenderComponent(_component_ssr_carousel, {
    "slides-per-page": 2,
    "paginate-by-slide": "",
    loop: "",
    peek: "40px"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_slide, {
          index: 1,
          class: { invert: $data.invert }
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<button data-v-fd392c9f${_scopeId2}>Invert the slide</button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: ($event) => $data.invert = !$data.invert
                }, "Invert the slide", 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 2 }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 3 }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_slide, {
            index: 1,
            class: { invert: $data.invert }
          }, {
            default: withCtx(() => [
              createVNode("button", {
                onClick: ($event) => $data.invert = !$data.invert
              }, "Invert the slide", 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["class"]),
          createVNode(_component_slide, { index: 2 }),
          createVNode(_component_slide, { index: 3 })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/misc/reactivity.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const reactivity = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-fd392c9f"]]);

export { reactivity as default };
//# sourceMappingURL=reactivity-RcQewVbn.mjs.map

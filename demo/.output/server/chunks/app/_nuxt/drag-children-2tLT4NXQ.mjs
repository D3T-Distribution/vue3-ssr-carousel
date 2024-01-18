import { p as publicAssetsURL } from '../../handlers/renderer.mjs';
import __nuxt_component_0 from './slide-JIve9Y_5.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from '../server.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _imports_0 = "" + publicAssetsURL("img/gradient.png");
const _sfc_main = {
  components: {
    Slide: __nuxt_component_0
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel = resolveComponent("ssr-carousel");
  const _component_slide = __nuxt_component_0;
  _push(ssrRenderComponent(_component_ssr_carousel, mergeProps({ "slides-per-page": 2 }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_slide, { index: 1 }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<img${ssrRenderAttr("src", _imports_0)}${_scopeId2}><p${_scopeId2}><a href="https://www.bukwild.com"${_scopeId2}>Example link</a></p>`);
            } else {
              return [
                createVNode("img", { src: _imports_0 }),
                createVNode("p", null, [
                  createVNode("a", { href: "https://www.bukwild.com" }, "Example link")
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 2 }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<img${ssrRenderAttr("src", _imports_0)}${_scopeId2}><p${_scopeId2}><a href="https://www.bukwild.com"${_scopeId2}>Example link</a></p>`);
            } else {
              return [
                createVNode("img", { src: _imports_0 }),
                createVNode("p", null, [
                  createVNode("a", { href: "https://www.bukwild.com" }, "Example link")
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 3 }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<img${ssrRenderAttr("src", _imports_0)}${_scopeId2}><p${_scopeId2}><a href="https://www.bukwild.com"${_scopeId2}>Example link</a></p>`);
            } else {
              return [
                createVNode("img", { src: _imports_0 }),
                createVNode("p", null, [
                  createVNode("a", { href: "https://www.bukwild.com" }, "Example link")
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_slide, { index: 1 }, {
            default: withCtx(() => [
              createVNode("img", { src: _imports_0 }),
              createVNode("p", null, [
                createVNode("a", { href: "https://www.bukwild.com" }, "Example link")
              ])
            ]),
            _: 1
          }),
          createVNode(_component_slide, { index: 2 }, {
            default: withCtx(() => [
              createVNode("img", { src: _imports_0 }),
              createVNode("p", null, [
                createVNode("a", { href: "https://www.bukwild.com" }, "Example link")
              ])
            ]),
            _: 1
          }),
          createVNode(_component_slide, { index: 3 }, {
            default: withCtx(() => [
              createVNode("img", { src: _imports_0 }),
              createVNode("p", null, [
                createVNode("a", { href: "https://www.bukwild.com" }, "Example link")
              ])
            ]),
            _: 1
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/misc/drag-children.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dragChildren = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { dragChildren as default };
//# sourceMappingURL=drag-children-2tLT4NXQ.mjs.map

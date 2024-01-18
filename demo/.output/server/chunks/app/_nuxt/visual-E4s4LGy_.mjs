import __nuxt_component_0 from './slide-JIve9Y_5.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-img-wERH53kC.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
import './index-4HFg2MPZ.mjs';
import 'unhead';

const _sfc_main = {
  components: {
    Slide: __nuxt_component_0
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel = resolveComponent("ssr-carousel");
  const _component_slide = __nuxt_component_0;
  const _component_NuxtImg = __nuxt_component_0$1;
  _push(ssrRenderComponent(_component_ssr_carousel, mergeProps({ loop: "" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_NuxtImg, {
                src: "https://via.placeholder.com/1920x1080?text=Slide+1",
                loading: "lazy",
                width: "1920",
                height: "1080"
              }, null, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_NuxtImg, {
                  src: "https://via.placeholder.com/1920x1080?text=Slide+1",
                  loading: "lazy",
                  width: "1920",
                  height: "1080"
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_NuxtImg, {
                src: "https://via.placeholder.com/1920x1080?text=Slide+2",
                loading: "lazy",
                width: "1920",
                height: "1080"
              }, null, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_NuxtImg, {
                  src: "https://via.placeholder.com/1920x1080?text=Slide+2",
                  loading: "lazy",
                  width: "1920",
                  height: "1080"
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_slide, null, {
            default: withCtx(() => [
              createVNode(_component_NuxtImg, {
                src: "https://via.placeholder.com/1920x1080?text=Slide+1",
                loading: "lazy",
                width: "1920",
                height: "1080"
              })
            ]),
            _: 1
          }),
          createVNode(_component_slide, null, {
            default: withCtx(() => [
              createVNode(_component_NuxtImg, {
                src: "https://via.placeholder.com/1920x1080?text=Slide+2",
                loading: "lazy",
                width: "1920",
                height: "1080"
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/looping/visual.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const visual = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { visual as default };
//# sourceMappingURL=visual-E4s4LGy_.mjs.map

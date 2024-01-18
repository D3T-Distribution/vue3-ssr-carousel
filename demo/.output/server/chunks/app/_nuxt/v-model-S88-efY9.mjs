import __nuxt_component_0 from './slide-JIve9Y_5.mjs';
import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  props: {
    loop: Boolean
  },
  data() {
    return {
      page: 1
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel = resolveComponent("ssr-carousel");
  const _component_slide = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ "data-cy": "v-model" }, _attrs))} data-v-03bf579a>`);
  _push(ssrRenderComponent(_component_ssr_carousel, {
    modelValue: $data.page,
    "onUpdate:modelValue": ($event) => $data.page = $event,
    loop: $props.loop
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_slide, { index: 1 }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 2 }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_slide, { index: 3 }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_slide, { index: 1 }),
          createVNode(_component_slide, { index: 2 }),
          createVNode(_component_slide, { index: 3 })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<span class="now" data-v-03bf579a>Current Page: ${ssrInterpolate($data.page + 1)}</span><button data-v-03bf579a>Back</button><button data-v-03bf579a>Next</button></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/events/v-model.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const vModel = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-03bf579a"]]);

export { vModel as default };
//# sourceMappingURL=v-model-S88-efY9.mjs.map

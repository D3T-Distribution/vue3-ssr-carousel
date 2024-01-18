import { _ as __nuxt_component_0 } from './nuxt-link-IzlaOwBm.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  data() {
    return {
      links: [
        {
          title: "Introduction",
          path: "/"
        },
        {
          title: "Events",
          path: "/events"
        },
        {
          title: "Responsive",
          path: "/responsive"
        },
        {
          title: "Gutters",
          path: "/gutters"
        },
        {
          title: "UI",
          path: "/ui"
        },
        {
          title: "Looping",
          path: "/looping"
        },
        {
          title: "Peeking",
          path: "/peeking"
        },
        {
          title: "Accessibility",
          path: "/accessibility"
        },
        {
          title: "Miscellaneous",
          path: "/misc"
        }
      ]
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<ul${ssrRenderAttrs(mergeProps({ class: "layout-nav" }, _attrs))} data-v-136d8cc8><!--[-->`);
  ssrRenderList($data.links, (link) => {
    _push(`<li data-v-136d8cc8>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: link.path
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${ssrInterpolate(link.title)}`);
        } else {
          return [
            createTextVNode(toDisplayString(link.title), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
    _push(`</li>`);
  });
  _push(`<!--]--></ul>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/nav.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-136d8cc8"]]);

export { __nuxt_component_1 as default };
//# sourceMappingURL=nav-KyxJuo4D.mjs.map

import __nuxt_component_0 from './logo-vfCbA7lG.mjs';
import __nuxt_component_1 from './nav-KyxJuo4D.mjs';
import _sfc_main$1 from './ContentDoc-he6pFFbb.mjs';
import { u as useContent } from './content-4rzAj24-.mjs';
import { unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import '../server.mjs';
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
import './nuxt-link-IzlaOwBm.mjs';
import './index-4HFg2MPZ.mjs';
import 'unhead';
import './ContentRenderer-NsAjjpSj.mjs';
import './ContentRendererMarkdown-MKaqZyXK.mjs';
import 'property-information';
import './preview-ea5iqoFC.mjs';
import './ContentQuery-vHK5Q4Tr.mjs';
import './query-T6aUc4nE.mjs';

const _sfc_main = {
  __name: "[...slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const { page } = useContent();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_layout_logo = __nuxt_component_0;
      const _component_layout_nav = __nuxt_component_1;
      const _component_ContentDoc = _sfc_main$1;
      _push(`<article${ssrRenderAttrs(_attrs)}><header><h1>${ssrInterpolate((_a = unref(page)) == null ? void 0 : _a.title)}</h1><nav>`);
      _push(ssrRenderComponent(_component_layout_logo, null, null, _parent));
      _push(ssrRenderComponent(_component_layout_nav, null, null, _parent));
      _push(`</nav></header>`);
      _push(ssrRenderComponent(_component_ContentDoc, null, null, _parent));
      _push(`</article>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_...slug_-Fl15Ph1V.mjs.map

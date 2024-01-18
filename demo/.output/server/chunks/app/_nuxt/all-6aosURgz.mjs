import __nuxt_component_0 from './slide-JIve9Y_5.mjs';
import { resolveComponent, mergeProps, withCtx, openBlock, createBlock, Fragment, renderList, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
      events: []
    };
  },
  // Push events onto the stack
  methods: {
    logEvent(name, payload) {
      return this.events.unshift({ name, payload });
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel = resolveComponent("ssr-carousel");
  const _component_slide = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "events-demo" }, _attrs))} data-v-d86f4662>`);
  _push(ssrRenderComponent(_component_ssr_carousel, {
    "show-arrows": "",
    "show-dots": "",
    onChange: ($event) => $options.logEvent("change", $event),
    onPress: ($event) => $options.logEvent("press", $event),
    onRelease: ($event) => $options.logEvent("release", $event),
    "onDrag:start": ($event) => $options.logEvent("drag:start", $event),
    "onDrag:input": ($event) => $options.logEvent("drag:input", $event),
    "onDrag:end": ($event) => $options.logEvent("drag:end", $event),
    "onTween:start": ($event) => $options.logEvent("tween:start", $event),
    "onTween:end": ($event) => $options.logEvent("tween:end", $event)
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList(3, (i) => {
          _push2(ssrRenderComponent(_component_slide, {
            index: i,
            key: i
          }, null, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
      } else {
        return [
          (openBlock(), createBlock(Fragment, null, renderList(3, (i) => {
            return createVNode(_component_slide, {
              index: i,
              key: i
            }, null, 8, ["index"]);
          }), 64))
        ];
      }
    }),
    _: 1
  }, _parent));
  if ($data.events.length) {
    _push(`<pre class="events" data-v-d86f4662>      <!--[-->`);
    ssrRenderList($data.events, (event) => {
      _push(`<code class="event" data-v-d86f4662>
        <span class="name" data-v-d86f4662>
          <strong data-v-d86f4662>Event:</strong> &quot;${ssrInterpolate(event.name)}&quot;
        </span>
        `);
      if (event.payload) {
        _push(`<span class="payload" data-v-d86f4662>
          <strong data-v-d86f4662>Payload:</strong> ${ssrInterpolate(JSON.stringify(event.payload))}
        </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`
      </code>`);
    });
    _push(`<!--]-->
    </pre>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/demos/events/all.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const all = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-d86f4662"]]);

export { all as default };
//# sourceMappingURL=all-6aosURgz.mjs.map

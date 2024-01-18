import { hasInjectionContext, getCurrentInstance, version, inject, defineAsyncComponent, toRef, isRef, ref, defineComponent, h, computed, unref, provide, shallowReactive, watch, Suspense, nextTick, Transition, useSSRContext, mergeProps, createApp, effectScope, reactive, Fragment, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, shallowRef, isReadonly, isShallow, isReactive, toRaw, withCtx, resolveComponent, createSlots, renderSlot } from 'vue';
import { d as useRuntimeConfig$1, $ as $fetch$1, w as withQuery, l as hasProtocol, p as parseURL, m as isScriptProtocol, j as joinURL, h as createError$1, n as klona, o as parse, q as getRequestHeader, r as defu, t as sanitizeStatusCode, v as destr, x as isEqual, y as setCookie, z as getCookie, A as deleteCookie, B as createHooks, C as withoutTrailingSlash, D as withLeadingSlash, E as hash, F as withBase } from '../nitro/node-server.mjs';
import { defineHeadPlugin } from '@unhead/shared';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderSlot, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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

function createContext$1(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers$1.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers$1.delete(onLeave);
      }
    }
  };
}
function createNamespace$1(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext$1({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey$2 = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey$2] || (_globalThis$1[globalKey$2] = createNamespace$1());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey$1 = "__unctx_async_handlers__";
const asyncHandlers$1 = _globalThis$1[asyncHandlersKey$1] || (_globalThis$1[asyncHandlersKey$1] = /* @__PURE__ */ new Set());

const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app", {
  asyncContext: false
});
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.9.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      once: /* @__PURE__ */ new Set(),
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn)),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a, _b;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    if (plugin2.dependsOn && !plugin2.dependsOn.every((name) => resolvedPlugins.includes(name))) {
      unresolvedPlugins.push([new Set(plugin2.dependsOn), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.push(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a = nuxtApp.ssrContext) == null ? void 0 : _a.islandContext) && ((_b = plugin2.env) == null ? void 0 : _b.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
// @__NO_SIDE_EFFECTS__
function useNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig() {
  return (/* @__PURE__ */ useNuxtApp()).$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
version.startsWith("3");
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root;
}
defineHeadPlugin({
  hooks: {
    "entries:resolve": function(ctx) {
      for (const entry2 of ctx.entries)
        entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
    }
  }
});
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
const unhead_3Bi0E2Ktsf = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => (/* @__PURE__ */ useNuxtApp()).vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = /* @__PURE__ */ useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, (/* @__PURE__ */ useNuxtApp())._route);
  }
  return (/* @__PURE__ */ useNuxtApp())._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const addRouteMiddleware = (name, middleware, options = {}) => {
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  const global2 = options.global || typeof name !== "string";
  const mw = typeof name !== "string" ? name : middleware;
  if (!mw) {
    console.warn("[nuxt] No route middleware passed to `addRouteMiddleware`.", name);
    return;
  }
  if (global2) {
    nuxtApp._middleware.global.push(mw);
  } else {
    nuxtApp._middleware.named[name] = mw;
  }
};
const isProcessingMiddleware = () => {
  try {
    if ((/* @__PURE__ */ useNuxtApp())._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  if (options == null ? void 0 : options.open) {
    return Promise.resolve();
  }
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const protocol = parseURL(toPath).protocol;
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = /* @__PURE__ */ useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef((/* @__PURE__ */ useNuxtApp()).payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const error2 = useError();
    if (false)
      ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const _routes = [
  {
    name: "slug",
    path: "/:slug(.*)*",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => import('./_nuxt/_...slug_-Fl15Ph1V.mjs').then((m) => m.default || m)
  }
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => {
      var _a, _b;
      return comp.components && comp.components.default === ((_b = (_a = from.matched[index]) == null ? void 0 : _a.components) == null ? void 0 : _b.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": true };
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a;
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const behavior = ((_a = useRouter().options) == null ? void 0 : _a.scrollBehaviorType) ?? "auto";
    let position = savedPosition || void 0;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b, _c;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
    let startPosition;
    const initialURL = nuxtApp.ssrContext.url;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        var _a2;
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
        return (_a2 = routerOptions.scrollBehavior) == null ? void 0 : _a2.call(routerOptions, to, START_LOCATION, startPosition || savedPosition);
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const _route = shallowRef(router.resolve(initialURL));
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c2, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    if ((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from, failure) => {
      delete nuxtApp._processingMiddleware;
      if (failure) {
        await nuxtApp.callHook("page:loading:end");
      }
      if ((failure == null ? void 0 : failure.type) === 4) {
        return;
      }
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      } else if (to.redirectedFrom && to.fullPath !== initialURL) {
        await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        await router.replace({
          ...router.resolve(initialURL),
          name: void 0,
          // #4920, #4982
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    (/* @__PURE__ */ useNuxtApp()).ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
const revive_payload_server_ICvz7TjQsJ = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const LazyDemosAccessibilityLoopDisabling = defineAsyncComponent(() => import('./_nuxt/loop-disabling-XSm-oOhl.mjs').then((r) => r.default));
const LazyDemosAccessibilityTabCapture = defineAsyncComponent(() => import('./_nuxt/tab-capture-GKb8iC_n.mjs').then((r) => r.default));
const LazyDemosEventsAll = defineAsyncComponent(() => import('./_nuxt/all-6aosURgz.mjs').then((r) => r.default));
const LazyDemosEventsVModel = defineAsyncComponent(() => import('./_nuxt/v-model-S88-efY9.mjs').then((r) => r.default));
const LazyDemosGuttersCssVars = defineAsyncComponent(() => import('./_nuxt/css-vars-78a5SJoF.mjs').then((r) => r.default));
const LazyDemosGuttersCss = defineAsyncComponent(() => import('./_nuxt/css-4gEbYX4v.mjs').then((r) => r.default));
const LazyDemosGuttersNumbers = defineAsyncComponent(() => import('./_nuxt/numbers-wrG0HjMm.mjs').then((r) => r.default));
const LazyDemosGuttersResponsive = defineAsyncComponent(() => import('./_nuxt/responsive-nPO66s9c.mjs').then((r) => r.default));
const LazyDemosIntro = defineAsyncComponent(() => import('./_nuxt/intro-7WtcUDrI.mjs').then((r) => r.default));
const LazyDemosLoopingBasic = defineAsyncComponent(() => import('./_nuxt/basic-0xX3blfC.mjs').then((r) => r.default));
const LazyDemosLoopingCenter = defineAsyncComponent(() => import('./_nuxt/center-HbEwGeRl.mjs').then((r) => r.default));
const LazyDemosLoopingMultiple = defineAsyncComponent(() => import('./_nuxt/multiple-E9KP-WrD.mjs').then((r) => r.default));
const LazyDemosLoopingVisual = defineAsyncComponent(() => import('./_nuxt/visual-E4s4LGy_.mjs').then((r) => r.default));
const LazyDemosMiscAutoplay = defineAsyncComponent(() => import('./_nuxt/autoplay-LBS6kbhf.mjs').then((r) => r.default));
const LazyDemosMiscAwaitSlides = defineAsyncComponent(() => import('./_nuxt/await-slides-sLqzCdDc.mjs').then((r) => r.default));
const LazyDemosMiscDisabling = defineAsyncComponent(() => import('./_nuxt/disabling-8klIkpwk.mjs').then((r) => r.default));
const LazyDemosMiscDragChildren = defineAsyncComponent(() => import('./_nuxt/drag-children-2tLT4NXQ.mjs').then((r) => r.default));
const LazyDemosMiscReactivity = defineAsyncComponent(() => import('./_nuxt/reactivity-RcQewVbn.mjs').then((r) => r.default));
const LazyDemosPeekingBasic = defineAsyncComponent(() => import('./_nuxt/basic-nfAW-7Dh.mjs').then((r) => r.default));
const LazyDemosPeekingCloning = defineAsyncComponent(() => import('./_nuxt/cloning-OnMUfTFd.mjs').then((r) => r.default));
const LazyDemosPeekingGutters = defineAsyncComponent(() => import('./_nuxt/gutters-J8UbI3hD.mjs').then((r) => r.default));
const LazyDemosPeekingLoop = defineAsyncComponent(() => import('./_nuxt/loop-rw_feHOW.mjs').then((r) => r.default));
const LazyDemosPeekingLooplessGutter = defineAsyncComponent(() => import('./_nuxt/loopless-gutter-J6vU3KwE.mjs').then((r) => r.default));
const LazyDemosPeekingOverflowVisible = defineAsyncComponent(() => import('./_nuxt/overflow-visible-vQVok_Nx.mjs').then((r) => r.default));
const LazyDemosPeekingResponsive = defineAsyncComponent(() => import('./_nuxt/responsive-DQZT1tQm.mjs').then((r) => r.default));
const LazyDemosPeekingVisual = defineAsyncComponent(() => import('./_nuxt/visual-eseKcvaB.mjs').then((r) => r.default));
const LazyDemosResponsiveMaxWidth = defineAsyncComponent(() => import('./_nuxt/max-width-wdcPXRpi.mjs').then((r) => r.default));
const LazyDemosResponsiveMinWidth = defineAsyncComponent(() => import('./_nuxt/min-width-hgb-GGj2.mjs').then((r) => r.default));
const LazyDemosResponsiveVariableWidthDisabled = defineAsyncComponent(() => import('./_nuxt/variable-width-disabled-mHCnD68C.mjs').then((r) => r.default));
const LazyDemosResponsiveVariableWidth = defineAsyncComponent(() => import('./_nuxt/variable-width-ieTsFOwG.mjs').then((r) => r.default));
const LazyDemosUiArrows = defineAsyncComponent(() => import('./_nuxt/arrows-97SiyQlK.mjs').then((r) => r.default));
const LazyDemosUiCustomArrows = defineAsyncComponent(() => import('./_nuxt/custom-arrows-vpnir9hV.mjs').then((r) => r.default));
const LazyDemosUiDots = defineAsyncComponent(() => import('./_nuxt/dots-TbwHU20h.mjs').then((r) => r.default));
const LazyDemosUiNoDrag = defineAsyncComponent(() => import('./_nuxt/no-drag-S4IG-HwA.mjs').then((r) => r.default));
const LazyDemosUiPaginateBySlide = defineAsyncComponent(() => import('./_nuxt/paginate-by-slide-kLDZYBq-.mjs').then((r) => r.default));
const LazyLayoutLogo = defineAsyncComponent(() => import('./_nuxt/logo-vfCbA7lG.mjs').then((r) => r.default));
const LazyLayoutNav = defineAsyncComponent(() => import('./_nuxt/nav-KyxJuo4D.mjs').then((r) => r.default));
const LazySlide = defineAsyncComponent(() => import('./_nuxt/slide-JIve9Y_5.mjs').then((r) => r.default));
const LazyContentDoc = defineAsyncComponent(() => import('./_nuxt/ContentDoc-he6pFFbb.mjs').then((r) => r.default));
const LazyContentList = defineAsyncComponent(() => import('./_nuxt/ContentList-Mr0iedMh.mjs').then((r) => r.default));
const LazyContentNavigation = defineAsyncComponent(() => import('./_nuxt/ContentNavigation-ls5P8w2X.mjs').then((r) => r.default));
const LazyContentQuery = defineAsyncComponent(() => import('./_nuxt/ContentQuery-vHK5Q4Tr.mjs').then((r) => r.default));
const LazyContentRenderer = defineAsyncComponent(() => import('./_nuxt/ContentRenderer-NsAjjpSj.mjs').then((r) => r.default));
const LazyContentRendererMarkdown = defineAsyncComponent(() => import('./_nuxt/ContentRendererMarkdown-MKaqZyXK.mjs').then((r) => r.default));
const LazyContentSlot = defineAsyncComponent(() => import('./_nuxt/ContentSlot-XOSB3_Nr.mjs').then((r) => r.default));
const LazyDocumentDrivenEmpty = defineAsyncComponent(() => import('./_nuxt/DocumentDrivenEmpty-JIZiFEOt.mjs').then((r) => r.default));
const LazyDocumentDrivenNotFound = defineAsyncComponent(() => import('./_nuxt/DocumentDrivenNotFound-i42THgbG.mjs').then((r) => r.default));
const LazyMarkdown = defineAsyncComponent(() => import('./_nuxt/Markdown-BL-jASlk.mjs').then((r) => r.default));
const LazyProseCode = defineAsyncComponent(() => import('./_nuxt/ProseCode-vD658DCT.mjs').then((r) => r.default));
const LazyProseCodeInline = defineAsyncComponent(() => import('./_nuxt/ProseCodeInline-r1AYmvAb.mjs').then((r) => r.default));
const LazyProsePre = defineAsyncComponent(() => import('./_nuxt/ProsePre-6y3g2E_d.mjs').then((r) => r.default));
const LazyProseA = defineAsyncComponent(() => import('./_nuxt/ProseA-rQ25UhrH.mjs').then((r) => r.default));
const LazyProseBlockquote = defineAsyncComponent(() => import('./_nuxt/ProseBlockquote-P01r-kLS.mjs').then((r) => r.default));
const LazyProseEm = defineAsyncComponent(() => import('./_nuxt/ProseEm-bBJ3b_R5.mjs').then((r) => r.default));
const LazyProseH1 = defineAsyncComponent(() => import('./_nuxt/ProseH1-6rGbQW30.mjs').then((r) => r.default));
const LazyProseH2 = defineAsyncComponent(() => import('./_nuxt/ProseH2-rXPFt0Ph.mjs').then((r) => r.default));
const LazyProseH3 = defineAsyncComponent(() => import('./_nuxt/ProseH3--HnU10av.mjs').then((r) => r.default));
const LazyProseH4 = defineAsyncComponent(() => import('./_nuxt/ProseH4-51rHFqqN.mjs').then((r) => r.default));
const LazyProseH5 = defineAsyncComponent(() => import('./_nuxt/ProseH5-LNQaT0Eu.mjs').then((r) => r.default));
const LazyProseH6 = defineAsyncComponent(() => import('./_nuxt/ProseH6-6Q3YD5ue.mjs').then((r) => r.default));
const LazyProseHr = defineAsyncComponent(() => import('./_nuxt/ProseHr-5WRdw_-I.mjs').then((r) => r.default));
const LazyProseImg = defineAsyncComponent(() => import('./_nuxt/ProseImg-b2e5SuNU.mjs').then((r) => r.default));
const LazyProseLi = defineAsyncComponent(() => import('./_nuxt/ProseLi-Twk_jIrq.mjs').then((r) => r.default));
const LazyProseOl = defineAsyncComponent(() => import('./_nuxt/ProseOl-cj_LPxSl.mjs').then((r) => r.default));
const LazyProseP = defineAsyncComponent(() => import('./_nuxt/ProseP-tBAU2C7G.mjs').then((r) => r.default));
const LazyProseScript = defineAsyncComponent(() => import('./_nuxt/ProseScript-YSIAbxhv.mjs').then((r) => r.default));
const LazyProseStrong = defineAsyncComponent(() => import('./_nuxt/ProseStrong-u7l-adt2.mjs').then((r) => r.default));
const LazyProseTable = defineAsyncComponent(() => import('./_nuxt/ProseTable-h35hN8wv.mjs').then((r) => r.default));
const LazyProseTbody = defineAsyncComponent(() => import('./_nuxt/ProseTbody-2p5dYPze.mjs').then((r) => r.default));
const LazyProseTd = defineAsyncComponent(() => import('./_nuxt/ProseTd-bv_fyNPw.mjs').then((r) => r.default));
const LazyProseTh = defineAsyncComponent(() => import('./_nuxt/ProseTh-YnteYC4I.mjs').then((r) => r.default));
const LazyProseThead = defineAsyncComponent(() => import('./_nuxt/ProseThead-gZGNOmCC.mjs').then((r) => r.default));
const LazyProseTr = defineAsyncComponent(() => import('./_nuxt/ProseTr-W84towKA.mjs').then((r) => r.default));
const LazyProseUl = defineAsyncComponent(() => import('./_nuxt/ProseUl-T8VtmlIg.mjs').then((r) => r.default));
const lazyGlobalComponents = [
  ["DemosAccessibilityLoopDisabling", LazyDemosAccessibilityLoopDisabling],
  ["DemosAccessibilityTabCapture", LazyDemosAccessibilityTabCapture],
  ["DemosEventsAll", LazyDemosEventsAll],
  ["DemosEventsVModel", LazyDemosEventsVModel],
  ["DemosGuttersCssVars", LazyDemosGuttersCssVars],
  ["DemosGuttersCss", LazyDemosGuttersCss],
  ["DemosGuttersNumbers", LazyDemosGuttersNumbers],
  ["DemosGuttersResponsive", LazyDemosGuttersResponsive],
  ["DemosIntro", LazyDemosIntro],
  ["DemosLoopingBasic", LazyDemosLoopingBasic],
  ["DemosLoopingCenter", LazyDemosLoopingCenter],
  ["DemosLoopingMultiple", LazyDemosLoopingMultiple],
  ["DemosLoopingVisual", LazyDemosLoopingVisual],
  ["DemosMiscAutoplay", LazyDemosMiscAutoplay],
  ["DemosMiscAwaitSlides", LazyDemosMiscAwaitSlides],
  ["DemosMiscDisabling", LazyDemosMiscDisabling],
  ["DemosMiscDragChildren", LazyDemosMiscDragChildren],
  ["DemosMiscReactivity", LazyDemosMiscReactivity],
  ["DemosPeekingBasic", LazyDemosPeekingBasic],
  ["DemosPeekingCloning", LazyDemosPeekingCloning],
  ["DemosPeekingGutters", LazyDemosPeekingGutters],
  ["DemosPeekingLoop", LazyDemosPeekingLoop],
  ["DemosPeekingLooplessGutter", LazyDemosPeekingLooplessGutter],
  ["DemosPeekingOverflowVisible", LazyDemosPeekingOverflowVisible],
  ["DemosPeekingResponsive", LazyDemosPeekingResponsive],
  ["DemosPeekingVisual", LazyDemosPeekingVisual],
  ["DemosResponsiveMaxWidth", LazyDemosResponsiveMaxWidth],
  ["DemosResponsiveMinWidth", LazyDemosResponsiveMinWidth],
  ["DemosResponsiveVariableWidthDisabled", LazyDemosResponsiveVariableWidthDisabled],
  ["DemosResponsiveVariableWidth", LazyDemosResponsiveVariableWidth],
  ["DemosUiArrows", LazyDemosUiArrows],
  ["DemosUiCustomArrows", LazyDemosUiCustomArrows],
  ["DemosUiDots", LazyDemosUiDots],
  ["DemosUiNoDrag", LazyDemosUiNoDrag],
  ["DemosUiPaginateBySlide", LazyDemosUiPaginateBySlide],
  ["LayoutLogo", LazyLayoutLogo],
  ["LayoutNav", LazyLayoutNav],
  ["Slide", LazySlide],
  ["ContentDoc", LazyContentDoc],
  ["ContentList", LazyContentList],
  ["ContentNavigation", LazyContentNavigation],
  ["ContentQuery", LazyContentQuery],
  ["ContentRenderer", LazyContentRenderer],
  ["ContentRendererMarkdown", LazyContentRendererMarkdown],
  ["MDCSlot", LazyContentSlot],
  ["DocumentDrivenEmpty", LazyDocumentDrivenEmpty],
  ["DocumentDrivenNotFound", LazyDocumentDrivenNotFound],
  ["Markdown", LazyMarkdown],
  ["ProseCode", LazyProseCode],
  ["ProseCodeInline", LazyProseCodeInline],
  ["ProsePre", LazyProsePre],
  ["ProseA", LazyProseA],
  ["ProseBlockquote", LazyProseBlockquote],
  ["ProseEm", LazyProseEm],
  ["ProseH1", LazyProseH1],
  ["ProseH2", LazyProseH2],
  ["ProseH3", LazyProseH3],
  ["ProseH4", LazyProseH4],
  ["ProseH5", LazyProseH5],
  ["ProseH6", LazyProseH6],
  ["ProseHr", LazyProseHr],
  ["ProseImg", LazyProseImg],
  ["ProseLi", LazyProseLi],
  ["ProseOl", LazyProseOl],
  ["ProseP", LazyProseP],
  ["ProseScript", LazyProseScript],
  ["ProseStrong", LazyProseStrong],
  ["ProseTable", LazyProseTable],
  ["ProseTbody", LazyProseTbody],
  ["ProseTd", LazyProseTd],
  ["ProseTh", LazyProseTh],
  ["ProseThead", LazyProseThead],
  ["ProseTr", LazyProseTr],
  ["ProseUl", LazyProseUl]
];
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxt = /* @__PURE__ */ useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useContentState = () => {
  const pages = useState("dd-pages", () => shallowRef(shallowReactive({})));
  const surrounds = useState("dd-surrounds", () => shallowRef(shallowReactive({})));
  const navigation = useState("dd-navigation");
  const globals = useState("dd-globals", () => shallowRef(shallowReactive({})));
  return {
    pages,
    surrounds,
    navigation,
    globals
  };
};
const navBottomLink = (link) => {
  if (!link.children) {
    return link._path;
  }
  for (const child of (link == null ? void 0 : link.children) || []) {
    const result = navBottomLink(child);
    if (result) {
      return result;
    }
  }
};
const navDirFromPath = (path, tree) => {
  for (const file of tree) {
    if (file._path === path && !file._id) {
      return file.children;
    }
    if (file.children) {
      const result = navDirFromPath(path, file.children);
      if (result) {
        return result;
      }
    }
  }
};
const navPageFromPath = (path, tree) => {
  for (const file of tree) {
    if (file._path === path) {
      return file;
    }
    if (file.children) {
      const result = navPageFromPath(path, file.children);
      if (result) {
        return result;
      }
    }
  }
};
const navKeyFromPath = (path, key, tree) => {
  let value;
  const goDeep = (path2, tree2) => {
    for (const file of tree2) {
      if (path2 !== "/" && file._path === "/") {
        continue;
      }
      if ((path2 == null ? void 0 : path2.startsWith(file._path)) && file[key]) {
        value = file[key];
      }
      if (file._path === path2) {
        return;
      }
      if (file.children) {
        goDeep(path2, file.children);
      }
    }
  };
  goDeep(path, tree);
  return value;
};
const useContentHelpers = () => {
  return {
    navBottomLink,
    navDirFromPath,
    navPageFromPath,
    navKeyFromPath
  };
};
function jsonStringify(value) {
  return JSON.stringify(value, regExpReplacer);
}
function regExpReplacer(_key, value) {
  if (value instanceof RegExp) {
    return `--REGEX ${value.toString()}`;
  }
  return value;
}
const encodeQueryParams = (params) => {
  let encoded = jsonStringify(params);
  encoded = typeof Buffer !== "undefined" ? Buffer.from(encoded).toString("base64") : btoa(encoded);
  encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  const chunks = encoded.match(/.{1,100}/g) || [];
  return chunks.join("/");
};
function useRequestEvent(nuxtApp = /* @__PURE__ */ useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a;
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? ((_a = opts.default) == null ? void 0 : _a.call(opts)));
  const cookie = ref(cookieValue);
  {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const useContentPreview = () => {
  const getPreviewToken = () => {
    return useCookie("previewToken").value || false || void 0;
  };
  const setPreviewToken = (token) => {
    useCookie("previewToken").value = token;
    useRoute().query.preview = token || "";
  };
  const isEnabled = () => {
    const query = useRoute().query;
    if (Object.prototype.hasOwnProperty.call(query, "preview") && !query.preview) {
      return false;
    }
    if (query.preview || useCookie("previewToken").value) {
      return true;
    }
    return false;
  };
  return {
    isEnabled,
    getPreviewToken,
    setPreviewToken
  };
};
const withContentBase = (url) => withBase(url, (/* @__PURE__ */ useRuntimeConfig()).public.content.api.baseURL);
const addPrerenderPath = (path) => {
  const event = useRequestEvent();
  event.node.res.setHeader(
    "x-nitro-prerender",
    [
      event.node.res.getHeader("x-nitro-prerender"),
      path
    ].filter(Boolean).join(",")
  );
};
const shouldUseClientDB = () => {
  (/* @__PURE__ */ useRuntimeConfig()).public.content;
  {
    return false;
  }
};
const get = (obj, path) => path.split(".").reduce((acc, part) => acc && acc[part], obj);
const _pick = (obj, condition) => Object.keys(obj).filter(condition).reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
const omit = (keys) => (obj) => keys && keys.length ? _pick(obj, (key) => !keys.includes(key)) : obj;
const apply = (fn) => (data) => Array.isArray(data) ? data.map((item) => fn(item)) : fn(data);
const detectProperties = (keys) => {
  const prefixes = [];
  const properties = [];
  for (const key of keys) {
    if (["$", "_"].includes(key)) {
      prefixes.push(key);
    } else {
      properties.push(key);
    }
  }
  return { prefixes, properties };
};
const withoutKeys = (keys = []) => (obj) => {
  if (keys.length === 0 || !obj) {
    return obj;
  }
  const { prefixes, properties } = detectProperties(keys);
  return _pick(obj, (key) => !properties.includes(key) && !prefixes.includes(key[0]));
};
const withKeys = (keys = []) => (obj) => {
  if (keys.length === 0 || !obj) {
    return obj;
  }
  const { prefixes, properties } = detectProperties(keys);
  return _pick(obj, (key) => properties.includes(key) || prefixes.includes(key[0]));
};
const sortList = (data, params) => {
  const comperable = new Intl.Collator(params.$locale, {
    numeric: params.$numeric,
    caseFirst: params.$caseFirst,
    sensitivity: params.$sensitivity
  });
  const keys = Object.keys(params).filter((key) => !key.startsWith("$"));
  for (const key of keys) {
    data = data.sort((a, b) => {
      const values = [get(a, key), get(b, key)].map((value) => {
        if (value === null) {
          return void 0;
        }
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      if (params[key] === -1) {
        values.reverse();
      }
      return comperable.compare(values[0], values[1]);
    });
  }
  return data;
};
const assertArray = (value, message = "Expected an array") => {
  if (!Array.isArray(value)) {
    throw new TypeError(message);
  }
};
const ensureArray = (value) => {
  return Array.isArray(value) ? value : [void 0, null].includes(value) ? [] : [value];
};
const arrayParams = ["sort", "where", "only", "without"];
function createQuery(fetcher, opts = {}) {
  const queryParams = {};
  for (const key of Object.keys(opts.initialParams || {})) {
    queryParams[key] = arrayParams.includes(key) ? ensureArray(opts.initialParams[key]) : opts.initialParams[key];
  }
  const $set = (key, fn = (v) => v) => {
    return (...values) => {
      queryParams[key] = fn(...values);
      return query;
    };
  };
  const resolveResult = (result) => {
    var _a;
    if (opts.legacy) {
      if (result == null ? void 0 : result.surround) {
        return result.surround;
      }
      if (!result) {
        return result;
      }
      if (result == null ? void 0 : result.dirConfig) {
        result.result = {
          _path: (_a = result.dirConfig) == null ? void 0 : _a._path,
          ...result.result,
          _dir: result.dirConfig
        };
      }
      return (result == null ? void 0 : result._path) || Array.isArray(result) || !Object.prototype.hasOwnProperty.call(result, "result") ? result : result == null ? void 0 : result.result;
    }
    return result;
  };
  const query = {
    params: () => ({
      ...queryParams,
      ...queryParams.where ? { where: [...ensureArray(queryParams.where)] } : {},
      ...queryParams.sort ? { sort: [...ensureArray(queryParams.sort)] } : {}
    }),
    only: $set("only", ensureArray),
    without: $set("without", ensureArray),
    where: $set("where", (q) => [...ensureArray(queryParams.where), ...ensureArray(q)]),
    sort: $set("sort", (sort) => [...ensureArray(queryParams.sort), ...ensureArray(sort)]),
    limit: $set("limit", (v) => parseInt(String(v), 10)),
    skip: $set("skip", (v) => parseInt(String(v), 10)),
    // find
    find: () => fetcher(query).then(resolveResult),
    findOne: () => fetcher($set("first")(true)).then(resolveResult),
    count: () => fetcher($set("count")(true)).then(resolveResult),
    // locale
    locale: (_locale) => query.where({ _locale }),
    withSurround: $set("surround", (surroundQuery, options) => ({ query: surroundQuery, ...options })),
    withDirConfig: () => $set("dirConfig")(true)
  };
  if (opts.legacy) {
    query.findSurround = (surroundQuery, options) => {
      return query.withSurround(surroundQuery, options).find().then(resolveResult);
    };
    return query;
  }
  return query;
}
const createQueryFetch = () => async (query) => {
  const { content } = (/* @__PURE__ */ useRuntimeConfig()).public;
  const params = query.params();
  const apiPath = content.experimental.stripQueryParameters ? withContentBase(`/query/${`${hash(params)}.${content.integrity}`}/${encodeQueryParams(params)}.json`) : withContentBase(`/query/${hash(params)}.${content.integrity}.json`);
  {
    addPrerenderPath(apiPath);
  }
  if (shouldUseClientDB()) {
    const db = await import('./_nuxt/client-db-50qP0Xg0.mjs').then((m) => m.useContentDatabase());
    return db.fetch(query);
  }
  const data = await $fetch(apiPath, {
    method: "GET",
    responseType: "json",
    params: content.experimental.stripQueryParameters ? void 0 : {
      _params: jsonStringify(params),
      previewToken: useContentPreview().getPreviewToken()
    }
  });
  if (typeof data === "string" && data.startsWith("<!DOCTYPE html>")) {
    throw new Error("Not found");
  }
  return data;
};
function queryContent(query, ...pathParts) {
  const { content } = (/* @__PURE__ */ useRuntimeConfig()).public;
  const queryBuilder = createQuery(createQueryFetch(), {
    initialParams: typeof query !== "string" ? query : {},
    legacy: true
  });
  let path;
  if (typeof query === "string") {
    path = withLeadingSlash(joinURL(query, ...pathParts));
  }
  const originalParamsFn = queryBuilder.params;
  queryBuilder.params = () => {
    var _a, _b, _c;
    const params = originalParamsFn();
    if (path) {
      params.where = params.where || [];
      if (params.first && (params.where || []).length === 0) {
        params.where.push({ _path: withoutTrailingSlash(path) });
      } else {
        params.where.push({ _path: new RegExp(`^${path.replace(/[-[\]{}()*+.,^$\s/]/g, "\\$&")}`) });
      }
    }
    if (!((_a = params.sort) == null ? void 0 : _a.length)) {
      params.sort = [{ _file: 1, $numeric: true }];
    }
    if (content.locales.length) {
      const queryLocale = (_c = (_b = params.where) == null ? void 0 : _b.find((w) => w._locale)) == null ? void 0 : _c._locale;
      if (!queryLocale) {
        params.where = params.where || [];
        params.where.push({ _locale: content.defaultLocale });
      }
    }
    return params;
  };
  return queryBuilder;
}
const fetchContentNavigation = async (queryBuilder) => {
  const { content } = (/* @__PURE__ */ useRuntimeConfig()).public;
  if (typeof (queryBuilder == null ? void 0 : queryBuilder.params) !== "function") {
    queryBuilder = queryContent(queryBuilder);
  }
  const params = queryBuilder.params();
  const apiPath = content.experimental.stripQueryParameters ? withContentBase(`/navigation/${`${hash(params)}.${content.integrity}`}/${encodeQueryParams(params)}.json`) : withContentBase(`/navigation/${hash(params)}.${content.integrity}.json`);
  {
    addPrerenderPath(apiPath);
  }
  if (shouldUseClientDB()) {
    const generateNavigation = await import('./_nuxt/client-db-50qP0Xg0.mjs').then((m) => m.generateNavigation);
    return generateNavigation(params);
  }
  const data = await $fetch(apiPath, {
    method: "GET",
    responseType: "json",
    params: content.experimental.stripQueryParameters ? void 0 : {
      _params: jsonStringify(params),
      previewToken: useContentPreview().getPreviewToken()
    }
  });
  if (typeof data === "string" && data.startsWith("<!DOCTYPE html>")) {
    throw new Error("Not found");
  }
  return data;
};
const layouts = {
  default: () => import('./_nuxt/default-pky-59ke.mjs').then((m) => m.default || m)
};
const documentDriven_tTNjjYemDi = /* @__PURE__ */ defineNuxtPlugin((nuxt) => {
  var _a, _b, _c, _d;
  const moduleOptions = (_b = (_a = /* @__PURE__ */ useRuntimeConfig()) == null ? void 0 : _a.public) == null ? void 0 : _b.content.documentDriven;
  (_d = (_c = /* @__PURE__ */ useRuntimeConfig()) == null ? void 0 : _c.public) == null ? void 0 : _d.content.experimental.clientDB;
  const { navigation, pages, globals, surrounds } = useContentState();
  const findLayout = (to, page, navigation2, globals2) => {
    var _a2;
    if (page && (page == null ? void 0 : page.layout)) {
      return page.layout;
    }
    if (to.matched.length && ((_a2 = to.matched[0].meta) == null ? void 0 : _a2.layout)) {
      return to.matched[0].meta.layout;
    }
    if (navigation2 && page) {
      const { navKeyFromPath: navKeyFromPath2 } = useContentHelpers();
      const layoutFromNav = navKeyFromPath2(page._path, "layout", navigation2);
      if (layoutFromNav) {
        return layoutFromNav;
      }
    }
    if (moduleOptions.layoutFallbacks && globals2) {
      let layoutFallback;
      for (const fallback of moduleOptions.layoutFallbacks) {
        if (globals2[fallback] && globals2[fallback].layout) {
          layoutFallback = globals2[fallback].layout;
          break;
        }
      }
      if (layoutFallback) {
        return layoutFallback;
      }
    }
    return "default";
  };
  const refresh = async (to, dedup = false) => {
    nuxt.callHook("content:document-driven:start", { route: to, dedup });
    const routeConfig = to.meta.documentDriven || {};
    if (to.meta.documentDriven === false) {
      return;
    }
    const _path = withoutTrailingSlash(to.path);
    const promises = [];
    if (moduleOptions.navigation && routeConfig.navigation !== false) {
      const navigationQuery = () => {
        const { navigation: navigation2 } = useContentState();
        if (navigation2.value && !dedup) {
          return navigation2.value;
        }
        return fetchContentNavigation().then((_navigation) => {
          navigation2.value = _navigation;
          return _navigation;
        }).catch(() => null);
      };
      promises.push(navigationQuery);
    } else {
      promises.push(() => Promise.resolve(null));
    }
    if (moduleOptions.globals) {
      const globalsQuery = () => {
        const { globals: globals2 } = useContentState();
        if (typeof moduleOptions.globals === "object" && Array.isArray(moduleOptions.globals)) {
          console.log("Globals must be a list of keys with QueryBuilderParams as a value.");
          return;
        }
        return Promise.all(
          Object.entries(moduleOptions.globals).map(
            ([key, query]) => {
              if (!dedup && globals2.value[key]) {
                return globals2.value[key];
              }
              let type = "findOne";
              if (query == null ? void 0 : query.type) {
                type = query.type;
              }
              return queryContent(query)[type]().catch(() => null);
            }
          )
        ).then(
          (values) => {
            return values.reduce(
              (acc, value, index) => {
                const key = Object.keys(moduleOptions.globals)[index];
                acc[key] = value;
                return acc;
              },
              {}
            );
          }
        );
      };
      promises.push(globalsQuery);
    } else {
      promises.push(() => Promise.resolve(null));
    }
    if (moduleOptions.page && routeConfig.page !== false) {
      let where = { _path };
      if (typeof routeConfig.page === "string") {
        where = { _path: routeConfig.page };
      }
      if (typeof routeConfig.page === "object") {
        where = routeConfig.page;
      }
      const pageQuery = () => {
        const { pages: pages2 } = useContentState();
        if (!dedup && pages2.value[_path] && pages2.value[_path]._path === _path) {
          return pages2.value[_path];
        }
        return queryContent().where(where).findOne().catch(() => null);
      };
      promises.push(pageQuery);
    } else {
      promises.push(() => Promise.resolve(null));
    }
    if (moduleOptions.surround && routeConfig.surround !== false) {
      let surround = _path;
      if (["string", "object"].includes(typeof routeConfig.page)) {
        surround = routeConfig.page;
      }
      if (["string", "object"].includes(typeof routeConfig.surround)) {
        surround = routeConfig.surround;
      }
      const surroundQuery = () => {
        const { surrounds: surrounds2 } = useContentState();
        if (!dedup && surrounds2.value[_path]) {
          return surrounds2.value[_path];
        }
        return queryContent().where({
          _partial: { $not: true },
          navigation: { $not: false }
        }).without(["body"]).findSurround(surround).catch(() => null);
      };
      promises.push(surroundQuery);
    } else {
      promises.push(() => Promise.resolve(null));
    }
    return await Promise.all(promises.map((promise) => promise())).then(async ([
      _navigation,
      _globals,
      _page,
      _surround
    ]) => {
      var _a2, _b2;
      if (_navigation) {
        navigation.value = _navigation;
      }
      if (_globals) {
        globals.value = _globals;
      }
      if (_surround) {
        surrounds.value[_path] = _surround;
      }
      const redirectTo = (_page == null ? void 0 : _page.redirect) || ((_b2 = (_a2 = _page == null ? void 0 : _page._dir) == null ? void 0 : _a2.navigation) == null ? void 0 : _b2.redirect);
      if (redirectTo) {
        pages.value[_path] = _page;
        return redirectTo;
      }
      if (_page) {
        const layoutName = findLayout(to, _page, _navigation, _globals);
        const layout = layouts[layoutName];
        if (layout && typeof layout === "function") {
          await layout();
        }
        to.meta.layout = layoutName;
        _page.layout = layoutName;
      }
      pages.value[_path] = _page;
      await nuxt.callHook("content:document-driven:finish", { route: to, dedup, page: _page, navigation: _navigation, globals: _globals, surround: _surround });
    });
  };
  addRouteMiddleware(async (to, from) => {
    const redirect = await refresh(to, false);
    if (redirect) {
      if (hasProtocol(redirect)) {
        return callWithNuxt(nuxt, navigateTo, [redirect, { external: true }]);
      } else {
        return redirect;
      }
    }
  });
  nuxt.hook("app:data:refresh", async () => false);
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$6 = {
  props: {
    index: {
      type: Number
    },
    pages: {
      type: Number
    },
    shouldLoop: {
      type: Boolean
    }
  },
  computed: {
    // Determine if button should be disabled because we're at the limits
    backDisabled() {
      return this.index === 0 && !this.shouldLoop;
    },
    nextDisabled() {
      return this.index === this.pages - 1 && !this.shouldLoop;
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "ssr-carousel-arrows" }, _attrs))}><button class="ssr-carousel-back-button" aria-label="Back"${ssrIncludeBooleanAttr($options.backDisabled) ? " disabled" : ""}>`);
  ssrRenderSlot(_ctx.$slots, "back", { disabled: $options.backDisabled }, () => {
    _push(`<span class="ssr-carousel-back-icon"></span>`);
  }, _push, _parent);
  _push(`</button><button class="ssr-carousel-next-button" aria-label="Next"${ssrIncludeBooleanAttr($options.nextDisabled) ? " disabled" : ""}>`);
  ssrRenderSlot(_ctx.$slots, "next", { disabled: $options.nextDisabled }, () => {
    _push(`<span class="ssr-carousel-next-icon"></span>`);
  }, _push, _parent);
  _push(`</button></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/ssr-carousel-arrows.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const SsrCarouselArrows = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$5 = {
  props: {
    boundedIndex: {
      type: Number
    },
    pages: {
      type: Number
    }
  },
  methods: {
    // Check if dot index should be disabled
    isDisabled(index) {
      return this.boundedIndex === index - 1;
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "ssr-carousel-dots" }, _attrs))}><!--[-->`);
  ssrRenderList($props.pages, (i) => {
    _push(`<button class="ssr-carousel-dot-button"${ssrRenderAttr("aria-label", `Page ${i}`)}${ssrIncludeBooleanAttr($options.isDisabled(i)) ? " disabled" : ""}>`);
    ssrRenderSlot(_ctx.$slots, "dot", {
      index: i,
      disabled: $options.isDisabled(i)
    }, () => {
      _push(`<span class="ssr-carousel-dot-icon"></span>`);
    }, _push, _parent);
    _push(`</button>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/ssr-carousel-dots.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const SsrCarouselDots = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$2]]);
const interactiveSelector = "a, button, input, textarea, select";
const getSlotChildrenText$1 = (node) => {
  if (!node.children || typeof node.children === "string")
    return node.children || "";
  else if (Array.isArray(node.children))
    return getSlotChildrenText$1(node.children);
  else if (node.children.default)
    return getSlotChildrenText$1(node.children.default);
};
const _sfc_main$4 = {
  props: {
    dragging: {
      type: Boolean
    },
    trackTranslateX: {
      type: Number
    },
    slideOrder: {
      type: Array
    },
    activeSlides: {
      type: Array
    },
    leftPeekingSlideIndex: {
      type: Number
    },
    rightPeekingSlideIndex: {
      type: Number
    }
  },
  // Set tabindex of inactive slides on mount
  mounted() {
    this.denyTabIndex(this.inactiveSlides);
    this.denyTabIndex(this.clonedSlides);
  },
  computed: {
    // Get the count of non-cloned slides
    uniqueSlidesCount() {
      return this.slideOrder.length;
    },
    // Get the total slides count, including clones
    allSlidesCount() {
      return this.getSlideComponents().length;
    },
    // Make an array of inactive slide indices
    // Make an array of inactive slide indices
    inactiveSlides() {
      return Array.from(
        { length: this.uniqueSlidesCount },
        (_, index) => index
      ).filter((index) => !this.activeSlides.includes(index));
    },
    // An array of the cloned slides indices
    clonedSlides() {
      return Array.from(
        { length: this.allSlidesCount - this.uniqueSlidesCount },
        (_, index) => index + this.uniqueSlidesCount
      );
    },
    // Styles that are used to position the track
    styles() {
      if (this.trackTranslateX) {
        return {
          transform: `translateX(${this.trackTranslateX}px)`
        };
      }
    }
  },
  // Update the tabindex of interactive elements when slides change
  watch: {
    activeSlides() {
      this.allowTabIndex(this.activeSlides);
      this.denyTabIndex(this.inactiveSlides);
    }
  },
  methods: {
    makeSlides() {
      return this.getSlideComponents().map((vnode, index) => {
        const slideCount = this.uniqueSlidesCount;
        const isPeekingClone = index >= slideCount;
        const peekingIndex = index - slideCount;
        let {
          class: staticClass = "",
          style = {},
          attrs = {}
        } = vnode.props || {};
        let key = vnode.key;
        const cssClass = "ssr-carousel-slide";
        staticClass += staticClass ? ` ${cssClass}` : cssClass;
        if (!isPeekingClone) {
          style.order = this.slideOrder[index] || 0;
        } else {
          style.order = peekingIndex === this.leftPeekingSlideIndex ? "-1" : peekingIndex === this.rightPeekingSlideIndex ? this.slideOrder.length : void 0;
        }
        if (isPeekingClone && ![this.leftPeekingSlideIndex, this.rightPeekingSlideIndex].includes(
          peekingIndex
        )) {
          style.display = "none";
        }
        if (isPeekingClone || !this.activeSlides.includes(index)) {
          attrs["aria-hidden"] = "true";
        }
        if (isPeekingClone && key) {
          key += `-clone-${index}`;
        }
        vnode.key = key;
        vnode.props = {
          ...vnode.props,
          class: staticClass,
          style,
          ...attrs
        };
        return vnode;
      });
    },
    getDefaultSlides(vnodes) {
      return vnodes.reduce((acc, vnode) => {
        if (vnode.type === Fragment) {
          if (Array.isArray(vnode.children)) {
            acc = [...acc, ...this.getDefaultSlides(vnode.children)];
          }
        } else {
          acc.push(vnode);
        }
        return acc;
      }, []);
    },
    // Get the list of non-text slides, including peeking clones. This doesn't
    // work as a computed function
    getSlideComponents() {
      var _a, _b;
      const defaultSlots = this.getDefaultSlides(this.$slots.default() || []);
      const clonedSlots = this.getDefaultSlides(((_b = (_a = this.$slots).clones) == null ? void 0 : _b.call(_a)) || []);
      return [...defaultSlots, ...clonedSlots].filter(
        (vnode) => !getSlotChildrenText$1(vnode)
      );
    },
    // Prevent tabbing to interactive elements in slides with the passed in
    // index values
    denyTabIndex(indices) {
      this.setTabIndex(indices, -1);
    },
    // Allow tabindex on interactive elements in slides with the passed in
    // index values
    allowTabIndex(indices) {
      this.setTabIndex(indices, 0);
    },
    // Set tabindex value on interactive elements in slides with the passed in slides
    setTabIndex(indices, tabindexValue) {
      for (const el of this.getSlideElementsByIndices(indices)) {
        if (el.matches(interactiveSelector)) {
          el.tabIndex = tabindexValue;
        }
        el.querySelectorAll(interactiveSelector).forEach((el2) => {
          el2.tabIndex = tabindexValue;
        });
      }
    },
    // Get the slide elements that match the array of indices
    getSlideElementsByIndices(slideIndices) {
      return Array.from(this.$el.children).filter((el, i) => i in slideIndices);
    }
  },
  render() {
    return h(
      "div",
      {
        class: ["ssr-carousel-track", { dragging: this.dragging }],
        style: this.styles
      },
      this.makeSlides()
    );
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/ssr-carousel-track.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const accessibility = (
  // Store whether the user appears to be using keyboard to navigate
  {
    data() {
      return { usingKeyboard: false };
    },
    computed: {
      // Make the current slide message
      // https://www.w3.org/WAI/tutorials/carousels/functionality/#announce-the-current-item
      currentSlideMessage() {
        return `Item ${this.boundedIndex + 1} of ${this.pages}`;
      }
    },
    watch: {
      // When switching to keyboard navigation, I could never reproduce a scenario
      // where the focused elements wasn't the first slide, so I'm resetting the
      // active page to the first slide
      usingKeyboard() {
        if (this.usingKeyboard) {
          return this.goto(0);
        }
      }
    },
    methods: {
      // Once a user uses tab on the carousel, mark them as using their keyboard.
      // This is cleared by the onPointerDown method.
      onTab() {
        return this.usingKeyboard = true;
      }
    }
  }
);
const autoplay = {
  props: {
    // A delay provided in seconds for the autoplay. 0 is disabled
    autoplayDelay: {
      type: Number,
      default: 0
    },
    // Should we pause on hover
    pauseOnFocus: {
      type: Boolean,
      default: true
    }
  },
  // Start autolaying on mount
  mounted() {
    this.autoplayStart();
  },
  beforeDestroy() {
    this.autoplayStop();
  },
  computed: {
    // Conditions that result in pausing autoplay
    autoplayPaused() {
      if (this.usingKeyboard) {
        return true;
      }
      if (this.pauseOnFocus) {
        return this.windowHidden || this.isFocused;
      }
    }
  },
  watch: {
    autoplayPaused(paused) {
      if (paused) {
        this.autoplayStop();
      } else {
        this.autoplayStart();
      }
    }
  },
  methods: {
    autoplayStart() {
      if (!this.autoplayDelay) {
        return;
      }
      if (!this.pages) {
        return;
      }
      this.autoPlayInterval = setInterval(() => {
        if (!this.autoplayPaused) {
          this.autoplayNext();
        }
      }, this.autoplayDelay * 1e3);
    },
    autoplayStop() {
      clearInterval(this.autoPlayInterval);
    },
    autoplayNext() {
      if (this.shouldLoop || this.index < this.pages - 1) {
        this.next();
      } else {
        this.goto(0);
      }
    }
  }
};
const dimensions = {
  data() {
    return {
      viewportWidth: null,
      // Width of the viewport, for media query calculation
      carouselWidth: null,
      // Width of a page of the carousel
      gutterWidth: 0
      // Computed width of gutters, since they support css vars
    };
  },
  // Add resize listening
  mounted() {
    this.onResize();
    (void 0).addEventListener("resize", this.onResize);
  },
  // Cleanup listeners
  beforeDestroy() {
    (void 0).removeEventListener("resize", this.onResize);
  },
  computed: {
    // The width of a page of slides, which may be less than the carouselWidth
    // if there is peeking. This includes the affect of gutters.
    pageWidth() {
      return this.carouselWidth - this.combinedPeek;
    },
    // Calculate the width of a slide based on client side measured pageWidth
    // rather than measuring it explicitly in the DOM. This value includes the
    // gutter.
    slideWidth() {
      return this.pageWidth / this.currentSlidesPerPage;
    },
    // Calculate the width of the whole track from the slideWidth.
    trackWidth() {
      if (this.isVariableWidth) {
        return this.measuredTrackWidth + this.gutterWidth;
      } else {
        return this.slideWidth * this.slidesCount;
      }
    },
    // Figure out the width of the last page, which may not have enough slides
    // to fill it.
    lastPageWidth() {
      const slidesPerPage = this.currentSlidesPerPage;
      let slidesOnLastPage = this.slidesCount % slidesPerPage;
      if (slidesOnLastPage === 0) {
        slidesOnLastPage = slidesPerPage;
      }
      return slidesOnLastPage * this.slideWidth;
    },
    // The ending x value, only used when not looping. The peeking values in
    // here result in the final page using the left peeking value and the
    // actualy peeking appearing to apply to the left. The +1 is to fix subpixel
    // rounding issues.
    endX() {
      return this.disabled ? 0 : this.pageWidth - this.trackWidth - this.peekLeftPx + this.peekRightPx + 1;
    },
    // Check if the drag is currently out bounds
    isOutOfBounds() {
      return this.currentX > 0 || this.currentX < this.endX;
    }
  },
  methods: {
    // Measure the component width for various calculations. Using
    // getBoundingClientRect so we can get fractional values.  We also need
    // the width of the gutter since that's effectively part of the page.
    onResize() {
      var _a, _b;
      if (!((_a = this.$el) == null ? void 0 : _a.nodeType) === Node.ELEMENT_NODE) {
        return;
      }
      const firstSlide = (_b = this.$refs.track) == null ? void 0 : _b.$el.firstElementChild;
      if (!firstSlide) {
        return;
      }
      this.gutterWidth = parseInt(getComputedStyle(firstSlide).marginRight);
      this.carouselWidth = this.$el.getBoundingClientRect().width + this.gutterWidth;
      this.viewportWidth = (void 0).innerWidth;
      this.capturePeekingMeasurements();
      if (this.isVariableWidth) {
        this.captureTrackWidth();
      }
    },
    // Make the width style that gives a slide it's width given
    // slidesPerPage. Reduce this width by the gutter if present
    makeBreakpointSlideWidthStyle(breakpoint) {
      if (this.isVariableWidth) {
        return;
      }
      return `
        ${this.scopeSelector} .ssr-carousel-slide {
          width: ${this.makeSlideWidthCalc(breakpoint)};
        }
      `;
    },
    // Build the calc string which makes a percentage width for a slide and
    // reduces it by combined peeking and gutter influence. The computed
    // style this produces should have an equal value to the `slideWidth`
    // computed property which is client side JS dependent.
    makeSlideWidthCalc(breakpoint) {
      const isDisabled = this.isDisabledAtBreakpoint(breakpoint);
      const slidesPerPage = this.getResponsiveValue(
        "slidesPerPage",
        breakpoint
      );
      const gutter = this.getResponsiveValue("gutter", breakpoint);
      let peekLeft = this.getResponsiveValue("peekLeft", breakpoint);
      let peekRight = this.getResponsiveValue("peekRight", breakpoint);
      if (this.matchPeekWhenDisabled && isDisabled) {
        peekRight = peekLeft;
      }
      return `calc(
				${100 / slidesPerPage}% -
				(${this.autoUnit(peekLeft)} + ${this.autoUnit(peekRight)}) / ${slidesPerPage} -
				(${this.autoUnit(gutter)} * ${slidesPerPage - 1}) / ${slidesPerPage}
			)`;
    }
  }
};
const passive = { passive: true };
const notPassive = { passive: false };
const dragging = {
  props: {
    // Boundary drag dampening modifier. Increase to allow greater travel outside the boundaries.
    boundaryDampening: {
      type: Number,
      default: 0.6
    },
    // The percentage of a pageWidth that was dragged before we advance to another page on slide
    dragAdvanceRatio: {
      type: Number,
      default: 0.33
    },
    // The ratio of X:Y mouse travel. Decrease this number to allow for greater y dragging before the drag is cancelled.
    verticalDragTreshold: {
      type: Number,
      default: 1
    },
    // Turn off draggability
    noDrag: {
      type: Boolean
    }
  },
  data() {
    return {
      pressing: false,
      // The user pressing pointer down
      dragging: false,
      // The user has translated while pointer was down
      isTouchDrag: false,
      // Is the browser firing touch events
      startPointer: null,
      // Where was the mouse when the drag started
      lastPointer: null,
      // Where was the mouse on the last move event
      dragVelocity: null,
      // The px/tick while dragging, negative is rightward
      dragDirectionRatio: null
      // The ratio of horizontal vs vertical dragging
    };
  },
  // Cleanup listeners
  beforeDestroy() {
    (void 0).removeEventListener("mousemove", this.onPointerMove, passive);
    (void 0).removeEventListener("mouseup", this.onPointerUp, passive);
    (void 0).removeEventListener("touchmove", this.onPointerMove, passive);
    (void 0).removeEventListener("touchend", this.onPointerUp, passive);
    (void 0).removeEventListener("touchmove", this.onWinMove, notPassive);
  },
  computed: {
    // The current slide or page index. It rounds differently depending on the direction of the velocity.
    // So that it eases to a stop in the direction the user was dragging.
    dragIndex() {
      if (Math.abs(this.dragVelocity) <= 2)
        return Math.round(this.fractionalIndex);
      if (this.dragVelocity < 0)
        return Math.ceil(this.fractionalIndex);
      return Math.floor(this.fractionalIndex);
    },
    // Determine the current index given the currentX as a fraction. For instance, when dragging forward,
    // it will be like 0.1 and when you've dragged almost a full page, forward it would be 0.9.
    // This got complicated because the final page may not have a full compliment of slides like if we have 2 per page and 3 slides.
    fractionalIndex() {
      if (!this.trackWidth)
        return 0;
      let x = this.currentX * -1;
      let setIndex = Math.floor(x / this.trackWidth);
      let widthDivisor = this.paginateBySlide ? this.slideWidth : this.pageWidth;
      let pageIndex = Math.floor(
        (x - setIndex * this.trackWidth) / widthDivisor
      );
      let distanceIntoPage = x - setIndex * this.trackWidth - pageIndex * widthDivisor;
      let slidesPerPage = this.currentSlidesPerPage;
      let remainingSlides = this.shouldLoop ? this.slidesCount - pageIndex * slidesPerPage : this.slidesCount - (pageIndex + 1) * slidesPerPage;
      let isLastPage = remainingSlides <= slidesPerPage;
      let pageWidth = isLastPage ? this.lastPageWidth : widthDivisor;
      let pageProgressPercent = distanceIntoPage / pageWidth;
      return pageProgressPercent + setIndex * this.pages + pageIndex;
    },
    // Determine if the user is dragging vertically
    isVerticalDrag() {
      if (!this.dragDirectionRatio)
        return false;
      return this.dragDirectionRatio < this.verticalDragTreshold;
    },
    // If we're horizontally swiping on a touch device, prevent vertical scroll
    preventVerticalScroll() {
      return this.pressing && this.isTouchDrag && !this.isVerticalDrag;
    }
  },
  watch: {
    // Watch for mouse move changes when the user starts dragging
    pressing() {
      let moveEvent, upEvent;
      if (this.isTouchDrag) {
        [moveEvent, upEvent] = ["touchmove", "touchend"];
      } else {
        [moveEvent, upEvent] = ["mousemove", "mouseup"];
      }
      if (this.pressing) {
        (void 0).addEventListener(moveEvent, this.onPointerMove, passive);
        (void 0).addEventListener(upEvent, this.onPointerUp, passive);
        (void 0).addEventListener("contextmenu", this.onPointerUp, passive);
        this.dragVelocity = 0;
        this.preventContentDrag();
        this.stopTweening();
      } else {
        if (this.isOutOfBounds && !this.shouldLoop) {
          if (this.currentX >= 0)
            this.gotoStart();
          else
            this.gotoEnd();
        } else if (this.isVariableWidth) {
          this.tweenToStop();
        } else if (this.isVerticalDrag) {
          this.goto(this.index);
        } else {
          this.goto(this.dragIndex);
        }
        (void 0).removeEventListener(moveEvent, this.onPointerMove, passive);
        (void 0).removeEventListener(upEvent, this.onPointerUp, passive);
        (void 0).removeEventListener("contextmenu", this.onPointerUp, passive);
        this.dragging = false;
        this.startPointer = this.lastPointer = this.dragDirectionRatio = null;
      }
      if (this.pressing)
        this.$emit("press");
      else
        this.$emit("release");
    },
    // Fire events related to dragging
    dragging() {
      if (this.dragging)
        this.$emit("drag:start");
      else
        this.$emit("drag:end");
    },
    // If the user is dragging vertically, end the drag based on the assumption
    // that the user is attempting to scroll the page via touch rather than pan the carousel.
    isVerticalDrag() {
      if (!this.isVerticalDrag && this.isTouchDrag)
        this.pressing = false;
    },
    // Stop vertical scrolling by listening for touchmove events on the body and cancel them.
    // Need to explicitly set passive because some mobile browsers set it to true by default.
    preventVerticalScroll(shouldPrevent) {
      if (shouldPrevent) {
        (void 0).addEventListener("touchmove", this.stopEvent, notPassive);
      } else {
        (void 0).removeEventListener("touchmove", this.stopEvent, notPassive);
      }
    }
  },
  methods: {
    // Cancel an Event
    stopEvent(e) {
      e.preventDefault();
    },
    // Keep track of whether the user is dragging
    onPointerDown(pointerEvent) {
      this.isTouchDrag = (void 0).TouchEvent && pointerEvent instanceof TouchEvent;
      this.startPointer = this.lastPointer = this.getPointerCoords(pointerEvent);
      this.pressing = true;
      this.usingKeyboard = false;
    },
    // Keep track of release of press
    onPointerUp() {
      this.pressing = false;
    },
    // Keep x values up to date while dragging
    onPointerMove(pointerEvent) {
      this.dragging = true;
      let pointer = this.getPointerCoords(pointerEvent);
      this.dragVelocity = pointer.x - this.lastPointer.x;
      this.targetX += this.dragVelocity;
      this.lastPointer = pointer;
      this.dragDirectionRatio = Math.abs(
        (pointer.x - this.startPointer.x) / (pointer.y - this.startPointer.y)
      );
      this.currentX = this.applyBoundaryDampening(this.targetX);
    },
    // Helper to get the x position of either a touch or mouse event
    getPointerCoords(pointerEvent) {
      var _a, _b, _c, _d;
      return {
        x: ((_b = (_a = pointerEvent.touches) == null ? void 0 : _a[0]) == null ? void 0 : _b.pageX) || pointerEvent.pageX,
        y: ((_d = (_c = pointerEvent.touches) == null ? void 0 : _c[0]) == null ? void 0 : _d.pageY) || pointerEvent.pageY
      };
    },
    // Prevent dragging from exceeding the min/max edges
    applyBoundaryDampening(x) {
      if (this.shouldLoop)
        return x;
      if (x > 0)
        return Math.pow(x, this.boundaryDampening);
      if (x < this.endX)
        return this.endX - Math.pow(this.endX - x, this.boundaryDampening);
      return this.applyXBoundaries(x);
    },
    // Constraint the x value to the min and max values
    applyXBoundaries(x) {
      if (this.shouldLoop)
        return x;
      return Math.max(this.endX, Math.min(0, x));
    },
    // Prevent the anchors and images from being draggable (like via their ghost outlines).
    // Using this approach because the draggable HTML attribute didn't work in FF.
    // This only needs to be run once.
    preventContentDrag() {
      if (this.contentDragPrevented)
        return;
      this.$refs.track.$el.querySelectorAll("a, img").forEach((el) => {
        el.addEventListener("dragstart", (e) => {
          e.preventDefault();
        });
      });
      this.contentDragPrevented = true;
    }
  }
};
const feathering = {
  props: {
    // Shorthand for enabling boolean and setting its width
    feather: {
      type: [Boolean, String, Number],
      default: false
    }
  },
  methods: {
    // Add feathering styles via breakpoint
    makeBreakpointFeatheringStyle(breakpoint) {
      if (this.isDisabledAtBreakpoint(breakpoint))
        return;
      let feather = this.getResponsiveValue("feather", breakpoint);
      if (feather === false || feather === null)
        return;
      feather = feather && typeof feather !== "boolean" ? feather : 20;
      feather = this.autoUnit(feather);
      let cssValue = `
        linear-gradient(to right,
          transparent, black ${feather},
          black calc(100% - ${feather}),
          transparent)
      `;
      return `
        ${this.scopeSelector} .ssr-carousel-mask {
          -webkit-mask-image: ${cssValue};
          mask-image: ${cssValue};
        }
      `;
    }
  }
};
const focus = {
  data() {
    return {
      hovered: false,
      windowVisible: true
    };
  },
  computed: {
    isFocused() {
      return this.windowVisible && this.hovered;
    },
    windowHidden() {
      return !this.windowVisible;
    }
  },
  methods: {
    onEnter() {
      this.hovered = true;
    },
    onLeave() {
      this.hovered = false;
    },
    updateVisibility() {
      this.windowVisible = !(void 0).hidden;
    }
  },
  mounted() {
    if (!this.watchesHover)
      return;
    (void 0).addEventListener("visibilitychange", this.updateVisibility);
  },
  beforeDestroy() {
    (void 0).removeEventListener("visibilitychange", this.updateVisibility);
  }
};
const gutters = {
  props: {
    // The gutters between slides
    gutter: {
      type: [Number, String],
      default: 20
    }
  },
  methods: {
    // Apply gutters between slides via margins
    makeBreakpointSlideGutterStyle(breakpoint) {
      const gutter = this.getResponsiveValue("gutter", breakpoint);
      const lastChildGutter = this.isDisabledAtBreakpoint(breakpoint) ? 0 : gutter;
      return `
        ${this.scopeSelector} .ssr-carousel-slide {
          margin-right: ${this.autoUnit(gutter)};
        }
        ${this.scopeSelector} .ssr-carousel-slide:is(:last-child) {
          margin-right: ${this.autoUnit(lastChildGutter)};
        }
      `;
    }
  }
};
const looping = {
  props: {
    // Add prop to enable looping
    loop: Boolean,
    // Place the first slide in the center of the layout
    center: Boolean
  },
  data() {
    return {
      slideOrder: []
    };
  },
  computed: {
    // Disable looping when the user is using keyboard navigation
    shouldLoop() {
      return this.loop && !this.usingKeyboard;
    },
    // This represents the current (as in while scrolling / animating) left most
    // slide index. This is used in looping calculation so that the reordering
    // of slides isn't affected by paginatePerSlide setting.
    currentSlideIndex() {
      return Math.floor(this.currentX / this.slideWidth * -1);
    },
    // When looping, slides get re-ordered. This value is added to the
    // track transform so that the slides don't feel like they were re-ordered.
    trackLoopOffset() {
      if (!this.shouldLoop)
        return 0;
      let offsetSlideCount = this.currentSlideIndex;
      if (this.hasLeftPeekClone)
        offsetSlideCount -= 1;
      return offsetSlideCount * this.slideWidth;
    },
    // Get slideIndex of the right most and left most slides indexes
    leftMostSlideIndex() {
      return this.slideOrder.findIndex((index) => index === 0);
    },
    rightMostSlideIndex() {
      return this.slideOrder.findIndex(
        (index) => index === this.slideOrder.length - 1
      );
    }
  },
  watch: {
    // This represents the current (as in while scrolling / animating) left most
    // slide index. This is used in looping calculation so that the reordering
    // of slides isn't affected by paginatePerSlide setting.
    currentSlideIndex: {
      immediate: true,
      handler() {
        this.setSlideOrder();
      }
    },
    // Also update the slide order when the slides per page changes
    currentSlidesPerPage() {
      this.setSlideOrder();
    }
  },
  methods: {
    // Calculating via watcher to prevent unnecessary recalculations (I noticed a
    // bunch of calls when this was done via a computed property)
    setSlideOrder() {
      let indices = [...Array(this.slidesCount).keys()];
      let count = indices.length;
      if (this.center) {
        let split = Math.floor(this.currentSlidesPerPage / 2);
        indices = [...indices.slice(split), ...indices.slice(0, split)];
      }
      if (this.shouldLoop) {
        let split = (count - this.currentSlideIndex) % count;
        indices = [...indices.slice(split), ...indices.slice(0, split)];
      }
      this.slideOrder = indices;
    },
    // Reorder the initial slide state using CSS because the order is dependent
    // on the slides per page which isn't known via JS until hydrating
    makeBreakpointSlideOrderStyle(breakpoint) {
      if (!this.center)
        return;
      let slidesPerPage = this.getResponsiveValue("slidesPerPage", breakpoint);
      let split = Math.floor(slidesPerPage / 2);
      let rules = [];
      for (let i = 0; i <= this.slidesCount; i++) {
        rules.push(`
          ${this.scopeSelector} .ssr-carousel-slide:nth-child(${i + 1}) {
            order: ${(i + split) % this.slidesCount};
          }
        `);
      }
      return rules.join("");
    }
  }
};
const getSlotChildrenText = (node) => {
  if (!node.children || typeof node.children === "string")
    return node.children || "";
  else if (Array.isArray(node.children))
    return getSlotChildrenText(node.children);
  else if (node.children.default)
    return getSlotChildrenText(node.children.default());
};
const pagination = {
  props: {
    // If true, advance whole pages when navigating
    paginateBySlide: Boolean,
    // Syncs to the `index` value via v-model
    modelValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      index: this.modelValue,
      // The current page; when looping may exceed slideCount
      currentX: 0,
      // The actual left offset of the slides container
      targetX: 0
      // Where we may be tweening the slide to
    };
  },
  computed: {
    // The current number of pages
    pages() {
      if (this.paginateBySlide) {
        if (this.shouldLoop) {
          return this.slidesCount;
        }
        return this.slidesCount - this.currentSlidesPerPage + 1;
      }
      return Math.ceil(this.slidesCount / this.currentSlidesPerPage);
    },
    // Disable carousel-ness when there aren't enough slides
    disabled() {
      if (this.isVariableWidth) {
        return Math.round(this.trackWidth) <= Math.round(this.carouselWidth);
      }
      return this.slidesCount <= this.currentSlidesPerPage;
    },
    // Get just the slotted slides that are components, ignoring text nodes
    // which may exist as a result of whitespace
    slides() {
      return this.getDefaultSlides(this.$slots.default()) || [].filter((vnode) => !getSlotChildrenText(vnode));
    },
    // Get the total number of slides
    slidesCount() {
      return this.slides.length;
    },
    // Apply boundaries to the index, which will exceed them when looping
    boundedIndex() {
      const boundedIndex = this.index % this.pages;
      if (boundedIndex < 0) {
        return this.pages + boundedIndex;
      } else {
        return boundedIndex;
      }
    },
    // The current incomplete page offset
    currentIncompletePageOffset() {
      return this.makeIncompletePageOffset(this.index);
    },
    // Get an array of slide offsets of the slides that are 100% in the
    // viewport. Aka, the count will be equal the currentSlidesPerPage per page.
    activeSlides() {
      if (this.isVariableWidth) {
        return [...Array(this.slidesCount).keys()];
      }
      let start = this.paginateBySlide ? this.boundedIndex : this.boundedIndex * this.currentSlidesPerPage;
      if (!this.shouldLoop) {
        start -= this.boundedIndex % this.currentSlidesPerPage;
      }
      const results = [];
      for (let i = start; i < start + this.currentSlidesPerPage; i++) {
        results.push(i);
      }
      return results.reduce((slides, offset) => {
        if (this.shouldLoop) {
          slides.push(offset % this.slidesCount);
        } else if (offset < this.slidesCount) {
          slides.push(offset);
        }
        return slides;
      }, []);
    }
  },
  watch: {
    // Treat v-model update:modelValue as a "goto" request
    modelValue() {
      if (this.modelValue !== this.applyIndexBoundaries(this.modelValue)) {
        this.$emit("update:modelValue", this.boundedIndex);
      } else if (this.modelValue !== this.boundedIndex) {
        this.goto(this.modelValue);
      }
    },
    // Emit events on index change
    boundedIndex() {
      this.$emit("change", { index: this.boundedIndex });
      this.$emit("update:modelValue", this.boundedIndex);
    }
  },
  methods: {
    getDefaultSlides(vnodes) {
      return vnodes.reduce((acc, vnode) => {
        if (vnode.type === Fragment) {
          if (Array.isArray(vnode.children)) {
            acc = [...acc, ...this.getDefaultSlides(vnode.children)];
          }
        } else {
          acc.push(vnode);
        }
        return acc;
      }, []);
    },
    // Advance methods
    next() {
      this.goto(this.index + 1);
    },
    back() {
      this.goto(this.index - 1);
    },
    // The dots are ignorant of looping, so convert their bounded index to the
    // true index so we don't animate through a ton of pages going to the
    // clicked dot.
    gotoDot(dotIndex) {
      this.goto(dotIndex - this.boundedIndex + this.index);
    },
    // Go to a specific index
    goto(index) {
      this.index = this.applyIndexBoundaries(index);
      this.tweenToIndex(this.index);
    },
    // Go to the beginning of track
    gotoStart() {
      if (this.isVariableWidth) {
        this.tweenToX(0);
      } else {
        this.goto(0);
      }
    },
    // Go to the end of the track
    gotoEnd() {
      if (this.isVariableWidth) {
        this.tweenToX(this.endX);
      } else {
        this.goto(this.pages - 1);
      }
    },
    // Tween to a specific index
    tweenToIndex(index) {
      this.targetX = this.getXForIndex(index);
      this.startTweening();
    },
    // Jump to an index with no tween
    jumpToIndex(index) {
      this.currentX = this.targetX = this.getXForIndex(index);
    },
    // Calculate the X value given an index
    getXForIndex(index) {
      let x = this.paginateBySlide ? index * this.slideWidth * -1 : index * this.pageWidth * -1;
      x += this.makeIncompletePageOffset(index);
      return Math.round(this.applyXBoundaries(x));
    },
    // Creates a px value to represent adjustments that should be made to
    // account for incomplete pages of slides when looping is enabled. Like
    // when there are 3 slotted slides and 2 slides per page and you have looped
    // over to the 2nd page index of 0. The track needs to be shifted to the
    // left by one slideWidth in this case.
    makeIncompletePageOffset(index) {
      if (!(this.shouldLoop && !this.paginateBySlide)) {
        return 0;
      }
      const incompleteWidth = this.pageWidth - this.lastPageWidth;
      return Math.floor(index / this.pages) * incompleteWidth;
    },
    // Apply boundaries to the index
    applyIndexBoundaries(index) {
      return this.shouldLoop ? index : Math.max(0, Math.min(this.pages - 1, index));
    }
  }
};
const peeking = {
  props: {
    // Use gutter's as the peeking value
    peekGutter: Boolean,
    // Set both peeking values at once
    peek: {
      type: [Number, String],
      default(rawProps) {
        if (!rawProps.peekGutter)
          return 0;
        return `calc(${rawProps.gutter} - 1px)`;
      }
    },
    // Distinct left/right peeking values
    peekLeft: {
      type: [Number, String],
      default(rawProps) {
        return rawProps.peek;
      }
    },
    peekRight: {
      type: [Number, String],
      default(rawProps) {
        return rawProps.peek;
      }
    },
    // When true, the peekLeft is used for the peekRight if the carousel is
    // disabled.  This behavior is expecting that there may be a different
    // peekRight (to hint at additional slides) but when there
    // aren't more slide to peek in, the peek value should functional like padding.
    matchPeekWhenDisabled: {
      type: Boolean,
      default: true
    },
    // Disable the overflow:hidden on the mask
    overflowVisible: Boolean
  },
  data() {
    return {
      // Store clones of the slides used for peeking
      clones: [],
      // Store computed peek values
      peekLeftPx: 0,
      peekRightPx: 0
    };
  },
  computed: {
    // Determine if clones should be created
    hasPeekClones() {
      return this.hasLeftPeekClone || this.hasRightPeekClone;
    },
    hasPeekPrerequisites() {
      return this.shouldLoop && this.slidesCount > 1;
    },
    hasLeftPeekClone() {
      return this.hasPeekPrerequisites && this.peekLeft;
    },
    hasRightPeekClone() {
      return this.hasPeekPrerequisites && this.peekRight;
    },
    // Figure out which slide indexes to show in the left and right peek slots
    leftPeekingSlideIndex() {
      if (this.hasLeftPeekClone) {
        return this.rightMostSlideIndex;
      }
    },
    rightPeekingSlideIndex() {
      if (this.hasRightPeekClone) {
        return this.leftMostSlideIndex;
      }
    },
    // Combine the peeking values, which is needed commonly
    combinedPeek() {
      return this.peekLeftPx + this.peekRightPx;
    },
    // Make the styles object for reading computed styles
    peekStyles() {
      const breakpoint = this.currentResponsiveBreakpoint;
      return {
        left: this.autoUnit(this.getResponsiveValue("peekLeft", breakpoint)),
        right: this.autoUnit(this.getResponsiveValue("peekRight", breakpoint))
      };
    }
  },
  watch: {
    // Recapture peeking values if the source props change
    peekLeft() {
      this.capturePeekingMeasurements();
    },
    peekRight() {
      this.capturePeekingMeasurements();
    },
    peek() {
      this.capturePeekingMeasurements();
    },
    peekGutter() {
      this.capturePeekingMeasurements();
    },
    responsive() {
      this.capturePeekingMeasurements();
    }
  },
  methods: {
    // Capture measurements of peeking values
    capturePeekingMeasurements() {
      if (!this.$refs.peekValues)
        return;
      const styles = getComputedStyle(this.$refs.peekValues);
      this.peekLeftPx = parseInt(styles.left);
      this.peekRightPx = parseInt(styles.right);
    },
    // Calculate the offset that gets added to the current position to account
    // for prepended slides from peeking. This replicates the JS required to
    // make `trackLoopOffset` using CSS only so there is now reflow when JS
    // hydrates.  This gets overridden by the track's inline translateX style.
    makeBreakpointTrackTransformStyle(breakpoint) {
      if (this.isDisabledAtBreakpoint(breakpoint))
        return;
      const peekLeft = this.getResponsiveValue("peekLeft", breakpoint);
      let rule;
      if (!this.hasLeftPeekClone) {
        rule = `transform: translateX(${this.autoUnit(peekLeft)});`;
      } else {
        const gutter = this.getResponsiveValue("gutter", breakpoint);
        rule = `transform: translateX(calc(${this.autoUnit(
          peekLeft
        )} - (${this.makeSlideWidthCalc(breakpoint)} + ${this.autoUnit(
          gutter
        )})));`;
      }
      return `${this.scopeSelector} .ssr-carousel-track { ${rule} }`;
    }
  }
};
const responsive = {
  props: {
    // How many slides are visible at once in the viewport if no responsive
    // rules apply
    slidesPerPage: {
      type: Number,
      default: 1
    },
    // Provide different slides per page at different viewport widths
    responsive: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // Make the css scopeId from things that can influence the styles, like the
    // slides count and props.
    scopeId() {
      return this.hashString(
        this.slidesCount + "|" + JSON.stringify(this.$props)
      );
    },
    // Massage media queries into the responsive prop
    responsiveRules() {
      return this.responsive.map((breakpoint) => {
        return {
          ...breakpoint,
          mediaQuery: this.makeMediaQuery(breakpoint),
          active: this.isBreakpointActive(breakpoint),
          peekLeft: breakpoint.peekLeft || breakpoint.peek || breakpoint.gutter && breakpoint.peekGutter,
          peekRight: breakpoint.peekRight || breakpoint.peek || breakpoint.gutter && breakpoint.peekGutter
        };
      });
    },
    // Get current responsive values
    currentSlidesPerPage() {
      return this.getResponsiveValue(
        "slidesPerPage",
        this.currentResponsiveBreakpoint
      );
    },
    // Get the current responsive rule by looping backwards through the
    // responsiveRules to return the last matching rule.
    currentResponsiveBreakpoint() {
      const reversedRules = [...this.responsiveRules].reverse();
      const match = reversedRules.find(({ active }) => active);
      if (match) {
        return match;
      } else {
        return {
          slidesPerPage: this.slidesPerPage,
          gutter: this.gutter,
          peekLeft: this.peekLeft || this.peek || this.gutter && this.peekGutter,
          peekRight: this.peekRight || this.peek || this.gutter && this.peekGutter,
          feather: this.feather
        };
      }
    },
    // Make the scoping selector
    scopeSelector() {
      return `[data-ssrc-id='${this.scopeId}']`;
    },
    // Assemble all the dynamic instance styles
    instanceStyles() {
      return "<style>" + this.makeBreakpointStyles(this.$props) + this.responsiveRules.map((breakpoint) => {
        return `@media ${breakpoint.mediaQuery} {
              ${this.makeBreakpointStyles(breakpoint)}
            }`;
      }).join(" ") + "</style>";
    }
  },
  watch: {
    // Fix alignment of slides while resizing
    pageWidth() {
      this.jumpToIndex(this.index);
    },
    // If resizing the browser leads to disabling, reset the slide to the first
    // page.  Like if a user had switched to the 2nd page on mobile and then
    // resized to desktop
    disabled() {
      if (this.disabled)
        this.goto(0);
    }
  },
  methods: {
    // Take an item from the responsive array and make a media query from it
    makeMediaQuery(breakpoint) {
      const rules = [];
      if (breakpoint.maxWidth) {
        rules.push(`(max-width: ${breakpoint.maxWidth}px)`);
      }
      if (breakpoint.minWidth) {
        rules.push(`(min-width: ${breakpoint.minWidth}px)`);
      }
      return rules.join(" and ");
    },
    // Make the block of styles for a breakpoint
    makeBreakpointStyles(breakpoint) {
      return [
        this.makeBreakpointDisablingRules(breakpoint),
        this.makeBreakpointFeatheringStyle(breakpoint),
        this.makeBreakpointTrackTransformStyle(breakpoint),
        this.makeBreakpointSlideWidthStyle(breakpoint),
        this.makeBreakpointSlideGutterStyle(breakpoint),
        this.makeBreakpointSlideOrderStyle(breakpoint)
      ].join(" ");
    },
    // Apply disabling styles via breakpoint when there are not enough slides
    // for the slidesPerPage
    makeBreakpointDisablingRules(breakpoint) {
      const slidesPerPage = this.getResponsiveValue(
        "slidesPerPage",
        breakpoint
      );
      if (this.slidesCount <= slidesPerPage) {
        return `
          ${this.scopeSelector} .ssr-carousel-track { justify-content: center; }
          ${this.scopeSelector} .ssr-carousel-arrows,
          ${this.scopeSelector} .ssr-carousel-dots { display: none; }
        `;
      } else {
        return `
          ${this.scopeSelector} .ssr-carousel-track { justify-content: start; }
          ${this.scopeSelector} .ssr-carousel-arrows { display: block; }
          ${this.scopeSelector} .ssr-carousel-dots { display: flex; }
        `;
      }
    },
    // Check if carousel disabled at the breakpoint
    isDisabledAtBreakpoint(breakpoint) {
      const slidesPerPage = this.getResponsiveValue(
        "slidesPerPage",
        breakpoint
      );
      return this.slidesCount <= slidesPerPage;
    },
    // Check if a breakpoint would apply currently. Not using window.matchQuery
    // so I can consume via a computed property
    isBreakpointActive(breakpoint) {
      if (!this.viewportWidth)
        return false;
      if (breakpoint.maxWidth && this.viewportWidth > breakpoint.maxWidth)
        return false;
      return !(breakpoint.minWidth && this.viewportWidth < breakpoint.minWidth);
    },
    // Find the first breakpoint with a property set
    getResponsiveValue(property, breakpoint) {
      if (breakpoint[property] !== void 0)
        return breakpoint[property];
      if (!this.responsiveRules.length)
        return this[property];
      const ruleMatch = this.responsiveRules.find((rule) => {
        if (!rule[property])
          return;
        if (breakpoint.maxWidth && rule.minWidth && rule.minWidth < breakpoint.maxWidth)
          return true;
        if (breakpoint.maxWidth && rule.maxWidth && rule.maxWidth < breakpoint.maxWidth)
          return true;
        if (breakpoint.minWidth && rule.minWidth && rule.minWidth > breakpoint.minWidth)
          return true;
        if (breakpoint.minWidth && rule.maxWidth && rule.minWidth > breakpoint.minWidth)
          return true;
      });
      return ruleMatch ? ruleMatch[property] : this[property];
    },
    // Make a hash from a string, adapted from:
    // https://stackoverflow.com/a/33647870/59160
    hashString(str) {
      let hash2 = 0;
      for (let i = 0, len = str.length; i < len; i++) {
        hash2 = (hash2 << 5) - hash2 + str.charCodeAt(i) << 0;
      }
      return hash2.toString(36);
    },
    // Add px unit to a value if numeric
    autoUnit(val) {
      return val ? String(val).match(/^[\d\-.]+$/) ? `${val}px` : val : "0px";
    }
  }
};
const tweening = {
  props: {
    tweenDampening: {
      type: Number,
      default: 0.12
    },
    tweenInertia: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      currentX: 0,
      targetX: 0,
      tweening: false,
      rafId: null
    };
  },
  beforeDestroy() {
    (void 0).cancelAnimationFrame(this.rafId);
  },
  watch: {
    tweening() {
      if (this.tweening) {
        this.$emit("tween:start", { index: this.index });
        this.tweenToTarget();
      } else {
        (void 0).cancelAnimationFrame(this.rafId);
        this.$emit("tween:end", { index: this.index });
      }
    }
  },
  methods: {
    tweenToX(x) {
      this.targetX = Math.round(x);
      this.startTweening();
    },
    startTweening() {
      if (this.tweening)
        return;
      if (this.currentX === this.targetX)
        return;
      this.tweening = true;
    },
    stopTweening() {
      this.tweening = false;
    },
    tweenToTarget() {
      this.currentX = this.currentX + (this.targetX - this.currentX) * this.tweenDampening;
      if (Math.abs(this.targetX - this.currentX) < 1) {
        this.currentX = this.targetX;
        this.tweening = false;
      } else {
        this.rafId = (void 0).requestAnimationFrame(this.tweenToTarget);
      }
    },
    tweenToStop() {
      this.targetX = this.applyXBoundaries(
        this.currentX + this.dragVelocity * this.tweenInertia
      );
      this.startTweening();
    }
  }
};
const variableWidth = {
  data() {
    return {
      measuredTrackWidth: 0
    };
  },
  computed: {
    isVariableWidth() {
      return this.slidesPerPage == null;
    }
  },
  methods: {
    captureTrackWidth() {
      if (!this.$refs.track)
        return;
      this.measuredTrackWidth = this.$refs.track.$el.scrollWidth;
    }
  }
};
const _sfc_main$3 = {
  name: "SsrCarousel",
  mixins: [
    accessibility,
    autoplay,
    dimensions,
    dragging,
    feathering,
    focus,
    gutters,
    looping,
    pagination,
    responsive,
    peeking,
    // After `responsive` so prop can access `gutter` prop
    tweening,
    variableWidth
  ],
  components: {
    SsrCarouselArrows,
    SsrCarouselDots,
    SsrCarouselTrack: _sfc_main$4
  },
  emits: [
    "update:modelValue",
    "tween:start",
    "tween:end",
    "drag:start",
    "drag:end",
    "change",
    "release",
    "press"
  ],
  props: {
    showArrows: {
      type: Boolean
    },
    showDots: {
      type: Boolean
    }
  },
  computed: {
    // Combine the different factors that come together to determine the x
    // transform of the track.  We don't return a value until the carousel
    // width is measured since the calculation depends on that.
    trackTranslateX() {
      if (!(this.carouselWidth && !this.disabled))
        return;
      return this.currentX + // The value from tweening or dragging
      this.trackLoopOffset + // Offset from re-ordering slides for looping
      this.peekLeftPx;
    },
    watchesHover() {
      return this.autoplayDelay > 0;
    },
    maskListeners() {
      if (this.disabled)
        return {};
      return {
        ...this.noDrag ? {} : {
          mousedown: this.onPointerDown,
          touchstart: this.onPointerDown
        },
        ...!this.watchesHover ? {} : {
          mouseenter: this.onEnter,
          mouseleave: this.onLeave
        }
      };
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ssr_carousel_track = resolveComponent("ssr-carousel-track");
  const _component_ssr_carousel_arrows = resolveComponent("ssr-carousel-arrows");
  const _component_ssr_carousel_dots = resolveComponent("ssr-carousel-dots");
  if (_ctx.$slots.default() && _ctx.$slots.default().length) {
    _push(`<div${ssrRenderAttrs(mergeProps({
      class: "ssr-carousel",
      key: _ctx.$slots.default().length,
      "data-ssrc-id": _ctx.scopeId
    }, _attrs))}><span>${_ctx.instanceStyles}</span><div class="ssr-carousel-slides"><div class="ssr-peek-values" style="${ssrRenderStyle(_ctx.peekStyles)}"></div><div class="${ssrRenderClass([{
      pressing: _ctx.pressing,
      disabled: _ctx.disabled,
      "no-mask": _ctx.overflowVisible,
      "not-draggable": _ctx.noDrag
    }, "ssr-carousel-mask"])}">`);
    _push(ssrRenderComponent(_component_ssr_carousel_track, mergeProps({ ref: "track" }, {
      dragging: _ctx.dragging,
      trackTranslateX: $options.trackTranslateX,
      slideOrder: _ctx.slideOrder,
      activeSlides: _ctx.activeSlides,
      leftPeekingSlideIndex: _ctx.leftPeekingSlideIndex,
      rightPeekingSlideIndex: _ctx.rightPeekingSlideIndex
    }), createSlots({
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
        } else {
          return [
            renderSlot(_ctx.$slots, "default")
          ];
        }
      }),
      _: 2
    }, [
      _ctx.hasPeekClones ? {
        name: "clones",
        fn: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        key: "0"
      } : void 0
    ]), _parent));
    _push(`</div>`);
    if ($props.showArrows) {
      _push(ssrRenderComponent(_component_ssr_carousel_arrows, mergeProps({ index: _ctx.index, pages: _ctx.pages, shouldLoop: _ctx.shouldLoop }, {
        onBack: _ctx.back,
        onNext: _ctx.next
      }), {
        back: withCtx((props, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "back-arrow", props, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "back-arrow", props)
            ];
          }
        }),
        next: withCtx((props, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "next-arrow", props, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "next-arrow", props)
            ];
          }
        }),
        _: 3
      }, _parent));
    } else {
      _push(`<!---->`);
    }
    if ($props.showDots) {
      _push(ssrRenderComponent(_component_ssr_carousel_dots, mergeProps({ boundedIndex: _ctx.boundedIndex, pages: _ctx.pages }, { onGoto: _ctx.gotoDot }), {
        dot: withCtx((props, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "dot", props, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "dot", props)
            ];
          }
        }),
        _: 3
      }, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="ssr-carousel-visually-hidden" aria-live="polite" aria-atomic="true">${ssrInterpolate(_ctx.currentSlideMessage)}</div></div></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../src/ssr-carousel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SsrCarousel = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]);
const ssr_carousel_ZEXYE8H2cN = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("ssr-carousel", SsrCarousel);
});
const plugins = [
  unhead_3Bi0E2Ktsf,
  plugin,
  revive_payload_server_ICvz7TjQsJ,
  components_plugin_KR1HBZs4kY,
  documentDriven_tTNjjYemDi,
  ssr_carousel_ZEXYE8H2cN
];
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_0$1 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    },
    fallback: {
      type: [String, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const RouteProvider = defineComponent({
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, expose }) {
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    const pageRef = ref();
    const forkRoute = inject(PageRouteSymbol, null);
    let previousPageKey;
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    if (props.pageKey) {
      watch(() => props.pageKey, (next, prev) => {
        if (next !== prev) {
          nuxtApp.callHook("page:loading:start");
        }
      });
    }
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            done();
            return;
          }
          const key = generateRouteKey$1(routeProps, props.pageKey);
          if (!nuxtApp.isHydrating && !hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component) && previousPageKey === key) {
            nuxtApp.callHook("page:loading:end");
          }
          previousPageKey = key;
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          const keepaliveConfig = props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive;
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              keepaliveConfig,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).then(() => nuxtApp.callHook("page:loading:end")).finally(done));
                }
              }, {
                default: () => {
                  const providerVNode = h(RouteProvider, {
                    key: key || void 0,
                    vnode: routeProps.Component,
                    route: routeProps.route,
                    renderKey: key || void 0,
                    trackRootNodes: hasTransition,
                    vnodeRef: pageRef
                  });
                  return providerVNode;
                }
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0
  }));
  return defu(..._props);
}
function hasChildrenRoutes(fork, newRoute, Component) {
  if (!fork) {
    return false;
  }
  const index = newRoute.matched.findIndex((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === (Component == null ? void 0 : Component.type);
  });
  return index < newRoute.matched.length - 1;
}
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0$1;
  const _component_NuxtPage = __nuxt_component_0;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    (_error.stack || "").split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./_nuxt/error-404-lJ443G3q.mjs').then((r) => r.default || r));
    const _Error = defineAsyncComponent(() => import('./_nuxt/error-500-xszATyCP.mjs').then((r) => r.default || r));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ErrorComponent = _sfc_main$1;
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = defineAsyncComponent(() => import('./_nuxt/island-renderer-A7W8f7he.mjs').then((r) => r.default || r));
    const nuxtApp = /* @__PURE__ */ useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RootComponent = _sfc_main;
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.hooks.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useRuntimeConfig as a, navigateTo as b, createError as c, useRoute as d, entry$1 as default, useState as e, asyncDataDefaults as f, useNuxtApp as g, useRequestEvent as h, useCookie as i, get as j, assertArray as k, ensureArray as l, apply as m, nuxtLinkDefaults as n, omit as o, withKeys as p, createQuery as q, useContentPreview as r, sortList as s, __nuxt_component_0 as t, useRouter as u, withoutKeys as w };
//# sourceMappingURL=server.mjs.map

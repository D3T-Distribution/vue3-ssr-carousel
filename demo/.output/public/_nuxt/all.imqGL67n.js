import v from"./slide.TFm6ElMu.js";import{_ as E,r as w,o as r,c as a,b as g,w as y,F as p,g as u,d as t,a as d,t as _,h as i,p as x,e as S}from"./entry.mIXH7iIk.js";const k={components:{Slide:v},data(){return{events:[]}},methods:{logEvent(o,n){return this.events.unshift({name:o,payload:n})}}},m=o=>(x("data-v-d86f4662"),o=o(),S(),o),N={class:"events-demo"},h={key:0,class:"events"},C={class:"event"},D={class:"name"},I=m(()=>d("strong",null,"Event:",-1)),V={key:0,class:"payload"},B=m(()=>d("strong",null,"Payload:",-1));function T(o,n,F,P,l,s){const c=v,f=w("ssr-carousel");return r(),a("div",N,[g(f,{"show-arrows":"","show-dots":"",onChange:n[0]||(n[0]=e=>s.logEvent("change",e)),onPress:n[1]||(n[1]=e=>s.logEvent("press",e)),onRelease:n[2]||(n[2]=e=>s.logEvent("release",e)),"onDrag:start":n[3]||(n[3]=e=>s.logEvent("drag:start",e)),"onDrag:input":n[4]||(n[4]=e=>s.logEvent("drag:input",e)),"onDrag:end":n[5]||(n[5]=e=>s.logEvent("drag:end",e)),"onTween:start":n[6]||(n[6]=e=>s.logEvent("tween:start",e)),"onTween:end":n[7]||(n[7]=e=>s.logEvent("tween:end",e))},{default:y(()=>[(r(),a(p,null,u(3,e=>g(c,{index:e,key:e},null,8,["index"])),64))]),_:1}),l.events.length?(r(),a("pre",h,[t("      "),(r(!0),a(p,null,u(l.events,e=>(r(),a("code",C,[t(`
        `),d("span",D,[t(`
          `),I,t(' "'+_(e.name)+`"
        `,1)]),t(`
        `),e.payload?(r(),a("span",V,[t(`
          `),B,t(" "+_(JSON.stringify(e.payload))+`
        `,1)])):i("",!0),t(`
      `)]))),256)),t(`
    `)])):i("",!0)])}const L=E(k,[["render",T],["__scopeId","data-v-d86f4662"]]);export{L as default};

import{r as n,i as g,k as c}from"./index-kHV-VyIh.js";/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),h=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,a,r)=>r?r.toUpperCase():a.toLowerCase()),u=t=>{const e=h(t);return e.charAt(0).toUpperCase()+e.slice(1)},d=(...t)=>t.filter((e,a,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===a).join(" ").trim(),q=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var y={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=n.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:a=2,absoluteStrokeWidth:r,className:s="",children:o,iconNode:i,...l},p)=>n.createElement("svg",{ref:p,...y,width:e,height:e,stroke:t,strokeWidth:r?Number(a)*24/Number(e):a,className:d("lucide",s),...!o&&!q(l)&&{"aria-hidden":"true"},...l},[...i.map(([f,m])=>n.createElement(f,m)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.536.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=(t,e)=>{const a=n.forwardRef(({className:r,...s},o)=>n.createElement(z,{ref:o,iconNode:e,className:d(`lucide-${w(u(t))}`,`lucide-${t}`,r),...s}));return a.displayName=u(t),a},$=g(t=>({loading:!1,questions:[],attempt:null,answerLoading:!1,startQuiz:async(e,a)=>{t({loading:!0});try{const r=await c.post(`/quiz/category/${e}/quizzes/${a}/start/`);return t({loading:!1,attempt:r.data}),r.data}catch(r){console.error("Failed to fetch quizzes:",r),t({loading:!1})}},fetchQuestions:async e=>{t({loading:!0});try{const a=await c.get(`/quiz/attempts/${e}/questions`);t({loading:!1,questions:a.data})}catch(a){console.error("Failed to fetch quizzes:",a),t({loading:!1})}},answerQuestion:async(e,a)=>{t({answerLoading:!0});try{const r=await c.post(`/quiz/attempts/${e}/answer`,a),s=r.data.updated_question;t(o=>({answerLoading:!1,attempt:r.data.updated_attempt,questions:o.questions.map(i=>i.id===s.id?s:i)}))}catch(r){console.error("Failed to fetch quizzes:",r),t({answerLoading:!1})}},fetchResult:async e=>{try{t({loading:!0});const a=await c.get(`/quiz/attempts/${e}/result`);t({attempt:a.data})}catch(a){throw console.error("Failed to fetch quizzes:",a),a}finally{t({loading:!1})}}}));export{L as c,$ as u};

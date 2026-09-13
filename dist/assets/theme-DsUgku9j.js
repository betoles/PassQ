(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(r){if(r.ep)return;r.ep=!0;const l=a(r);fetch(r.href,l)}})();const B={};class T{constructor(){this.supportedLanguages=["en","es","de","fr","it","pt","zh"],this.currentLanguage=this.detectLanguage(),this.cache={},this.loadedNamespaces=new Set(["common"]),this.listeners=[]}detectLanguage(){const e=localStorage.getItem("passq_lang");if(e&&this.supportedLanguages.includes(e))return e;const a=(navigator.language||"en").split("-")[0].toLowerCase();return this.supportedLanguages.includes(a)?a:"en"}async setLanguage(e){if(this.supportedLanguages.includes(e)){this.currentLanguage=e,localStorage.setItem("passq_lang",e),document.documentElement.lang=e,this.loadedNamespaces.size>0&&await this.loadNamespaces(Array.from(this.loadedNamespaces));for(const a of this.listeners)try{await a(e)}catch(n){console.warn("Error in language change listener:",n)}}}onLanguageChange(e){this.listeners.push(e)}async loadNamespaces(e=["common"]){const a=this.currentLanguage;this.cache[a]||(this.cache[a]={}),this.cache.en||(this.cache.en={});const n="./",r=n.endsWith("/")?n:n+"/";for(const l of e){if(this.loadedNamespaces.add(l),!this.cache[a][l])try{const i=await fetch(`${r}locales/${a}/${l}.json`);i.ok&&(this.cache[a][l]=await i.json())}catch{console.warn(`Could not load locales/${a}/${l}.json, falling back to English`)}if(a!=="en"&&!this.cache.en[l])try{const i=await fetch(`${r}locales/en/${l}.json`);i.ok&&(this.cache.en[l]=await i.json())}catch{console.error(`Could not load fallback locales/en/${l}.json`)}}}t(e,a=""){if(!e)return a;const[n,r]=e.includes(":")?e.split(":"):["common",e],l=this.currentLanguage;let i=this._getValue(this.cache[l]?.[n],r);return i!==void 0||(i=this._getValue(this.cache.en?.[n],r),i!==void 0)?i:a||r}_getValue(e,a){if(e)return a.split(".").reduce((n,r)=>n&&n[r],e)}translateDOM(){document.querySelectorAll("[data-i18n]").forEach(e=>{const a=e.getAttribute("data-i18n"),n=this.t(a);e.tagName==="INPUT"||e.tagName==="TEXTAREA"?e.placeholder=n:e.textContent=n}),document.querySelectorAll("[data-i18n-placeholder]").forEach(e=>{e.placeholder=this.t(e.getAttribute("data-i18n-placeholder"))}),document.querySelectorAll("[data-i18n-title]").forEach(e=>{e.title=this.t(e.getAttribute("data-i18n-title"))}),document.querySelectorAll("[data-i18n-aria-label]").forEach(e=>{e.setAttribute("aria-label",this.t(e.getAttribute("data-i18n-aria-label")))}),document.querySelectorAll("[data-i18n-html]").forEach(e=>{e.innerHTML=this.t(e.getAttribute("data-i18n-html"))})}}const s=new T,o={sun:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>`,moon:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>`,qrCode:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.008v.008H6.75V6.75ZM6.75 16.5h.008v.008H6.75V16.5ZM16.5 6.75h.008v.008H16.5V6.75ZM13.5 13.5h3.75m0 3.75h3.75m-3.75 3.75h3.75m-7.5-3.75h.008v.008h-.008v-.008Zm0 3.75h.008v.008h-.008v-.008Zm3.75-3.75h.008v.008h-.008v-.008Z" />
    </svg>`,camera:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>`,flashlight:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>`,image:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>`,close:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>`,shieldCheck:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>`,lockClosed:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>`,checkCircle:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>`,exclamationTriangle:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>`,wrench:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.398-3.085 1.22l-7.794 7.794a2.25 2.25 0 0 1-3.182-3.182l7.794-7.794c.822-.821 1.311-2.009 1.22-3.085A4.5 4.5 0 0 1 17.25 2.25a4.5 4.5 0 0 1 4.5 4.5Z" />
    </svg>`,recycle:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>`,leaf:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
    </svg>`,bolt:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>`,sparkles:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>`,download:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>`,trash:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>`,clipboard:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>`,printer:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
    </svg>`,arrowRight:(t="w-4 h-4")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>`,arrowLeft:(t="w-4 h-4")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>`,eye:(t="w-4 h-4")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>`,shoppingBag:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>`,star:(t="w-4 h-4")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
    </svg>`,mapPin:(t="w-4 h-4")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>`,tag:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>`,documentText:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>`,deviceMobile:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>`,rocket:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>`,scale:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0H7.5m4.5 0h4.5M3.75 7.5l4.5-2.25 4.5 2.25M3.75 7.5 2.25 13.5c0 1.243 1.343 2.25 3 2.25s3-1.007 3-2.25L6.75 7.5m5.25 0 4.5-2.25 4.5 2.25m-9 0L15.75 7.5m0 0-1.5 6c0 1.243 1.343 2.25 3 2.25s3-1.007 3-2.25l-1.5-6" />
    </svg>`,handshake:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m11 17 2 2a1 1 0 0 0 1.42 0l4.58-4.59a2 2 0 0 0 0-2.82l-1.17-1.18a2 2 0 0 0-2.83 0L13 12.4" />
      <path stroke-linecap="round" stroke-linejoin="round" d="m9 15 2 2" />
      <path stroke-linecap="round" stroke-linejoin="round" d="m7 13 2 2" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
      <path stroke-linecap="round" stroke-linejoin="round" d="m6 12 1.41-1.41a2 2 0 0 1 2.83 0l1.17 1.17a2 2 0 0 1 0 2.83L6.83 19.17a1 1 0 0 1-1.41 0L3.41 17.17a1 1 0 0 1 0-1.41L6 13.17" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M16 16v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-3" />
    </svg>`,cpuChip:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m1.5 7.5H3m5.25 5.25V21m7.5-18v1.5m3.75 5.25H21m-1.5 7.5H21m-5.25 5.25V21M6.75 6.75h10.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25V9a2.25 2.25 0 0 1 2.25-2.25Zm2.25 4.5h6v6h-6v-6Z" />
    </svg>`,mapPinSlash:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M10.22 5.08A6 6 0 0 1 18 10.5c0 2.518-1.748 5.405-3.86 7.82M8.47 8.47A5.968 5.968 0 0 0 6 10.5c0 4.75 6 10.5 6 10.5s1.25-1.198 2.57-2.82M13.5 10.5a1.5 1.5 0 0 1-1.5 1.5" />
    </svg>`,userSlash:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18M9.546 4.318A4.5 4.5 0 0 1 16.5 7.5c0 .878-.25 1.698-.684 2.39M6.828 6.828A4.5 4.5 0 0 0 7.5 12c.878 0 1.698-.25 2.39-.684m-4.636 7.434A7.47 7.47 0 0 1 3 18c0-3.314 3.134-6 7-6 .953 0 1.86.16 2.68.455M16.5 14.25c2.485.674 4.5 2.128 4.5 3.75" />
    </svg>`,cookie:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9.006 9.006 0 0 1 4.5 1.2c-.3 1.2.2 2.5 1.3 3.1 1.1.6 2.5.3 3.3-.6.6.9.9 2 .9 3.3a9 9 0 0 1-9 9Zm-3.5-9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm6 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-2-7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>`,globe:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m-9 9h18" />
    </svg>`,envelope:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>`,chatBubble:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>`,copy:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>`,bookOpen:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>`,folder:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>`,plusCircle:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>`,lightBulb:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.439v-2.25H8.25v2.25a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5Zm1.5-12.75a6.002 6.002 0 0 0-9.75 4.673c0 1.564.606 2.983 1.597 4.032.482.51.758 1.189.778 1.895h5.25c.02-.706.296-1.385.778-1.895A5.986 5.986 0 0 0 18.75 9.75Z" />
    </svg>`,tableCells:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6ZM3.75 10.5h16.5m-16.5 4.5h16.5M9 3.75v16.5m6-16.5v16.5" />
    </svg>`,devicePhoneMobile:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>`,googlePlay:(t="w-5 h-5")=>`
    <svg class="${t}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a2.023 2.023 0 0 1-.61-1.46V3.274c0-.568.226-1.096.61-1.46zM15.207 13.414l2.424 2.424-11.83 6.654 9.406-9.078zm0-2.828L5.801 1.508l11.83 6.654-2.424 2.424zm1.414 1.414l3.197 1.798c.956.538.956 1.42 0 1.958l-3.197 1.798-2.121-2.121 2.121-2.121z"/>
    </svg>`,paypal:(t="w-5 h-5")=>`
    <svg class="${t}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.792.792 0 0 1 .782-.662h6.74c3.35 0 5.86 1.48 5.485 5.093-.327 3.14-2.316 4.908-5.32 4.908H9.864l-1.396 7.493a.873.873 0 0 1-.861.785h-.531zM8.884 11.2h2.247c1.87 0 3.23-.74 3.468-2.67.247-2.02-.917-2.9-2.908-2.9H7.99l-1.36 8.52h1.464l.79-2.95z"/>
      <path d="M19.057 7.784c-.42 4.03-3.132 5.926-6.98 5.926H9.72l-1.12 6.008a.639.639 0 0 0 .63.754h3.765a.79.79 0 0 0 .781-.662l.032-.164.717-4.54.046-.252a.79.79 0 0 1 .781-.662h.493c3.004 0 5.358-1.22 6.046-4.73.287-1.46.126-2.674-.68-3.486-.33-.332-.71-.568-1.154-.732z" opacity="0.8"/>
    </svg>`,creditCard:(t="w-5 h-5")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6.75-12h18a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 20.25 18H3.75A2.25 2.25 0 0 1 1.5 15.75V6.75A2.25 2.25 0 0 1 3.75 4.5Z" />
    </svg>`,flag_es:(t="w-4 h-3 inline-block rounded-xs shadow-xs")=>`
    <svg class="${t}" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg"><path fill="#aa151b" d="M0 0h640v480H0z"/><path fill="#f1bf00" d="M0 120h640v240H0z"/></svg>`,flag_en:(t="w-4 h-3 inline-block rounded-xs shadow-xs")=>`
    <svg class="${t}" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg"><path fill="#012169" d="M0 0h640v480H0z"/><path stroke="#fff" stroke-width="60" d="m0 0 640 480M640 0 0 480"/><path stroke="#c8102e" stroke-width="36" d="m0 0 640 480M640 0 0 480"/><path fill="#fff" d="M260 0h120v480H260zM0 180h640v120H0z"/><path fill="#c8102e" d="M280 0h80v480H280zM0 200h640v80H0z"/></svg>`,flag_de:(t="w-4 h-3 inline-block rounded-xs shadow-xs")=>`
    <svg class="${t}" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M0 0h640v160H0z"/><path fill="#d00" d="M0 160h640v160H0z"/><path fill="#ffce00" d="M0 320h640v160H0z"/></svg>`,flag_fr:(t="w-4 h-3 inline-block rounded-xs shadow-xs")=>`
    <svg class="${t}" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg"><path fill="#002654" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce1126" d="M426.7 0H640v480H426.7z"/></svg>`,flag_it:(t="w-4 h-3 inline-block rounded-xs shadow-xs")=>`
    <svg class="${t}" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg"><path fill="#009246" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/></svg>`,flag_pt:(t="w-4 h-3 inline-block rounded-xs shadow-xs")=>`
    <svg class="${t}" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg"><path fill="#046a38" d="M0 0h256v480H0z"/><path fill="#da291c" d="M256 0h384v480H256z"/><circle cx="256" cy="240" r="70" fill="#ffcd00"/><circle cx="256" cy="240" r="44" fill="#fff"/></svg>`,flag_zh:(t="w-4 h-3 inline-block rounded-xs shadow-xs")=>`
    <svg class="${t}" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg"><path fill="#de2910" d="M0 0h640v480H0z"/><path fill="#ffde00" d="m100 80 18 55h58l-47 34 18 55-47-34-47 34 18-55-47-34h58z"/></svg>`};function I(t=document){t.querySelectorAll("[data-icon]").forEach(a=>{const n=a.getAttribute("data-icon"),r=a.getAttribute("data-icon-class")||"w-5 h-5 inline-block align-middle";o[n]&&(a.innerHTML=o[n](r))})}class H{constructor(){this.modalEl=null,this.isOpen=!1,this.activeTab="tab1",this.init()}init(){typeof document>"u"||(document.addEventListener("click",e=>{const a=e.target.closest("#btn-open-user-guide, [data-open-user-guide]");if(a){e.preventDefault();const n=a.getAttribute("data-guide-tab")||"tab1";this.open(n)}}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.close()}),s.onLanguageChange(async()=>{this.isOpen&&(await s.loadNamespaces(["common","guide"]),this.render())}))}async open(e="tab1"){this.activeTab=e,await s.loadNamespaces(["common","guide"]),this.isOpen=!0,this.render(),document.body.classList.add("overflow-hidden")}close(){this.isOpen=!1,this.modalEl&&(this.modalEl.classList.add("opacity-0","pointer-events-none"),setTimeout(()=>{!this.isOpen&&this.modalEl&&(this.modalEl.remove(),this.modalEl=null)},200)),document.body.classList.remove("overflow-hidden")}setTab(e){this.activeTab=e,this.render()}render(){let e=document.getElementById("passq-user-guide-modal-root");e||(e=document.createElement("div"),e.id="passq-user-guide-modal-root",document.body.appendChild(e)),this.modalEl=e;const a=s.t("guide:title","Guía de Usuario • PassQ"),n=s.t("guide:badge","Manual Interactivo & Didáctico"),r=s.t("guide:subtitle","Domina el ciclo de vida de tus Pasaportes Digitales en minutos."),l=s.t("guide:btn_close","Cerrar Guía"),i=[{id:"tab1",icon:"sparkles",label:s.t("guide:tabs.tab1","Caso Práctico")},{id:"tab2",icon:"plusCircle",label:s.t("guide:tabs.tab2","Crear Pasaporte")},{id:"tab3",icon:"folder",label:s.t("guide:tabs.tab3","Tu Catálogo & QR")},{id:"tab4",icon:"devicePhoneMobile",label:s.t("guide:tabs.tab4","Vista de Clientes")},{id:"tab5",icon:"shieldCheck",label:s.t("guide:tabs.tab5","Privacidad & Datos")}];e.className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md transition-opacity duration-200",e.innerHTML=`
      <!-- Backdrop click catcher -->
      <div id="user-guide-backdrop" class="absolute inset-0"></div>

      <!-- Main Modal Card -->
      <div class="relative w-full max-w-3xl max-h-[88vh] max-h-[88dvh] overflow-hidden rounded-3xl bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        <!-- Header Bar -->
        <div class="p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 flex items-start justify-between gap-4 shrink-0">
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold tracking-wide">
              <span class="w-4 h-4 flex items-center">${o.bookOpen?o.bookOpen("w-4 h-4"):""}</span>
              <span>${n}</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>${a}</span>
            </h2>
            <p class="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">${r}</p>
          </div>

          <button id="btn-close-guide-top" type="button" class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 flex items-center justify-center transition cursor-pointer shrink-0" aria-label="Cerrar">
            ${o.close?o.close("w-5 h-5"):"✕"}
          </button>
        </div>

        <!-- Navigation Tabs Bar -->
        <div class="px-5 sm:px-6 py-3 border-b border-slate-200/60 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] overflow-x-auto no-scrollbar shrink-0">
          <div class="flex items-center gap-2.5 min-w-max">
            ${i.map(c=>{const h=this.activeTab===c.id;return`
                <button type="button" data-tab-target="${c.id}" class="guide-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm sm:text-[15px] font-bold transition cursor-pointer select-none ${h?"bg-emerald-600 text-white shadow-md shadow-emerald-600/20":"bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10"}">
                  <span class="icon-svg w-4 h-4 shrink-0 ${h?"text-white":"text-emerald-500 dark:text-emerald-400"}">
                    ${o[c.icon]?o[c.icon]("w-4 h-4"):""}
                  </span>
                  <span>${c.label}</span>
                </button>
              `}).join("")}
          </div>
        </div>

        <!-- Scrollable Tab Content Area (min-h-0 enabled) -->
        <div class="p-5 sm:p-7 overflow-y-auto overscroll-contain space-y-5 text-slate-700 dark:text-slate-200 flex-1 min-h-0 text-justify">
          ${this.renderTabContent()}
        </div>

        <!-- Footer Actions Bar -->
        <div class="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/90 dark:bg-white/[0.02] flex items-center justify-between gap-3 shrink-0">
          <div class="flex items-center gap-2.5">
            <button id="btn-guide-prev" type="button" class="px-4 py-2.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
              ← ${s.t("buttons.back","Anterior")}
            </button>
            <button id="btn-guide-next" type="button" class="px-4 py-2.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
              ${s.t("buttons.next","Siguiente")} →
            </button>
          </div>

          <button id="btn-guide-close-bottom" type="button" class="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer">
            ${l}
          </button>
        </div>

      </div>
    `,e.querySelector("#user-guide-backdrop")?.addEventListener("click",()=>this.close()),e.querySelector("#btn-close-guide-top")?.addEventListener("click",()=>this.close()),e.querySelector("#btn-guide-close-bottom")?.addEventListener("click",()=>this.close()),e.querySelectorAll(".guide-tab-btn").forEach(c=>{c.addEventListener("click",()=>{const h=c.getAttribute("data-tab-target");h&&this.setTab(h)})});const d=i.findIndex(c=>c.id===this.activeTab),p=e.querySelector("#btn-guide-prev"),m=e.querySelector("#btn-guide-next");p&&(p.disabled=d<=0,p.addEventListener("click",()=>{d>0&&this.setTab(i[d-1].id)})),m&&(m.disabled=d>=i.length-1,m.addEventListener("click",()=>{d<i.length-1&&this.setTab(i[d+1].id)}))}renderTabContent(){switch(this.activeTab){case"tab1":return`
          <div class="space-y-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
              <h3 class="text-lg sm:text-xl font-black mb-2 flex items-start sm:items-center gap-2.5 leading-snug">
                <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${o.sparkles?o.sparkles("w-6 h-6"):"★"}</span>
                <span>${s.t("guide:tab1_content.title")}</span>
              </h3>
              <p class="text-sm sm:text-base leading-relaxed">${s.t("guide:tab1_content.intro")}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">1</span>
                  <span>${s.t("guide:tab1_content.step1_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${s.t("guide:tab1_content.step1_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">2</span>
                  <span>${s.t("guide:tab1_content.step2_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${s.t("guide:tab1_content.step2_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">3</span>
                  <span>${s.t("guide:tab1_content.step3_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${s.t("guide:tab1_content.step3_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">4</span>
                  <span>${s.t("guide:tab1_content.step4_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${s.t("guide:tab1_content.step4_desc")}</p>
              </div>
            </div>
          </div>
        `;case"tab2":return`
          <div class="space-y-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
              <h3 class="text-lg sm:text-xl font-black flex items-start sm:items-center gap-2.5 leading-snug">
                <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${o.plusCircle?o.plusCircle("w-6 h-6"):""}</span>
                <span>${s.t("guide:tab2_content.title")}</span>
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">1</span>
                  <span>${s.t("guide:tab2_content.step1_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${s.t("guide:tab2_content.step1_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">2</span>
                  <span>${s.t("guide:tab2_content.step2_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${s.t("guide:tab2_content.step2_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">3</span>
                  <span>${s.t("guide:tab2_content.step3_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${s.t("guide:tab2_content.step3_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">4</span>
                  <span>${s.t("guide:tab2_content.step4_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${s.t("guide:tab2_content.step4_desc")}</p>
              </div>
            </div>
          </div>
        `;case"tab3":return`
          <div class="space-y-4">
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-start sm:items-center gap-2.5 leading-snug">
              <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${o.folder?o.folder("w-6 h-6"):""}</span>
              <span>${s.t("guide:tab3_content.title")}</span>
            </h3>

            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-emerald-700 dark:text-emerald-400">${s.t("guide:tab3_content.catalog_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${s.t("guide:tab3_content.catalog_desc")}</p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
              <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white">${s.t("guide:tab3_content.actions_title")}</h4>
              <ul class="space-y-2.5 text-sm sm:text-base">
                <li class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-medium flex items-start sm:items-center gap-3">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    ${o.eye?o.eye("w-4 h-4"):""}
                  </span>
                  <span>${s.t("guide:tab3_content.action_view")}</span>
                </li>
                <li class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-medium flex items-start sm:items-center gap-3">
                  <span class="w-7 h-7 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    ${o.qrCode?o.qrCode("w-4 h-4"):""}
                  </span>
                  <span>${s.t("guide:tab3_content.action_qr")}</span>
                </li>
                <li class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-medium flex items-start sm:items-center gap-3">
                  <span class="w-7 h-7 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    ${o.trash?o.trash("w-4 h-4"):""}
                  </span>
                  <span>${s.t("guide:tab3_content.action_del")}</span>
                </li>
              </ul>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white">${s.t("guide:tab3_content.export_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${s.t("guide:tab3_content.export_desc")}</p>
            </div>
          </div>
        `;case"tab4":return`
          <div class="space-y-4">
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-start sm:items-center gap-2.5 leading-snug">
              <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${o.devicePhoneMobile?o.devicePhoneMobile("w-6 h-6"):""}</span>
              <span>${s.t("guide:tab4_content.title")}</span>
            </h3>

            <div class="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2 text-cyan-950 dark:text-cyan-200">
              <h4 class="font-black text-base sm:text-lg uppercase tracking-wide flex items-center gap-2.5">
                <span class="w-5 h-5 text-cyan-500">${o.userSlash?o.userSlash("w-5 h-5"):""}</span>
                <span>${s.t("guide:tab4_content.consumer_title")}</span>
              </h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${s.t("guide:tab4_content.consumer_desc")}</p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-emerald-950 dark:text-emerald-200">
              <h4 class="font-black text-base sm:text-lg uppercase tracking-wide flex items-center gap-2.5">
                <span class="w-5 h-5 text-emerald-500">${o.shieldCheck?o.shieldCheck("w-5 h-5"):""}</span>
                <span>${s.t("guide:tab4_content.customs_title")}</span>
              </h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${s.t("guide:tab4_content.customs_desc")}</p>
            </div>
          </div>
        `;case"tab5":return`
          <div class="space-y-4">
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-start sm:items-center gap-2.5 leading-snug">
              <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${o.shieldCheck?o.shieldCheck("w-6 h-6"):""}</span>
              <span>${s.t("guide:tab5_content.title")}</span>
            </h3>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-emerald-700 dark:text-emerald-400">${s.t("guide:tab5_content.local_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${s.t("guide:tab5_content.local_desc")}</p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white">${s.t("guide:tab5_content.backup_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${s.t("guide:tab5_content.backup_desc")}</p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-950 dark:text-rose-200 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-rose-700 dark:text-rose-400">${s.t("guide:tab5_content.wipe_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${s.t("guide:tab5_content.wipe_desc")}</p>
            </div>
          </div>
        `;default:return""}}}new H;const q="EQNTHLAVHUL52",k=[{id:"passq_starter_monthly",nameKey:"starter",name:"Starter Plan",price:"$19.99 USD",amount:"19.99",period:"/ mes",trialDays:7},{id:"passq_growth_monthly",nameKey:"growth",name:"Growth Plan",price:"$39.99 USD",amount:"39.99",period:"/ mes",recommended:!0,trialDays:7},{id:"passq_scale_monthly",nameKey:"scale",name:"Scale Plan",price:"$99.99 USD",amount:"99.99",period:"/ mes",trialDays:7}];class y{constructor(){}startTrial(){typeof window>"u"||localStorage.getItem("passq_trial_start")||localStorage.setItem("passq_trial_start",Date.now().toString())}getTrialStatus(){if(typeof window>"u")return{day:1,daysRemaining:7,isTrialActive:!0,isTrialStarted:!1,isSubscribed:!1};const e=localStorage.getItem("passq_play_subscription_active")==="true",a=localStorage.getItem("passq_play_subscription_plan")||"growth",n=localStorage.getItem("passq_trial_start");if(!n)return{day:0,daysRemaining:7,isTrialActive:!0,isTrialStarted:!1,isSubscribed:e,activePlan:a,isAccessGranted:!0};const r=Date.now()-parseInt(n,10),l=Math.min(7,Math.max(1,Math.floor(r/(1e3*60*60*24))+1)),i=Math.max(0,7-Math.floor(r/(1e3*60*60*24))),d=i>0;return{day:l,daysRemaining:i,isTrialActive:d,isTrialStarted:!0,isSubscribed:e,activePlan:a,isAccessGranted:d||e}}async launchGooglePlayPurchase(e="passq_growth_monthly"){if("getDigitalGoodsService"in window)try{const n=await window.getDigitalGoodsService("https://play.google.com/billing");if(n){const r=await n.getDetails([e]);if(r&&r.length>0){const l=[{supportedMethods:"https://play.google.com/billing",data:{sku:e}}];return await(await new PaymentRequest(l).show()).complete("success"),localStorage.setItem("passq_play_subscription_active","true"),localStorage.setItem("passq_play_subscription_plan",e),{success:!0,method:"digital_goods_api"}}}}catch(n){console.warn("Google Play Digital Goods API flow:",n)}return window.open("https://play.google.com/store/account/subscriptions","_blank","noopener,noreferrer"),{success:!0,method:"play_store_external"}}launchPayPalPurchase(e="passq_growth_monthly"){const a=k.find(m=>m.id===e)||k[1],r=(typeof window<"u"?window.location.href:"https://betoles.github.io/PassQ/").split("?")[0].split("#")[0],l=r.replace(/\/[^/]*$/,"/app.html?billing=paypal_success"),i=r.replace(/\/[^/]*$/,"/app.html?billing=paypal_cancel"),p=`https://www.paypal.com/cgi-bin/webscr?${new URLSearchParams({cmd:"_xclick-subscriptions",business:q,item_name:`PassQ DPP - ${a.name} ($${a.amount} USD/mo)`,item_number:a.id,no_shipping:"1",no_note:"1",currency_code:"USD",a3:a.amount,p3:"1",t3:"M",src:"1",sra:"1",return:l,cancel_return:i}).toString()}`;return window.open(p,"_blank","noopener,noreferrer"),{success:!0,method:"paypal_web",url:p}}}class Z{constructor(){this.modalEl=null,this.isOpen=!1,this.billing=new y,this.selectedPlan="passq_growth_monthly",this.init()}init(){typeof document>"u"||(document.addEventListener("click",e=>{const a=e.target.closest("#btn-open-subscription-modal, [data-open-subscription-modal]");if(a){e.preventDefault();const n=a.getAttribute("data-plan")||"passq_growth_monthly";this.open(n)}}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.close()}),s.onLanguageChange(async()=>{this.isOpen&&(await s.loadNamespaces(["common"]),this.render())}))}async open(e="passq_growth_monthly"){this.selectedPlan=e,await s.loadNamespaces(["common"]),this.isOpen=!0,this.render(),document.body.classList.add("overflow-hidden")}close(){this.isOpen=!1,this.modalEl&&(this.modalEl.classList.add("opacity-0","pointer-events-none"),setTimeout(()=>{!this.isOpen&&this.modalEl&&(this.modalEl.remove(),this.modalEl=null)},200)),document.body.classList.remove("overflow-hidden")}render(){let e=document.getElementById("passq-subscription-modal-root");e||(e=document.createElement("div"),e.id="passq-subscription-modal-root",document.body.appendChild(e)),this.modalEl=e;const a=this.billing.getTrialStatus(),n=s.t("common:billing.badge","Google Play & PayPal • 7 Días de Prueba Gratis"),r=s.t("common:billing.title","Suscripciones Oficiales PassQ"),l=s.t("common:billing.subtitle","Suscríbete con total seguridad a través de Google Play Store (móvil) o directamente con PayPal / Tarjeta de débito o crédito (web y computadoras)."),i=s.t("common:billing.trial_badge","7D"),d=s.t("common:billing.trial_status_active","Estado de Prueba Actual: Día {day} de 7 ({remaining} días restantes)"),p=s.t("common:billing.trial_status_ready","Prueba de 7 Días Disponible (Inicia con tu 1er pasaporte)"),m=s.t("common:billing.trial_status_ended","Prueba Concluida");let c=p,h=s.t("common:billing.trial_desc_ready","Tu prueba gratuita de 7 días se activará automáticamente cuando crees tu primer pasaporte digital.");a.isTrialStarted&&(a.isTrialActive?(c=d.replace("{day}",a.day).replace("{remaining}",a.daysRemaining),h=s.t("common:billing.trial_desc","Tienes acceso completo e ilimitado a todas las herramientas Pro. Al suscribirte ahora, no se te cobrará nada hasta terminar tus 7 días de prueba.")):(c=m,h=s.t("common:billing.trial_desc_ended","Tu periodo de prueba ha finalizado. Suscríbete para continuar emitiendo y gestionando pasaportes digitales.")));const v=s.t("common:billing.founder_rate","Tarifa Fundador"),f=s.t("common:billing.features.days_free","✓ 7 Días Gratis"),w=s.t("common:billing.features.play_billing","✓ Google Play / PayPal"),g=s.t("common:billing.guarantees_title","Garantías y Seguridad Oficial:"),b=s.t("common:billing.guarantee_1","Google Play Store: Facturación oficial respaldada por Google con comprobante fiscal."),$=s.t("common:billing.guarantee_2_prefix","PayPal Seguro: Protección al comprador. Paga con saldo PayPal o tarjeta de débito/crédito."),_=s.t("common:billing.guarantee_3","Cero almacenamiento de datos bancarios o tarjetas en servidores de PassQ."),M=s.t("common:billing.btn_subscribe_play_main","Google Play Store"),C=s.t("common:billing.btn_subscribe_play_sub","(App Android • 7 Días Gratis)"),L=s.t("common:billing.btn_subscribe_paypal_main","Pagar con PayPal / Tarjeta"),S=s.t("common:billing.btn_subscribe_paypal_sub","(Web & PC • Activación Inmediata)"),A=s.t("common:buttons.close","Cerrar");e.className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md transition-opacity duration-200",e.innerHTML=`
      <div id="subscription-modal-backdrop" class="absolute inset-0"></div>

      <div class="relative w-full max-w-2xl max-h-[88vh] max-h-[88dvh] overflow-y-auto overscroll-contain rounded-3xl bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200 dark:border-white/15 shadow-2xl p-5 sm:p-8 backdrop-blur-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-5">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-wide">
            <span class="w-4 h-4 flex items-center">${o.shieldCheck?o.shieldCheck("w-4 h-4"):"🛡️"}</span>
            <span>${n}</span>
          </div>

          <button id="btn-close-sub-modal" type="button" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 flex items-center justify-center transition cursor-pointer" aria-label="${A}">
            ${o.close?o.close("w-5 h-5"):"✕"}
          </button>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-1">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>${r}</span>
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            ${l}
          </p>
        </div>

        <!-- 7-Day Trial Highlight Banner -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-black shadow-md shadow-emerald-500/20">
            ${i}
          </div>
          <div class="text-xs sm:text-sm">
            <div class="font-extrabold text-slate-900 dark:text-white">${c}</div>
            <div class="text-slate-600 dark:text-slate-300 mt-0.5 font-medium">${h}</div>
          </div>
        </div>

        <!-- Plan Selection Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          ${k.map(u=>{const j=this.selectedPlan===u.id,P=s.t(`common:billing.plans.${u.nameKey}.name`,u.nameKey.toUpperCase()),E=s.t(`common:billing.plans.${u.nameKey}.limit`,"PassQ Pro");return`
              <div data-plan-select="${u.id}" class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative select-none ${j?"border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10":"border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20"}">
                ${u.recommended?`
                  <span class="absolute -top-2.5 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                    ${v}
                  </span>
                `:""}
                <div class="space-y-1.5">
                  <div class="text-xs font-black uppercase text-slate-500 dark:text-slate-400">${P}</div>
                  <div class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${u.price}</div>
                  <div class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">${E}</div>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 font-medium space-y-1">
                  <div>${f}</div>
                  <div>${w}</div>
                </div>
              </div>
            `}).join("")}
        </div>

        <!-- Guarantees & Trust -->
        <div class="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
          <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span class="w-4 h-4 text-emerald-500">${o.shieldCheck?o.shieldCheck("w-4 h-4"):"✓"}</span>
            <span>${g}</span>
          </div>
          <ul class="list-disc pl-5 space-y-1 leading-relaxed text-[11.5px]">
            <li>${b}</li>
            <li>${$}</li>
            <li>${_}</li>
          </ul>
        </div>

        <!-- Dual CTA Buttons (PayPal for Web/PC + Google Play for App/Mobile) -->
        <div class="flex flex-col sm:flex-row items-stretch gap-3 pt-1">
          
          <!-- PayPal / Card Button (Web & PC Primary) -->
          <button id="btn-confirm-paypal-subscribe" type="button" class="flex-1 min-h-[58px] py-3.5 px-4 rounded-2xl bg-[#0070ba] hover:bg-[#005ea6] text-white shadow-xl shadow-blue-600/25 transition active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer">
            <span class="w-6 h-6 flex items-center shrink-0 text-white">${o.paypal?o.paypal("w-6 h-6"):"🅿"}</span>
            <div class="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
              <span class="font-black text-sm sm:text-base tracking-tight">${L}</span>
              <span class="text-xs font-bold text-blue-100 opacity-95">${S}</span>
            </div>
          </button>

          <!-- Google Play Button (Mobile / TWA Primary) -->
          <button id="btn-confirm-play-subscribe" type="button" class="flex-1 min-h-[58px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/25 transition active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer">
            <span class="w-6 h-6 flex items-center shrink-0">${o.googlePlay?o.googlePlay("w-6 h-6"):"▶"}</span>
            <div class="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
              <span class="font-black text-sm sm:text-base tracking-tight">${M}</span>
              <span class="text-xs font-bold text-emerald-100 opacity-95">${C}</span>
            </div>
          </button>

        </div>

      </div>
    `,e.querySelector("#subscription-modal-backdrop")?.addEventListener("click",()=>this.close()),e.querySelector("#btn-close-sub-modal")?.addEventListener("click",()=>this.close()),e.querySelectorAll("[data-plan-select]").forEach(u=>{u.addEventListener("click",()=>{this.selectedPlan=u.getAttribute("data-plan-select"),this.render()})}),e.querySelector("#btn-confirm-paypal-subscribe")?.addEventListener("click",()=>{this.billing.launchPayPalPurchase(this.selectedPlan),this.close()}),e.querySelector("#btn-confirm-play-subscribe")?.addEventListener("click",async()=>{await this.billing.launchGooglePlayPurchase(this.selectedPlan),this.close()})}}const O=new y,N=new Z,x=[{code:"es",short:"ES",name:"Español"},{code:"en",short:"EN",name:"English"},{code:"de",short:"DE",name:"Deutsch"},{code:"fr",short:"FR",name:"Français"},{code:"it",short:"IT",name:"Italiano"},{code:"pt",short:"PT",name:"Português"},{code:"zh",short:"ZH",name:"中文"}];class D{constructor(e="#lang-select"){this.target=typeof e=="string"?document.querySelector(e):e,this.container=null,this.isOpen=!1,this.init()}init(){const e=document.getElementById("custom-lang-dropdown-wrapper");if(e){this.container=e,this.updateActiveState(s.currentLanguage);return}if(!this.target)return;const a=this.target.parentElement;!a||!a.parentElement||(this.container=document.createElement("div"),this.container.className="relative inline-block text-left z-50 shrink-0",this.container.id="custom-lang-dropdown-wrapper",a.parentElement.replaceChild(this.container,a),this.render(),this.setupListeners(),s.onLanguageChange(n=>{this.updateActiveState(n)}))}render(){const e=s.currentLanguage||"es",a=x.find(r=>r.code===e)||x[0],n=o[`flag_${a.code}`]?o[`flag_${a.code}`]("w-4 h-3 rounded-xs shadow-xs shrink-0"):"";this.container.innerHTML=`
      <!-- Encapsulated Trigger Button -->
      <button id="custom-lang-btn" type="button" class="h-10 sm:h-11 px-2.5 sm:px-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 active:scale-95 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2 transition cursor-pointer select-none shrink-0 whitespace-nowrap" aria-haspopup="true" aria-expanded="false">
        <span id="custom-lang-current-flag" class="flex items-center shrink-0">${n}</span>
        <span id="custom-lang-current-label" class="text-xs sm:text-sm font-bold uppercase tracking-wider">${a.short}</span>
        <span class="icon-svg w-3.5 h-3.5 text-slate-400 transition-transform duration-200" id="custom-lang-chevron">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
        </span>
      </button>

      <!-- Anchored Absolute Dropdown Menu (Anchored to right, expanding to left) -->
      <div id="custom-lang-menu" class="hidden opacity-0 scale-95 transition-all duration-150 ease-out absolute right-0 top-full mt-2 w-48 sm:w-52 p-1.5 rounded-2xl bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200/90 dark:border-white/15 shadow-2xl backdrop-blur-2xl z-[9999] origin-top-right">
        <div class="space-y-1" role="menu" aria-orientation="vertical">
          ${x.map(r=>{const l=r.code===e,i=o[`flag_${r.code}`]?o[`flag_${r.code}`]("w-4 h-3 rounded-xs shadow-xs shrink-0"):"";return`
              <button type="button" data-lang-code="${r.code}" class="lang-option-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer select-none ${l?"bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20":"text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"}">
                <div class="flex items-center gap-2.5">
                  <span class="flex items-center shrink-0">${i}</span>
                  <span>${r.name}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] font-mono uppercase font-bold text-slate-400 dark:text-slate-500">${r.short}</span>
                  ${l?`
                    <span class="icon-svg w-3.5 h-3.5 text-emerald-500">
                      <svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                    </span>
                  `:""}
                </div>
              </button>
            `}).join("")}
        </div>
      </div>
    `}setupListeners(){const e=this.container.querySelector("#custom-lang-btn"),a=this.container.querySelector("#custom-lang-menu");!e||!a||(e.addEventListener("click",n=>{n.stopPropagation(),this.toggleMenu()}),a.addEventListener("click",n=>{const r=n.target.closest(".lang-option-btn");if(!r)return;n.stopPropagation();const l=r.getAttribute("data-lang-code");l&&(s.setLanguage(l),this.closeMenu())}),document.addEventListener("click",n=>{this.isOpen&&!this.container.contains(n.target)&&this.closeMenu()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&this.isOpen&&this.closeMenu()}))}toggleMenu(){this.isOpen?this.closeMenu():this.openMenu()}openMenu(){const e=this.container?.querySelector("#custom-lang-menu"),a=this.container?.querySelector("#custom-lang-chevron"),n=this.container?.querySelector("#custom-lang-btn");if(!e)return;this.isOpen=!0,this.container&&(this.container.style.zIndex="9999");const r=this.container.closest("header")||this.container.closest(".glass-card");r&&(r.style.zIndex="999"),e.classList.remove("hidden"),n&&n.setAttribute("aria-expanded","true"),requestAnimationFrame(()=>{const l=e.getBoundingClientRect();l.left<8?(e.classList.remove("right-0","origin-top-right"),e.classList.add("left-0","origin-top-left")):l.right>window.innerWidth-8&&(e.classList.remove("left-0","origin-top-left"),e.classList.add("right-0","origin-top-right")),e.classList.remove("opacity-0","scale-95"),e.classList.add("opacity-100","scale-100"),a&&a.classList.add("rotate-180")})}closeMenu(){const e=this.container?.querySelector("#custom-lang-menu"),a=this.container?.querySelector("#custom-lang-chevron"),n=this.container?.querySelector("#custom-lang-btn");e&&(this.isOpen=!1,n&&n.setAttribute("aria-expanded","false"),e.classList.remove("opacity-100","scale-100"),e.classList.add("opacity-0","scale-95"),a&&a.classList.remove("rotate-180"),setTimeout(()=>{if(!this.isOpen){e.classList.add("hidden"),this.container&&(this.container.style.zIndex="");const r=this.container?.closest("header")||this.container?.closest(".glass-card");r&&(r.style.zIndex="")}},150))}updateActiveState(e){const a=x.find(i=>i.code===e)||x[0],n=this.container?.querySelector("#custom-lang-current-flag"),r=this.container?.querySelector("#custom-lang-current-label");n&&o[`flag_${a.code}`]&&(n.innerHTML=o[`flag_${a.code}`]("w-4 h-3 rounded-xs shadow-xs shrink-0")),r&&(r.textContent=a.short);const l=this.container?.querySelector("#custom-lang-menu > div");l&&(l.innerHTML=x.map(i=>{const d=i.code===e,p=o[`flag_${i.code}`]?o[`flag_${i.code}`]("w-4 h-3 rounded-xs shadow-xs shrink-0"):"";return`
          <button type="button" data-lang-code="${i.code}" class="lang-option-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer select-none ${d?"bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20":"text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"}">
            <div class="flex items-center gap-2.5">
              <span class="flex items-center shrink-0">${p}</span>
              <span>${i.name}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-mono uppercase font-bold text-slate-400 dark:text-slate-500">${i.short}</span>
              ${d?`
                <span class="icon-svg w-3.5 h-3.5 text-emerald-500">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                </span>
              `:""}
            </div>
          </button>
        `}).join(""))}}class z{constructor(){this.currentTheme=localStorage.getItem("passq_theme")||"dark",this.init()}init(){this.applyTheme(this.currentTheme),typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.updateIconSlots(),this.initLanguageDropdown()}):(this.updateIconSlots(),this.initLanguageDropdown())),typeof window<"u"&&"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(e=>{console.debug("ServiceWorker registration optional:",e)})}),window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener("change",e=>{localStorage.getItem("passq_theme")||this.applyTheme(e.matches?"dark":"light")})}initLanguageDropdown(e="#lang-select"){typeof document<"u"&&document.querySelector(e)&&new D(e)}updateIconSlots(){const e=document.documentElement.classList.contains("dark");document.querySelectorAll("#theme-icon-slot, [data-theme-icon]").forEach(n=>{n.innerHTML=e?o.sun("w-5 h-5"):o.moon("w-5 h-5")})}applyTheme(e){if(this.currentTheme=e,localStorage.setItem("passq_theme",e),e==="dark")document.documentElement.classList.add("dark");else if(e==="light")document.documentElement.classList.remove("dark");else{const a=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",a)}this.updateIconSlots()}toggleTheme(){const a=document.documentElement.classList.contains("dark")?"light":"dark";return this.applyTheme(a),a}}class V{constructor(){this.modalEl=null,this.isOpen=!1,this.init()}init(){typeof document>"u"||(document.addEventListener("click",e=>{e.target.closest("#btn-open-contact-modal, [data-open-contact-modal]")&&(e.preventDefault(),this.open())}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.close()}),s.onLanguageChange(()=>{this.isOpen&&this.render()}))}async open(){await s.loadNamespaces(["common"]),this.isOpen=!0,this.render(),document.body.classList.add("overflow-hidden")}close(){this.isOpen=!1,this.modalEl&&(this.modalEl.classList.add("opacity-0","pointer-events-none"),setTimeout(()=>{!this.isOpen&&this.modalEl&&(this.modalEl.remove(),this.modalEl=null)},200)),document.body.classList.remove("overflow-hidden")}render(){let e=document.getElementById("passq-contact-modal-root");e||(e=document.createElement("div"),e.id="passq-contact-modal-root",document.body.appendChild(e)),this.modalEl=e;const a=s.t("contact_modal.title","Contacto & Sugerencias"),n=s.t("contact_modal.badge","Escucha Activa del Usuario"),r=s.t("contact_modal.subtitle","¡Tu opinión impulsa la evolución continua de PassQ!"),l=s.t("contact_modal.message","Estamos en la mejor disposición de escuchar a los usuarios, aprender de tu experiencia y adaptar la plataforma a tus necesidades reales. Envíanos tus comentarios, dudas, sugerencias de mejora o solicitudes de funciones."),i=s.t("contact_modal.email_label","Canal Oficial de Contacto:"),d=s.t("contact_modal.email_address","passq-reportes@outlook.com"),p=s.t("contact_modal.btn_send_email","Enviar Correo Directo"),m=s.t("contact_modal.btn_copy_email","Copiar Dirección"),c=s.t("contact_modal.response_time","Respuesta habitual en menos de 72 horas hábiles."),h=encodeURIComponent(s.t("contact_modal.mail_subject","Comentarios y Sugerencias de Mejora • PassQ")),v=encodeURIComponent(s.t("contact_modal.mail_body",`Hola equipo de PassQ,

Me gustaría compartir los siguientes comentarios y sugerencias para adaptar la plataforma a mis necesidades:

`)),f=`mailto:${d}?subject=${h}&body=${v}`;e.className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-opacity duration-200",e.innerHTML=`
      <!-- Backdrop Click Catch -->
      <div id="contact-modal-backdrop" class="absolute inset-0"></div>

      <!-- Modal Card -->
      <div class="relative w-full max-w-xl max-h-[88vh] max-h-[88dvh] overflow-y-auto overscroll-contain rounded-3xl bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200 dark:border-white/15 shadow-2xl p-5 sm:p-8 backdrop-blur-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-5">
        
        <!-- Header / Close button -->
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide">
            <span class="w-4 h-4 flex items-center">${o.chatBubble?o.chatBubble("w-4 h-4"):""}</span>
            <span>${n}</span>
          </div>

          <button id="btn-close-contact-modal" type="button" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 flex items-center justify-center transition cursor-pointer" aria-label="Cerrar modal">
            ${o.close?o.close("w-5 h-5"):"✕"}
          </button>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-1.5">
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              ${o.envelope?o.envelope("w-5 h-5"):""}
            </span>
            <span>${a}</span>
          </h2>
          <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">${r}</p>
        </div>

        <!-- Friendly Narrative (Justified) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed text-justify">
          <p>${l}</p>
        </div>

        <!-- Official Email Card -->
        <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">${i}</div>
            <div id="contact-modal-email-val" class="text-base sm:text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 selection:bg-emerald-200 dark:selection:bg-emerald-800">${d}</div>
          </div>
          
          <button id="btn-copy-email-action" type="button" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 cursor-pointer">
            <span id="copy-icon-slot" class="w-4 h-4 flex items-center">${o.copy?o.copy("w-4 h-4"):""}</span>
            <span id="copy-text-slot">${m}</span>
          </button>
        </div>

        <!-- Action CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <a href="${f}" id="btn-send-mail-action" class="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition active:scale-[0.98] cursor-pointer">
            <span class="w-5 h-5 flex items-center">${o.envelope?o.envelope("w-5 h-5"):""}</span>
            <span>${p}</span>
          </a>

          <button id="btn-cancel-contact-modal" type="button" class="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base transition cursor-pointer">
            ${s.t("buttons.close","Cerrar")}
          </button>
        </div>

        <!-- Response guarantee footer note -->
        <div class="flex items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span class="w-3.5 h-3.5 text-emerald-500 shrink-0">${o.shieldCheck?o.shieldCheck("w-3.5 h-3.5"):"✓"}</span>
          <span>${c}</span>
        </div>

      </div>
    `,e.querySelector("#contact-modal-backdrop")?.addEventListener("click",()=>this.close()),e.querySelector("#btn-close-contact-modal")?.addEventListener("click",()=>this.close()),e.querySelector("#btn-cancel-contact-modal")?.addEventListener("click",()=>this.close());const w=e.querySelector("#btn-copy-email-action");w&&w.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(d);const g=e.querySelector("#copy-icon-slot"),b=e.querySelector("#copy-text-slot");g&&b&&(g.innerHTML=o.checkCircle?o.checkCircle("w-4 h-4 text-emerald-500"):"✓",b.textContent=s.t("contact_modal.email_copied","¡Copiado!"),setTimeout(()=>{g.innerHTML=o.copy?o.copy("w-4 h-4"):"",b.textContent=m},2500))}catch(g){console.warn("Clipboard write error:",g)}})}}new V;const G=new z;export{o as I,D as L,N as a,s as i,O as p,I as r,G as t};

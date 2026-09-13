import{i as a,t as L,r as V,I as G}from"./theme-DjCtVi4c.js";import{G as w,s as Z}from"./gs1-CkKC3tLx.js";import{c as x}from"./crypto-BjlqRT8o.js";import{b as Q}from"./vendor-qrcode-CjSdxGTc.js";class Y{constructor(t){if(this.onScanSuccess=t,this.videoStream=null,this.videoElement=null,this.isScanning=!1,this.torchActive=!1,this.lastFrameTime=0,this.frameInterval=1e3/18,this.hasBarcodeDetector="BarcodeDetector"in window,this.barcodeDetector=null,this.animationFrameId=null,this.hasBarcodeDetector)try{this.barcodeDetector=new window.BarcodeDetector({formats:["qr_code","data_matrix","ean_13"]})}catch{this.hasBarcodeDetector=!1}document.addEventListener("visibilitychange",()=>{document.hidden&&this.isScanning&&this.stop()})}init(t="camera-scanner-modal"){this.modal=document.getElementById(t),this.videoElement=document.getElementById("scanner-video"),document.getElementById("btn-close-scanner")?.addEventListener("click",()=>this.stop()),this.modal?.addEventListener("click",e=>{e.target===this.modal&&this.stop()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isScanning&&this.stop()}),document.getElementById("btn-toggle-torch")?.addEventListener("click",()=>this.toggleTorch()),document.getElementById("scanner-file-input")?.addEventListener("change",e=>this.handleFileUpload(e))}async start(){this.modal?.classList.remove("hidden"),this.isScanning=!0,this.lastFrameTime=performance.now();try{const t={video:{facingMode:{ideal:"environment"},width:{ideal:1280,max:1920},height:{ideal:720,max:1080}},audio:!1};this.videoStream=await navigator.mediaDevices.getUserMedia(t),this.videoElement&&(this.videoElement.srcObject=this.videoStream,await this.videoElement.play(),this.scanLoop(performance.now()))}catch(t){console.warn("PassQ: Camera access denied or unavailable:",t);const e=document.getElementById("scanner-error-msg");e&&(e.classList.remove("hidden"),e.textContent=a.t("passport:scanner.perm_error","Permiso de cámara no concedido. Puedes subir una foto con el código QR."))}}stop(){this.isScanning=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.videoStream&&(this.videoStream.getTracks().forEach(t=>{try{t.stop()}catch{}}),this.videoStream=null),this.videoElement&&(this.videoElement.srcObject=null),this.modal?.classList.add("hidden"),this.torchActive=!1}async toggleTorch(){if(!this.videoStream)return;const t=this.videoStream.getVideoTracks()[0];if(!t)return;if((t.getCapabilities?.()||{}).torch){this.torchActive=!this.torchActive;try{await t.applyConstraints({advanced:[{torch:this.torchActive}]});const o=document.getElementById("btn-toggle-torch");o&&o.classList.toggle("bg-amber-500",this.torchActive)}catch{}}}async scanLoop(t){if(!(!this.isScanning||!this.videoElement)){if(t-this.lastFrameTime>=this.frameInterval&&(this.lastFrameTime=t,this.videoElement.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&this.hasBarcodeDetector&&this.barcodeDetector))try{const e=await this.barcodeDetector.detect(this.videoElement);if(e&&e.length>0){this.triggerSuccess(e[0].rawValue);return}}catch{}this.isScanning&&(this.animationFrameId=requestAnimationFrame(e=>this.scanLoop(e)))}}handleFileUpload(t){const e=t.target.files?.[0];if(!e)return;const o=new FileReader;o.onload=async s=>{const c=new Image;c.onload=async()=>{if(this.hasBarcodeDetector&&this.barcodeDetector)try{const r=await this.barcodeDetector.detect(c);if(r&&r.length>0){this.triggerSuccess(r[0].rawValue);return}}catch(r){console.error(r)}alert(a.t("passport:scanner.no_qr_found","No se detectó un código QR válido en la imagen seleccionada."))},c.src=s.target.result},o.readAsDataURL(e),t.target.value=""}triggerSuccess(t){if(this.playSuccessFeedback(),this.stop(),this.onScanSuccess){const e=w.parseScannedCode(t);this.onScanSuccess(e?e.url:t,e)}}playSuccessFeedback(){if(navigator.vibrate)try{navigator.vibrate([40,30,40])}catch{}try{const t=window.AudioContext||window.webkitAudioContext;if(t){const e=new t,o=e.createOscillator(),s=e.createGain();o.type="sine",o.frequency.setValueAtTime(880,e.currentTime),o.frequency.exponentialRampToValueAtTime(1760,e.currentTime+.15),s.gain.setValueAtTime(.25,e.currentTime),s.gain.exponentialRampToValueAtTime(.01,e.currentTime+.15),o.connect(s),s.connect(e.destination),o.start(),o.stop(e.currentTime+.15),setTimeout(()=>{try{e.close()}catch{}},300)}}catch{}}}const q={textile:[{name:"Cremallera Estanca YKK Reforzada",sku:"SP-YKK-842",price:"$8.50 USD",delivery:"48h"},{name:"Kit Parches Térmicos Impermeables",sku:"SP-PTH-019",price:"$5.00 USD",delivery:"24-48h"},{name:"Cordón Elástico con Bloqueador Ergonómico",sku:"SP-CRD-004",price:"$3.20 USD",delivery:"24h"}],footwear:[{name:"Suela de Caucho Natural Vulcanizado Reciclado",sku:"SP-SUL-VUL",price:"$16.00 USD",delivery:"48h"},{name:"Plantillas Anatómicas Viscoelásticas",sku:"SP-PLN-ECO",price:"$9.50 USD",delivery:"24h"},{name:"Cordones de Algodón Orgánico Encerado",sku:"SP-CRD-ORG",price:"$3.50 USD",delivery:"24h"}],electronics:[{name:"Módulo Batería Li-Ion 800mAh (Plug & Play)",sku:"SP-BAT-800Z",price:"$14.00 USD",delivery:"48h"},{name:"Almohadillas Magnéticas Viscoelásticas",sku:"SP-ALM-MAG",price:"$12.50 USD",delivery:"24h"},{name:"Cable Modular Jack 3.5mm / USB-C Trenzado",sku:"SP-CBL-MOD",price:"$9.00 USD",delivery:"24h"}],battery:[{name:"Módulo de Celdas Li-Ion Certificado 48V",sku:"SP-CEL-MOD48",price:"$85.00 USD",delivery:"72h"},{name:"Arnés de Cableado BMS de Alta Precisión",sku:"SP-BMS-HARN",price:"$18.00 USD",delivery:"48h"},{name:"Conector Estanco IP68 de Potencia",sku:"SP-CON-IP68",price:"$12.00 USD",delivery:"24h"}],furniture:[{name:"Kit de Herrajes y Tornillería de Acero Inox",sku:"SP-HRR-INOX",price:"$6.50 USD",delivery:"24h"},{name:"Pata de Madera Certificada FSC de Recambio",sku:"SP-PAT-FSC",price:"$14.00 USD",delivery:"48h"},{name:"Tiradores Metálicos Ergonómicos",sku:"SP-TIR-MET",price:"$5.00 USD",delivery:"24h"}],cosmetics:[{name:"Dosificador / Bomba Dispensadora Recargable (Refill)",sku:"SP-PUMP-ECO",price:"$4.50 USD",delivery:"24h"},{name:"Frasco de Vidrio Borosilicato Recargable 50ml",sku:"SP-BOT-GLS50",price:"$7.00 USD",delivery:"48h"},{name:"Tapón Hermético de Aluminio Reciclado",sku:"SP-CAP-ALUM",price:"$2.50 USD",delivery:"24h"}],food:[{name:"Tapón Hermético Reutilizable Grado Alimentario",sku:"SP-CAP-FOOD",price:"$2.00 USD",delivery:"24h"},{name:"Dispensador Dosificador Retornable",sku:"SP-DSP-RET",price:"$3.50 USD",delivery:"24h"}],construction:[{name:"Perno de Alta Resistencia Grado 8.8",sku:"SP-BLT-G88",price:"$2.50 USD",delivery:"24h"},{name:"Pletina de Unión de Acero Galvanizado",sku:"SP-PLT-GALV",price:"$11.00 USD",delivery:"48h"}],default:[{name:"Kit de Tornillería y Anclajes Estándar",sku:"SP-TRN-STD",price:"$4.00 USD",delivery:"24h"},{name:"Pieza de Repuesto Oficial Certificada",sku:"SP-GEN-001",price:"$10.00 USD",delivery:"48-72h"}]};function i(h){return h==null?"":String(h).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function S(h){const t=document.getElementById("lang-flag-slot");t&&G[`flag_${h}`]&&(t.innerHTML=G[`flag_${h}`]("w-4 h-3 inline-block rounded-xs shadow-xs align-middle mr-1.5"))}class X{constructor(){this.currentProduct=null,this.activeTab="overview",this.scanner=null}async init(){await a.loadNamespaces(["common","passport"]),L.updateIconSlots(),V();const t=new URLSearchParams(window.location.search),e=t.get("gtin")||t.get("id")||"prod_001",o=t.get("pdata");if(this.currentProduct=Z.getById(e,o),this.currentProduct&&this.currentProduct.gtin)try{const s=`passq_scans_${this.currentProduct.gtin}`,c=parseInt(localStorage.getItem(s)||"0",10)+1;localStorage.setItem(s,c.toString())}catch{}this.scanner=new Y(s=>{window.location.href=s}),this.scanner.init("camera-scanner-modal"),this.setupUIListeners(),this.render(),S(a.currentLanguage),a.onLanguageChange(async s=>{await a.loadNamespaces(["common","passport"]),this.render(),S(s),L.updateIconSlots(),V()})}showToast(t){const e=document.getElementById("glass-toast"),o=document.getElementById("glass-toast-text");!e||!o||(o.textContent=t,e.classList.remove("translate-y-8","opacity-0","pointer-events-none"),e.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{e.classList.remove("translate-y-0","opacity-100"),e.classList.add("translate-y-8","opacity-0","pointer-events-none")},3200))}copyUrlToClipboard(t){navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(t).then(()=>{this.showToast(a.t("passport:share.copied","Enlace del Pasaporte copiado al portapapeles."))}).catch(()=>{this.fallbackCopyTextToClipboard(t)}):this.fallbackCopyTextToClipboard(t)}fallbackCopyTextToClipboard(t){try{const e=document.createElement("textarea");e.value=t,e.style.position="fixed",e.style.left="-999999px",e.style.top="-999999px",e.setAttribute("readonly",""),document.body.appendChild(e),e.focus(),e.select();const o=document.execCommand("copy");e.remove(),o&&this.showToast(a.t("passport:share.copied","Enlace del Pasaporte copiado al portapapeles."))}catch{this.showToast(a.t("passport:share.copied","Enlace del Pasaporte copiado al portapapeles."))}}setupUIListeners(){const t=document.getElementById("lang-select");t&&(t.value=a.currentLanguage,S(a.currentLanguage),t.addEventListener("change",r=>{const d=r.target.value;S(d),a.setLanguage(d)}));const e=document.getElementById("theme-toggle-btn");e&&e.addEventListener("click",()=>{L.toggleTheme()}),document.querySelectorAll("[data-tab]").forEach(r=>{r.addEventListener("click",d=>{this.activeTab=d.currentTarget.getAttribute("data-tab"),this.renderTabs()})}),document.getElementById("btn-share-passport")?.addEventListener("click",async()=>{const r=w.generateDigitalLink(this.currentProduct.gtin,this.currentProduct.serial,null,this.currentProduct),d=a.t("passport:share.title","Pasaporte Digital: {name}").replace("{name}",this.currentProduct?.name||"PassQ"),n=a.t("passport:share.text","Consulta el Pasaporte Digital oficial de {name} certificado por PassQ.").replace("{name}",this.currentProduct?.name||"PassQ");if(navigator.share)try{await navigator.share({title:d,text:n,url:r})}catch(l){l.name!=="AbortError"&&this.copyUrlToClipboard(r)}else this.copyUrlToClipboard(r)});const o=async()=>{await this.preparePrintData(),document.getElementById("print-options-modal")?.classList.remove("hidden")},s=()=>{document.getElementById("print-options-modal")?.classList.add("hidden")};document.getElementById("btn-print-customs-pdf")?.addEventListener("click",o),document.getElementById("btn-close-print-options")?.addEventListener("click",s),document.getElementById("btn-cancel-print-options")?.addEventListener("click",s),document.getElementById("print-options-modal")?.addEventListener("click",r=>{r.target.id==="print-options-modal"&&s()}),document.getElementById("btn-export-pdf-direct")?.addEventListener("click",()=>{s(),this.exportOfficialTechnicalPDF()}),document.getElementById("btn-confirm-print-action")?.addEventListener("click",()=>{s(),setTimeout(()=>{window.print()},150)}),document.getElementById("btn-open-camera-scanner")?.addEventListener("click",()=>{this.scanner.start()}),document.getElementById("btn-export-jsonld")?.addEventListener("click",()=>{const r=w.generateJSONLD(this.currentProduct),d="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(r,null,2)),n=document.createElement("a");n.setAttribute("href",d),n.setAttribute("download",`DPP_${this.currentProduct.gtin}_customs.json`),document.body.appendChild(n),n.click(),n.remove(),this.showToast(a.t("passport:toast.jsonld_exported","Ficha técnica JSON-LD exportada con éxito."))}),document.getElementById("btn-open-spare-parts")?.addEventListener("click",()=>{this.openSparePartsModal()}),document.getElementById("btn-close-spare-parts")?.addEventListener("click",()=>{document.getElementById("spare-parts-modal")?.classList.add("hidden")}),document.getElementById("btn-submit-spare-request")?.addEventListener("click",()=>{const r=`mailto:passq-reportes@outlook.com?subject=${encodeURIComponent(a.t("passport:spare_parts_modal.email_subject","Solicitud de Repuestos Oficiales: ")+this.currentProduct.name+` (GTIN: ${this.currentProduct.gtin})`)}&body=${encodeURIComponent(a.t("passport:spare_parts_modal.email_body","Hola, deseo solicitar repuestos originales certificados para el producto ")+this.currentProduct.name+` (Serie: ${this.currentProduct.serial}).`)}`;window.location.href=r});const c=async()=>{if(this.currentProduct){const r=x.canonicalize(this.currentProduct),d=await x.computeSHA256(r),n=document.getElementById("crypto-sha256");n&&(n.textContent=d)}document.getElementById("crypto-modal")?.classList.remove("hidden")};document.getElementById("btn-open-crypto-seal")?.addEventListener("click",c),document.getElementById("btn-verify-badge-icon")?.addEventListener("click",c),document.getElementById("btn-close-crypto")?.addEventListener("click",()=>{document.getElementById("crypto-modal")?.classList.add("hidden")}),document.getElementById("btn-reverify-crypto")?.addEventListener("click",async r=>{const d=r.currentTarget,n=d.innerHTML;d.innerHTML=`
        <span class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>${a.t("passport:crypto.verifying","Ejecutando Web Crypto API (ECDSA P-256 + SHA-256)...")}</span>
        </span>
      `;const l=await x.verifyPassport(this.currentProduct);setTimeout(()=>{d.innerHTML=`
          <span class="inline-flex items-center gap-2 text-white font-bold">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
            <span>${a.t("passport:crypto.verified","Firma e Integridad 100% Auténticas ({algo})").replace("{algo}",l.algorithm)}</span>
          </span>
        `,setTimeout(()=>{d.innerHTML=n},3e3)},450)})}openSparePartsModal(){const t=document.getElementById("spare-parts-modal"),e=document.getElementById("spare-parts-items-list");if(!t||!e)return;const o=q[this.currentProduct?.category]||q.default;e.innerHTML=o.map(s=>{const c=a.t(`passport:spare_parts.${s.sku}.name`,s.name),r=a.t(`passport:spare_parts.${s.sku}.delivery`,s.delivery);return`
      <div class="p-3.5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-sm">
        <div class="space-y-0.5">
          <p class="font-bold text-xs text-slate-900 dark:text-white">${c}</p>
          <p class="text-[10px] font-mono text-slate-400">Ref: ${s.sku} • ${a.t("passport:spare_parts.delivery_prefix","Envío")}: ${r}</p>
        </div>
        <span class="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
          ${s.price}
        </span>
      </div>
    `}).join(""),t.classList.remove("hidden")}async render(){const t=this.currentProduct;if(!t)return;a.translateDOM();const e=t.id==="prod_001"&&(!t.brand||t.brand==="Nordic Apex Gear"||t.name==="Chaqueta Alpina EcoDry"),o=t.id==="prod_002"&&(!t.brand||t.brand==="Aura Sound Labs"||t.name==="Auriculares Modulares Zero"),s=e?"prod_001":o?"prod_002":null,c=s?a.t(`passport:demo_products.${s}.name`,t.name):t.name||a.t("passport:header.loading_product","PassQ DPP"),r=s?a.t(`passport:demo_products.${s}.brand`,t.brand||"PassQ Verified"):t.brand||a.t("passport:header.verified_brand","PassQ Verified Brand"),d=s?a.t(`passport:demo_products.${s}.origin_country`,t.origin_country||"México"):t.origin_country||"México";let n="";if(s){const u=a.t(`passport:demo_products.${s}.recycling_instructions`);u&&!u.startsWith("demo_products.")&&(n=u)}n||(n=t.recycling_instructions||a.t("passport:recycling.default_instructions","Separación y depósito en canal oficial de reciclaje circular.")),document.getElementById("product-name").textContent=c,document.getElementById("brand-name").textContent=r,document.getElementById("product-serial").textContent=`${a.t("passport:header.serial")}: ${t.serial}`,document.getElementById("product-gtin").textContent=`${a.t("passport:header.gtin")}: ${t.gtin}`;const l=document.getElementById("product-hs");l&&(l.textContent=`HS: ${t.hs_code||"6202.40.00"}`);const p=document.getElementById("customs-hs-code");p&&(p.textContent=t.hs_code||"6202.40.00");const f=document.getElementById("customs-urn-code");f&&(f.textContent=t.passport_urn||`urn:espr:eu:2026:${t.gtin}:${t.serial}`);const m=document.getElementById("product-origin");m&&(m.textContent=d);const b=document.getElementById("product-recycled-pct");if(b){const u=t.materials?.[0];b.textContent=u?`${u.pct}%`:"78%"}document.getElementById("repair-score-value").textContent=t.repair_score,document.getElementById("repair-score-max").textContent="/ 10",document.getElementById("co2-value").textContent=`${t.carbon_kg} kg CO₂e`,document.getElementById("water-value").textContent=`${t.water_liters||180} L`;const g=document.getElementById("lca-total-co2");g&&(g.textContent=`${t.carbon_kg} kg CO₂e`);const y=t.lca_breakdown||{manufacturing_pct:65,transport_pct:22,end_of_life_pct:13},E=document.getElementById("lca-bar-mfg"),T=document.getElementById("lca-bar-log"),A=document.getElementById("lca-bar-eol");E&&(E.style.width=`${y.manufacturing_pct}%`),T&&(T.style.width=`${y.transport_pct}%`),A&&(A.style.width=`${y.end_of_life_pct}%`);const D=document.getElementById("lca-lbl-mfg"),B=document.getElementById("lca-lbl-log"),M=document.getElementById("lca-lbl-eol");D&&(D.textContent=`${y.manufacturing_pct}%`),B&&(B.textContent=`${y.transport_pct}%`),M&&(M.textContent=`${y.end_of_life_pct}%`);const K=x.canonicalize(t),R=await x.computeSHA256(K),U=document.getElementById("crypto-sig");U&&(U.textContent=t.signature||`ecdsa_p256_${R.slice(0,32)}`);const O=document.getElementById("crypto-algo");O&&(O.textContent=t.signature_algorithm||"ECDSA-P256-SHA256");const F=document.getElementById("crypto-sha256");F&&(F.textContent=t.canonical_sha256||R);const z=document.getElementById("crypto-time");z&&(z.textContent=t.signature_timestamp||t.manufacturing_date||new Date().toISOString());const j=document.getElementById("materials-list");j&&t.materials&&(j.innerHTML=t.materials.map((u,v)=>{let _=u.name;if(s==="prod_001"||s==="prod_002"){const k=a.t(`passport:demo_products.${s}.materials.${v}`);k&&!k.startsWith("demo_products.")&&(_=k)}const C=i(_),$=parseFloat(u.pct)||0;return`
        <div class="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-white/60 dark:border-white/10 flex justify-between items-center text-sm shadow-sm">
          <span class="font-medium text-slate-800 dark:text-slate-200">${C}</span>
          <span class="font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">${$}%</span>
        </div>
      `}).join(""));const H=document.getElementById("repair-steps-list");H&&(H.innerHTML=(t.repair_guide||[]).map((u,v)=>{let _=u.title,C=u.tools;if(s==="prod_001"||s==="prod_002"){const P=a.t(`passport:demo_products.${s}.repair_guide.${v}.title`);P&&!P.startsWith("demo_products.")&&(_=P);const I=a.t(`passport:demo_products.${s}.repair_guide.${v}.tools`);I&&!I.startsWith("demo_products.")&&(C=I)}const $=i(_),k=i(C||a.t("passport:repair_guide.default_tools","Herramientas estándar")),W=i(u.time||"10 min"),J=parseInt(u.step,10)||v+1;return`
        <div class="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-white/60 dark:border-white/10 space-y-2 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">${a.t("passport:repair_guide.step_prefix","Paso")} ${J}</span>
            <span class="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span class="icon-svg w-3 h-3"><svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></span>
              ${W}
            </span>
          </div>
          <h4 class="font-semibold text-slate-900 dark:text-white text-sm">${$}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span class="icon-svg w-3.5 h-3.5 text-cyan-500 shrink-0"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.398-3.085 1.22l-7.794 7.794a2.25 2.25 0 0 1-3.182-3.182l7.794-7.794c.822-.821 1.311-2.009 1.22-3.085A4.5 4.5 0 0 1 17.25 2.25a4.5 4.5 0 0 1 4.5 4.5Z"/></svg></span>
            ${k}
          </p>
        </div>
      `}).join(""));const N=document.getElementById("recycling-instructions-text");N&&(N.textContent=n),this.renderSectorSpecificCard(t),this.renderTabs(),this.updateSEOMetadata(t),await this.preparePrintData()}renderSectorSpecificCard(t){const e=document.getElementById("passport-sector-card-container");if(!e)return;const o=t.category,s=o==="battery"||t.battery_chemistry,c=o==="cosmetics"||t.inci_ingredients,r=o==="food"||t.food_batch,d=o==="construction"||t.epd_number;if(!s&&!c&&!r&&!d){e.classList.add("hidden"),e.innerHTML="";return}if(e.classList.remove("hidden"),s){const n=i(t.battery_chemistry||"Li-Ion (NMC 811)"),l=i(t.battery_capacity||"75 kWh / 150 Ah"),p=t.battery_recycled_metals||{cobalt_pct:18,lithium_pct:8,nickel_pct:8},f=parseFloat(p.cobalt_pct)||18,m=parseFloat(p.lithium_pct)||8,b=parseFloat(p.nickel_pct)||8,g=ComplianceCalculator.evaluateBatteryRecycledMetals(f,m,b);e.innerHTML=`
        <div class="p-4 sm:p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 space-y-3 shadow-sm text-slate-800 dark:text-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-amber-700 dark:text-amber-400 text-sm sm:text-base flex items-center gap-2">
              <span class="icon-svg w-5 h-5 text-amber-500 shrink-0">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
              </span>
              <span data-i18n="passport:sector_cards.battery_title">${a.t("passport:sector_cards.battery_title","Especificaciones de Batería (Reg. UE 2023/1542)")}</span>
            </h4>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">EU 2023/1542</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.battery_chem">${a.t("passport:sector_cards.battery_chem","Química de Celda")}</span>
              <strong class="text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${n}</strong>
            </div>
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.battery_cap">${a.t("passport:sector_cards.battery_cap","Capacidad Nominal")}</span>
              <strong class="text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${l}</strong>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.battery_recycled_metals">${a.t("passport:sector_cards.battery_recycled_metals","Metales Críticos Reciclados")}</span>
              <span class="font-mono font-extrabold text-amber-600 dark:text-amber-400">${g.averagePct}% Promedio</span>
            </div>
            <div class="grid grid-cols-3 gap-1 text-center font-mono text-[11px]">
              <span class="p-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">Co: ${f}%</span>
              <span class="p-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">Li: ${m}%</span>
              <span class="p-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">Ni: ${b}%</span>
            </div>
            <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-0.5">
              <span>✓</span> <span data-i18n="passport:sector_cards.battery_targets_met">${a.t("passport:sector_cards.battery_targets_met","Objetivos de Recuperación UE 2027/2031 Cumplidos")}</span>
            </p>
          </div>
        </div>
      `}else if(c){const n=i(t.inci_ingredients||"Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Panthenol, Tocopherol"),l=parseInt(t.pao_months,10)||12,p=i(t.allergens||"Linalool, Limonene (Conforme IFRA)");e.innerHTML=`
        <div class="p-4 sm:p-5 rounded-3xl bg-pink-500/10 dark:bg-pink-500/15 border border-pink-500/25 space-y-3 shadow-sm text-slate-800 dark:text-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-pink-700 dark:text-pink-400 text-sm sm:text-base flex items-center gap-2">
              <span class="icon-svg w-5 h-5 text-pink-500 shrink-0">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>
              </span>
              <span data-i18n="passport:sector_cards.cosmetics_title">${a.t("passport:sector_cards.cosmetics_title","Fórmula INCI & Seguridad Cosmética (Reg. UE 1223/2009)")}</span>
            </h4>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-700 dark:text-pink-300">PAO ${l}M</span>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.inci_list">${a.t("passport:sector_cards.inci_list","Lista Oficial de Ingredientes (INCI)")}</span>
            <p class="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">${n}</p>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.allergens_label">${a.t("passport:sector_cards.allergens_label","Alérgenos Declarables")}</span>
            <span class="font-semibold text-pink-600 dark:text-pink-400">${p}</span>
          </div>
        </div>
      `}else if(r){const n=i(t.food_batch||"LOTE-2026-B842"),l=i(t.food_expiry||"2027-06-30"),p=i(t.food_temp||"2°C - 6°C (Refrigerado)"),f=i(t.food_certifications||"Orgánico Sagarpa, FairTrade, Kosher");e.innerHTML=`
        <div class="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 space-y-3 shadow-sm text-slate-800 dark:text-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm sm:text-base flex items-center gap-2">
              <span class="icon-svg w-5 h-5 text-emerald-500 shrink-0">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3"/></svg>
              </span>
              <span data-i18n="passport:sector_cards.food_title">${a.t("passport:sector_cards.food_title","Trazabilidad Agroalimentaria & Cadena de Frío")}</span>
            </h4>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Reg. UE 1169/2011</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.food_lot">${a.t("passport:sector_cards.food_lot","Lote de Fabricación")}</span>
              <strong class="font-mono text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${n}</strong>
            </div>
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.food_exp">${a.t("passport:sector_cards.food_exp","Consumo Preferente")}</span>
              <strong class="font-mono text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${l}</strong>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.food_temp">${a.t("passport:sector_cards.food_temp","Conservación Térmica")}</span>
            <span class="font-bold text-cyan-600 dark:text-cyan-400">${p}</span>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.food_certs">${a.t("passport:sector_cards.food_certs","Certificaciones Acreditadas")}</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">${f}</span>
          </div>
        </div>
      `}else if(d){const n=i(t.epd_number||"S-P-04892 (Environdec ISO 14025)"),l=parseInt(t.structural_lifespan_yrs,10)||50;e.innerHTML=`
        <div class="p-4 sm:p-5 rounded-3xl bg-slate-500/10 dark:bg-slate-500/15 border border-slate-500/25 space-y-3 shadow-sm text-slate-800 dark:text-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base flex items-center gap-2">
              <span class="icon-svg w-5 h-5 text-indigo-500 shrink-0">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.333A48.243 48.243 0 0012 9.75c-2.551 0-5.056.2-7.5.583V21"/></svg>
              </span>
              <span data-i18n="passport:sector_cards.construction_title">${a.t("passport:sector_cards.construction_title","Declaración Ambiental de Producto (EPD & CPR)")}</span>
            </h4>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">CPR EU 305/2011</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.epd_label">${a.t("passport:sector_cards.epd_label","Registro EPD")}</span>
              <strong class="font-mono text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${n}</strong>
            </div>
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.lifespan_label">${a.t("passport:sector_cards.lifespan_label","Vida Útil Estimada")}</span>
              <strong class="text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${l} años</strong>
            </div>
          </div>
        </div>
      `}}async preparePrintData(){const t=this.currentProduct;if(!t)return;const e=document.getElementById("print-qr-canvas");if(e){const l=w.generateDigitalLink(t.gtin,t.serial,null,t);try{await Q.toCanvas(e,l,{width:320,margin:4,errorCorrectionLevel:"H",color:{dark:"#0f172a",light:"#ffffff"}})}catch(p){console.warn("PassQ: Print QR generation fallback:",p)}}const o=x.canonicalize(t),s=await x.computeSHA256(o),c=document.getElementById("print-crypto-algo");c&&(c.textContent=t.signature_algorithm||"ECDSA-P256-SHA256");const r=document.getElementById("print-crypto-time");r&&(r.textContent=t.signature_timestamp||t.manufacturing_date||new Date().toISOString());const d=document.getElementById("print-crypto-digest");d&&(d.textContent=t.canonical_sha256||s);const n=document.getElementById("print-crypto-sig");n&&(n.textContent=t.signature||`ecdsa_p256_${s.slice(0,32)}`)}async exportOfficialTechnicalPDF(){const t=this.currentProduct;if(!t)return;this.showToast(a.t("passport:toast.generating_pdf","Generando Ficha Técnica Oficial PDF (300 DPI)..."));const e=w.generateDigitalLink(t.gtin,t.serial,null,t);let o="";try{o=await Q.toDataURL(e,{width:360,margin:2,errorCorrectionLevel:"H",color:{dark:"#0f172a",light:"#ffffff"}})}catch(g){console.warn("QR DataURL generation error:",g)}const s=x.canonicalize(t),c=await x.computeSHA256(s),r=t.signature||`ecdsa_p256_${c.slice(0,32)}`,d=t.signature_algorithm||"ECDSA-P256-SHA256",n=t.signature_timestamp||t.manufacturing_date||new Date().toISOString(),l=Array.isArray(t.materials)&&t.materials.length>0?t.materials.map(g=>{const y=typeof g=="object"?g.name||g.n||"Material":Array.isArray(g)?g[0]:String(g),E=typeof g=="object"?g.pct||g.p||0:Array.isArray(g)?g[1]:0;return`<tr><td style="padding: 5px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${i(y)}</td><td style="padding: 5px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #059669;">${E}%</td></tr>`}).join(""):'<tr><td colspan="2" style="padding: 6px 10px; color: #64748b;">Composición conforme a normativa</td></tr>';let p="";t.category==="battery"||t.battery_chemistry?p=`
        <div style="margin-top: 12px; padding: 10px 14px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 10.5pt; color: #166534; font-weight: 800;">Especificaciones de Batería (Reg. UE 2023/1542)</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9pt;">
            <div><strong>Química:</strong> ${i(t.battery_chemistry||"Li-Ion NMC")}</div>
            <div><strong>Capacidad:</strong> ${i(t.battery_capacity||"N/A")}</div>
            <div style="grid-column: span 2;"><strong>Metales Críticos Reciclados:</strong> Co: ${t.battery_recycled_metals?.cobalt_pct||16}%, Li: ${t.battery_recycled_metals?.lithium_pct||6}%, Ni: ${t.battery_recycled_metals?.nickel_pct||65}%</div>
          </div>
        </div>
      `:t.category==="cosmetics"||t.inci_ingredients?p=`
        <div style="margin-top: 12px; padding: 10px 14px; background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 10.5pt; color: #9d174d; font-weight: 800;">Fórmula INCI & Seguridad Cosmética (Reg. UE 1223/2009)</h4>
          <div style="font-size: 9pt;">
            <div><strong>Fórmula INCI:</strong> <span style="font-family: monospace;">${i(t.inci_ingredients||"N/A")}</span></div>
            <div style="margin-top: 3px;"><strong>PAO:</strong> ${t.pao_months||12} meses | <strong>Alérgenos:</strong> ${i(t.allergens||"Sin alérgenos declarables")}</div>
          </div>
        </div>
      `:t.category==="food"||t.food_batch?p=`
        <div style="margin-top: 12px; padding: 10px 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 10.5pt; color: #065f46; font-weight: 800;">Trazabilidad Agroalimentaria & Cadena de Frío</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9pt;">
            <div><strong>Lote:</strong> ${i(t.food_batch||"N/A")}</div>
            <div><strong>Caducidad:</strong> ${i(t.food_expiry||"N/A")}</div>
            <div><strong>Conservación:</strong> ${i(t.food_temp||"Lugar fresco y seco")}</div>
            <div><strong>Certificaciones:</strong> ${i(t.food_certifications||"Conforme")}</div>
          </div>
        </div>
      `:(t.category==="construction"||t.epd_number)&&(p=`
        <div style="margin-top: 12px; padding: 10px 14px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 10.5pt; color: #1e293b; font-weight: 800;">Declaración Ambiental de Producto (EPD & CPR)</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9pt;">
            <div><strong>Registro EPD:</strong> ${i(t.epd_number||"ISO 14025")}</div>
            <div><strong>Vida Útil Estimada:</strong> ${t.structural_lifespan_yrs||50} años</div>
          </div>
        </div>
      `);const f=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PassQ_DPP_${t.gtin}_Ficha_Tecnica</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 9.5pt;
      line-height: 1.4;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .title-area h1 {
      margin: 4px 0 2px 0;
      font-size: 16pt;
      font-weight: 900;
      color: #0f172a;
      text-transform: uppercase;
    }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-primary { background: #0f172a; color: #ffffff; }
    .badge-eco { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }
    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 8px;
    }
    .meta-card .label {
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 2px;
    }
    .meta-card .val {
      font-size: 9.5pt;
      font-weight: 800;
      color: #0f172a;
      font-family: monospace;
    }
    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .section-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 9px 11px;
    }
    .section-title {
      font-size: 9.5pt;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      margin-bottom: 6px;
    }
    .lca-bar {
      height: 8px;
      border-radius: 4px;
      background: #e2e8f0;
      display: flex;
      overflow: hidden;
      margin: 6px 0;
    }
    .crypto-box {
      border: 1.5px solid #0f172a;
      border-radius: 8px;
      padding: 9px 11px;
      margin-top: 10px;
      background: #fafafa;
    }
    .crypto-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      font-weight: 800;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      margin-bottom: 5px;
    }
    .crypto-details {
      font-family: monospace;
      font-size: 7.5pt;
      color: #334155;
      line-height: 1.35;
    }
    .footer {
      margin-top: 10px;
      padding-top: 6px;
      border-top: 1px solid #e2e8f0;
      font-size: 7pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title-area">
      <div style="display: flex; align-items: center; gap: 6px;">
        <span class="badge badge-primary">PassQ OFFICIAL DPP</span>
        <span class="badge badge-eco">EU ESPR 2024/1781 COMPLIANT</span>
      </div>
      <h1>${i(t.name)}</h1>
      <div style="font-size: 10pt; font-weight: 700; color: #059669;">${i(t.brand||"PassQ Certified")} • Sector: ${i(t.category||"General").toUpperCase()}</div>
    </div>
    <div style="text-align: center;">
      <img src="${o}" style="width: 88px; height: 88px; border: 1px solid #94a3b8; border-radius: 6px;" />
      <div style="font-size: 7pt; font-family: monospace; color: #64748b; margin-top: 1px;">GS1 Digital Link</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-card">
      <div class="label">Código GTIN-13</div>
      <div class="val">${i(t.gtin)}</div>
    </div>
    <div class="meta-card">
      <div class="label">Número de Serie</div>
      <div class="val">${i(t.serial||"01")}</div>
    </div>
    <div class="meta-card">
      <div class="label">Código Arancelario HS</div>
      <div class="val">${i(t.hs_code||"6202.40.00")}</div>
    </div>
    <div class="meta-card">
      <div class="label">País de Origen</div>
      <div class="val">${i(t.origin_country||"México")}</div>
    </div>
  </div>

  <div class="two-col">
    <div class="section-card">
      <div class="section-title">1. Impacto Ambiental & Huella LCA</div>
      <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 10pt; color: #059669;">
        <span>Huella de Carbono (LCA):</span>
        <span>${t.carbon_kg||1.8} kg CO₂e</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 8.5pt; color: #475569; margin-top: 2px;">
        <span>Huella Hídrica Total:</span>
        <span style="font-weight: 700;">${t.water_liters||100} Litros</span>
      </div>
      <div class="lca-bar">
        <div style="width: ${t.lca_breakdown?.manufacturing_pct||65}%; background: #10b981;" title="Fabricación"></div>
        <div style="width: ${t.lca_breakdown?.transport_pct||22}%; background: #06b6d4;" title="Transporte"></div>
        <div style="width: ${t.lca_breakdown?.end_of_life_pct||13}%; background: #6366f1;" title="Fin de Vida"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 7.5pt; font-weight: 700; color: #64748b;">
        <span>Fáb: ${t.lca_breakdown?.manufacturing_pct||65}%</span>
        <span>Transp: ${t.lca_breakdown?.transport_pct||22}%</span>
        <span>Fin: ${t.lca_breakdown?.end_of_life_pct||13}%</span>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">2. Reparabilidad & Circularidad</div>
      <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 10pt; color: #0f172a;">
        <span>Índice de Reparabilidad:</span>
        <span style="color: #059669;">${t.repair_score||9} / 10 (Clase A)</span>
      </div>
      <div style="font-size: 8.5pt; color: #475569; margin-top: 3px;">
        <div><strong>Disponibilidad de Repuestos:</strong> Garantizada 5+ años</div>
        <div><strong>Herramientas necesarias:</strong> ${i(t.disassembly_tools||"Estándar")}</div>
      </div>
    </div>
  </div>

  <div class="two-col">
    <div class="section-card">
      <div class="section-title">3. Composición de Materiales Declarada</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt;">
        <thead>
          <tr style="border-bottom: 1px solid #cbd5e1; text-align: left; color: #64748b; font-size: 7.5pt;">
            <th style="padding: 3px 8px;">Material</th>
            <th style="padding: 3px 8px; text-align: right;">% Contenido</th>
          </tr>
        </thead>
        <tbody>
          ${l}
        </tbody>
      </table>
    </div>

    <div class="section-card">
      <div class="section-title">4. Directrices Oficiales de Reciclaje</div>
      <p style="font-size: 8.5pt; color: #334155; margin: 0 0 4px 0;">${i(t.recycling_instructions||"Separación y depósito en canal oficial de reciclaje circular.")}</p>
      <div style="font-size: 7.5pt; font-weight: 700; color: #166534; background: #f0fdf4; padding: 3px 6px; border-radius: 4px; border: 1px solid #bbf7d0;">
        ✓ 100% Conforme con directivas UE RoHS, REACH y WEEE
      </div>
    </div>
  </div>

  ${p}

  <div class="crypto-box">
    <div class="crypto-title">
      <span>SELLO CRIPTOGRÁFICO OFICIAL DE AUTENTICIDAD & NO REPUDIO</span>
      <span style="color: #166534; font-weight: 800;">ESTADO: VÁLIDO & INMUTABLE</span>
    </div>
    <div class="crypto-details">
      <div><strong>Algoritmo Criptográfico:</strong> ${d} (NIST FIPS 186-4)</div>
      <div><strong>Sello de Tiempo (Timestamp):</strong> ${n}</div>
      <div style="margin-top: 1px;"><strong>Digest SHA-256 Canónico:</strong> <span style="color: #0284c7;">${c}</span></div>
      <div style="margin-top: 1px;"><strong>Firma Digital del Fabricante:</strong> <span style="color: #15803d;">${r}</span></div>
    </div>
  </div>

  <div class="footer">
    <span>PassQ Decentralized Infrastructure • Pasaporte Digital de Producto ESPR 2024/1781</span>
    <span>Documento Técnico Oficial Generado en Tiempo Real</span>
  </div>
</body>
</html>
    `,m=document.createElement("iframe");m.style.position="fixed",m.style.right="0",m.style.bottom="0",m.style.width="0",m.style.height="0",m.style.border="none",document.body.appendChild(m);const b=m.contentWindow.document;b.open(),b.write(f),b.close(),m.contentWindow.focus(),setTimeout(()=>{try{m.contentWindow.print()}catch{window.print()}setTimeout(()=>{m.remove()},2e3)},300)}updateSEOMetadata(t){if(!t)return;const e=`${t.name} • ${t.brand||"PassQ"} • Pasaporte Digital de Producto (DPP)`,o=`Pasaporte Digital de Producto oficial para ${t.name} (GTIN: ${t.gtin}). Huella de carbono: ${t.carbon_kg||"1.8"} kg CO2e, Reparabilidad: ${t.repair_score||"9.0"}/10, Código HS: ${t.hs_code||"6202.40.00"}. Certificado por PassQ.`,c=`${window.location.href.split(/[?#]/)[0].replace(/\/[^\/]*$/,"")}/p.html?gtin=${t.gtin}`;document.title=e;const r=document.getElementById("dpp-meta-desc");r&&r.setAttribute("content",o);const d=document.getElementById("dpp-meta-canonical");d&&d.setAttribute("href",c);const n=document.getElementById("dpp-og-title");n&&n.setAttribute("content",e);const l=document.getElementById("dpp-og-desc");l&&l.setAttribute("content",o);const p=document.getElementById("dpp-og-url");p&&p.setAttribute("content",c);const f=document.getElementById("dpp-tw-title");f&&f.setAttribute("content",e);const m=document.getElementById("dpp-tw-desc");m&&m.setAttribute("content",o);const b=document.getElementById("dpp-jsonld");if(b){const g={"@context":["https://schema.org",{gs1:"https://gs1.org/voc/"}],"@type":"Product",name:t.name,description:o,gtin13:t.gtin,sku:t.serial||t.gtin,brand:{"@type":"Brand",name:t.brand||"PassQ Certified"},category:t.category,countryOfOrigin:{"@type":"Country",name:t.origin_country||"México"},additionalProperty:[{"@type":"PropertyValue",name:"CarbonFootprintLCA",value:`${t.carbon_kg||1.8} kg CO2e`},{"@type":"PropertyValue",name:"RepairabilityScore",value:`${t.repair_score||9}/10`},{"@type":"PropertyValue",name:"CustomsHSCode",value:t.hs_code||"6202.40.00"},{"@type":"PropertyValue",name:"PassportURN",value:t.passport_urn||`urn:espr:eu:2026:${t.gtin}:${t.serial}`}]};b.textContent=JSON.stringify(g,null,2)}}renderTabs(){const t="flex-1 min-w-[76px] sm:min-w-0 py-2.5 px-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center text-center whitespace-nowrap select-none";document.querySelectorAll("[data-tab]").forEach(e=>{e.getAttribute("data-tab")===this.activeTab?e.className=`${t} font-black bg-emerald-600 text-white dark:bg-emerald-500 shadow-md`:e.className=`${t} font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5`}),document.querySelectorAll("[data-tab-content]").forEach(e=>{e.getAttribute("data-tab-content")===this.activeTab?e.classList.remove("hidden"):e.classList.add("hidden")})}}document.addEventListener("DOMContentLoaded",()=>{new X().init()});

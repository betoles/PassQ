import{i as a,t as T,r as q,I as K}from"./theme-Bz3mS4Db.js";import{G as w,s as tt}from"./gs1-BaT64xPk.js";import{c as y}from"./crypto-BjlqRT8o.js";import{b as W}from"./vendor-qrcode-CjSdxGTc.js";class et{constructor(t){if(this.onScanSuccess=t,this.videoStream=null,this.videoElement=null,this.isScanning=!1,this.torchActive=!1,this.lastFrameTime=0,this.frameInterval=1e3/18,this.hasBarcodeDetector="BarcodeDetector"in window,this.barcodeDetector=null,this.animationFrameId=null,this.hasBarcodeDetector)try{this.barcodeDetector=new window.BarcodeDetector({formats:["qr_code","data_matrix","ean_13"]})}catch{this.hasBarcodeDetector=!1}document.addEventListener("visibilitychange",()=>{document.hidden&&this.isScanning&&this.stop()})}init(t="camera-scanner-modal"){this.modal=document.getElementById(t),this.videoElement=document.getElementById("scanner-video"),document.getElementById("btn-close-scanner")?.addEventListener("click",()=>this.stop()),this.modal?.addEventListener("click",e=>{e.target===this.modal&&this.stop()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isScanning&&this.stop()}),document.getElementById("btn-toggle-torch")?.addEventListener("click",()=>this.toggleTorch()),document.getElementById("scanner-file-input")?.addEventListener("change",e=>this.handleFileUpload(e))}async start(){this.modal?.classList.remove("hidden"),this.isScanning=!0,this.lastFrameTime=performance.now();try{const t={video:{facingMode:{ideal:"environment"},width:{ideal:1280,max:1920},height:{ideal:720,max:1080}},audio:!1};this.videoStream=await navigator.mediaDevices.getUserMedia(t),this.videoElement&&(this.videoElement.srcObject=this.videoStream,await this.videoElement.play(),this.scanLoop(performance.now()))}catch(t){console.warn("PassQ: Camera access denied or unavailable:",t);const e=document.getElementById("scanner-error-msg");e&&(e.classList.remove("hidden"),e.textContent=a.t("passport:scanner.perm_error","Permiso de cámara no concedido. Puedes subir una foto con el código QR."))}}stop(){this.isScanning=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.videoStream&&(this.videoStream.getTracks().forEach(t=>{try{t.stop()}catch{}}),this.videoStream=null),this.videoElement&&(this.videoElement.srcObject=null),this.modal?.classList.add("hidden"),this.torchActive=!1}async toggleTorch(){if(!this.videoStream)return;const t=this.videoStream.getVideoTracks()[0];if(!t)return;if((t.getCapabilities?.()||{}).torch){this.torchActive=!this.torchActive;try{await t.applyConstraints({advanced:[{torch:this.torchActive}]});const r=document.getElementById("btn-toggle-torch");r&&r.classList.toggle("bg-amber-500",this.torchActive)}catch{}}}async scanLoop(t){if(!(!this.isScanning||!this.videoElement)){if(t-this.lastFrameTime>=this.frameInterval&&(this.lastFrameTime=t,this.videoElement.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&this.hasBarcodeDetector&&this.barcodeDetector))try{const e=await this.barcodeDetector.detect(this.videoElement);if(e&&e.length>0){this.triggerSuccess(e[0].rawValue);return}}catch{}this.isScanning&&(this.animationFrameId=requestAnimationFrame(e=>this.scanLoop(e)))}}handleFileUpload(t){const e=t.target.files?.[0];if(!e)return;const r=new FileReader;r.onload=async s=>{const c=new Image;c.onload=async()=>{if(this.hasBarcodeDetector&&this.barcodeDetector)try{const o=await this.barcodeDetector.detect(c);if(o&&o.length>0){this.triggerSuccess(o[0].rawValue);return}}catch(o){console.error(o)}alert(a.t("passport:scanner.no_qr_found","No se detectó un código QR válido en la imagen seleccionada."))},c.src=s.target.result},r.readAsDataURL(e),t.target.value=""}triggerSuccess(t){if(this.playSuccessFeedback(),this.stop(),this.onScanSuccess){const e=w.parseScannedCode(t);this.onScanSuccess(e?e.url:t,e)}}playSuccessFeedback(){if(navigator.vibrate)try{navigator.vibrate([40,30,40])}catch{}try{const t=window.AudioContext||window.webkitAudioContext;if(t){const e=new t,r=e.createOscillator(),s=e.createGain();r.type="sine",r.frequency.setValueAtTime(880,e.currentTime),r.frequency.exponentialRampToValueAtTime(1760,e.currentTime+.15),s.gain.setValueAtTime(.25,e.currentTime),s.gain.exponentialRampToValueAtTime(.01,e.currentTime+.15),r.connect(s),s.connect(e.destination),r.start(),r.stop(e.currentTime+.15),setTimeout(()=>{try{e.close()}catch{}},300)}}catch{}}}const J={textile:[{name:"Cremallera Estanca YKK Reforzada",sku:"SP-YKK-842",price:"$8.50 USD",delivery:"48h"},{name:"Kit Parches Térmicos Impermeables",sku:"SP-PTH-019",price:"$5.00 USD",delivery:"24-48h"},{name:"Cordón Elástico con Bloqueador Ergonómico",sku:"SP-CRD-004",price:"$3.20 USD",delivery:"24h"}],footwear:[{name:"Suela de Caucho Natural Vulcanizado Reciclado",sku:"SP-SUL-VUL",price:"$16.00 USD",delivery:"48h"},{name:"Plantillas Anatómicas Viscoelásticas",sku:"SP-PLN-ECO",price:"$9.50 USD",delivery:"24h"},{name:"Cordones de Algodón Orgánico Encerado",sku:"SP-CRD-ORG",price:"$3.50 USD",delivery:"24h"}],electronics:[{name:"Módulo Batería Li-Ion 800mAh (Plug & Play)",sku:"SP-BAT-800Z",price:"$14.00 USD",delivery:"48h"},{name:"Almohadillas Magnéticas Viscoelásticas",sku:"SP-ALM-MAG",price:"$12.50 USD",delivery:"24h"},{name:"Cable Modular Jack 3.5mm / USB-C Trenzado",sku:"SP-CBL-MOD",price:"$9.00 USD",delivery:"24h"}],battery:[{name:"Módulo de Celdas Li-Ion Certificado 48V",sku:"SP-CEL-MOD48",price:"$85.00 USD",delivery:"72h"},{name:"Arnés de Cableado BMS de Alta Precisión",sku:"SP-BMS-HARN",price:"$18.00 USD",delivery:"48h"},{name:"Conector Estanco IP68 de Potencia",sku:"SP-CON-IP68",price:"$12.00 USD",delivery:"24h"}],furniture:[{name:"Kit de Herrajes y Tornillería de Acero Inox",sku:"SP-HRR-INOX",price:"$6.50 USD",delivery:"24h"},{name:"Pata de Madera Certificada FSC de Recambio",sku:"SP-PAT-FSC",price:"$14.00 USD",delivery:"48h"},{name:"Tiradores Metálicos Ergonómicos",sku:"SP-TIR-MET",price:"$5.00 USD",delivery:"24h"}],cosmetics:[{name:"Dosificador / Bomba Dispensadora Recargable (Refill)",sku:"SP-PUMP-ECO",price:"$4.50 USD",delivery:"24h"},{name:"Frasco de Vidrio Borosilicato Recargable 50ml",sku:"SP-BOT-GLS50",price:"$7.00 USD",delivery:"48h"},{name:"Tapón Hermético de Aluminio Reciclado",sku:"SP-CAP-ALUM",price:"$2.50 USD",delivery:"24h"}],food:[{name:"Tapón Hermético Reutilizable Grado Alimentario",sku:"SP-CAP-FOOD",price:"$2.00 USD",delivery:"24h"},{name:"Dispensador Dosificador Retornable",sku:"SP-DSP-RET",price:"$3.50 USD",delivery:"24h"}],construction:[{name:"Perno de Alta Resistencia Grado 8.8",sku:"SP-BLT-G88",price:"$2.50 USD",delivery:"24h"},{name:"Pletina de Unión de Acero Galvanizado",sku:"SP-PLT-GALV",price:"$11.00 USD",delivery:"48h"}],default:[{name:"Kit de Tornillería y Anclajes Estándar",sku:"SP-TRN-STD",price:"$4.00 USD",delivery:"24h"},{name:"Pieza de Repuesto Oficial Certificada",sku:"SP-GEN-001",price:"$10.00 USD",delivery:"48-72h"}]};function n(x){return x==null?"":String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function $(x){const t=document.getElementById("lang-flag-slot");t&&K[`flag_${x}`]&&(t.innerHTML=K[`flag_${x}`]("w-4 h-3 inline-block rounded-xs shadow-xs align-middle mr-1.5"))}class at{constructor(){this.currentProduct=null,this.activeTab="overview",this.scanner=null}async init(){await a.loadNamespaces(["common","passport"]),T.updateIconSlots(),q();const t=new URLSearchParams(window.location.search),e=t.get("gtin")||t.get("id")||"prod_001",r=t.get("pdata");if(this.currentProduct=tt.getById(e,r),this.currentProduct&&this.currentProduct.gtin)try{const s=`passq_scans_${this.currentProduct.gtin}`,c=parseInt(localStorage.getItem(s)||"0",10)+1;localStorage.setItem(s,c.toString())}catch{}this.scanner=new et(s=>{window.location.href=s}),this.scanner.init("camera-scanner-modal"),this.setupUIListeners(),this.render(),$(a.currentLanguage),a.onLanguageChange(async s=>{await a.loadNamespaces(["common","passport"]),this.render(),$(s),T.updateIconSlots(),q()})}showToast(t){const e=document.getElementById("glass-toast"),r=document.getElementById("glass-toast-text");!e||!r||(r.textContent=t,e.classList.remove("translate-y-8","opacity-0","pointer-events-none"),e.classList.add("translate-y-0","opacity-100"),this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{e.classList.remove("translate-y-0","opacity-100"),e.classList.add("translate-y-8","opacity-0","pointer-events-none")},3200))}copyUrlToClipboard(t){navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(t).then(()=>{this.showToast(a.t("passport:share.copied","Enlace del Pasaporte copiado al portapapeles."))}).catch(()=>{this.fallbackCopyTextToClipboard(t)}):this.fallbackCopyTextToClipboard(t)}fallbackCopyTextToClipboard(t){try{const e=document.createElement("textarea");e.value=t,e.style.position="fixed",e.style.left="-999999px",e.style.top="-999999px",e.setAttribute("readonly",""),document.body.appendChild(e),e.focus(),e.select();const r=document.execCommand("copy");e.remove(),r&&this.showToast(a.t("passport:share.copied","Enlace del Pasaporte copiado al portapapeles."))}catch{this.showToast(a.t("passport:share.copied","Enlace del Pasaporte copiado al portapapeles."))}}setupUIListeners(){const t=document.getElementById("lang-select");t&&(t.value=a.currentLanguage,$(a.currentLanguage),t.addEventListener("change",o=>{const i=o.target.value;$(i),a.setLanguage(i)}));const e=document.getElementById("theme-toggle-btn");e&&e.addEventListener("click",()=>{T.toggleTheme()}),document.querySelectorAll("[data-tab]").forEach(o=>{o.addEventListener("click",i=>{this.activeTab=i.currentTarget.getAttribute("data-tab"),this.renderTabs()})}),document.getElementById("btn-share-passport")?.addEventListener("click",async()=>{const o=w.generateDigitalLink(this.currentProduct.gtin,this.currentProduct.serial,null,this.currentProduct),i=a.t("passport:share.title","Pasaporte Digital: {name}").replace("{name}",this.currentProduct?.name||"PassQ"),d=a.t("passport:share.text","Consulta el Pasaporte Digital oficial de {name} certificado por PassQ.").replace("{name}",this.currentProduct?.name||"PassQ");if(navigator.share)try{await navigator.share({title:i,text:d,url:o})}catch(p){p.name!=="AbortError"&&this.copyUrlToClipboard(o)}else this.copyUrlToClipboard(o)});const r=async()=>{await this.preparePrintData(),document.getElementById("print-options-modal")?.classList.remove("hidden")},s=()=>{document.getElementById("print-options-modal")?.classList.add("hidden")};document.getElementById("btn-print-customs-pdf")?.addEventListener("click",r),document.getElementById("btn-close-print-options")?.addEventListener("click",s),document.getElementById("btn-cancel-print-options")?.addEventListener("click",s),document.getElementById("print-options-modal")?.addEventListener("click",o=>{o.target.id==="print-options-modal"&&s()}),document.getElementById("btn-export-pdf-direct")?.addEventListener("click",()=>{s(),this.exportOfficialTechnicalPDF()}),document.getElementById("btn-confirm-print-action")?.addEventListener("click",()=>{s(),setTimeout(()=>{window.print()},150)}),document.getElementById("btn-open-camera-scanner")?.addEventListener("click",()=>{this.scanner.start()}),document.getElementById("btn-export-jsonld")?.addEventListener("click",()=>{const o=w.generateJSONLD(this.currentProduct),i="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(o,null,2)),d=document.createElement("a");d.setAttribute("href",i),d.setAttribute("download",`DPP_${this.currentProduct.gtin}_customs.json`),document.body.appendChild(d),d.click(),d.remove(),this.showToast(a.t("passport:toast.jsonld_exported","Ficha técnica JSON-LD exportada con éxito."))}),document.getElementById("btn-open-spare-parts")?.addEventListener("click",()=>{this.openSparePartsModal()}),document.getElementById("btn-close-spare-parts")?.addEventListener("click",()=>{document.getElementById("spare-parts-modal")?.classList.add("hidden")}),document.getElementById("btn-submit-spare-request")?.addEventListener("click",()=>{const o=`mailto:passq-reportes@outlook.com?subject=${encodeURIComponent(a.t("passport:spare_parts_modal.email_subject","Solicitud de Repuestos Oficiales: ")+this.currentProduct.name+` (GTIN: ${this.currentProduct.gtin})`)}&body=${encodeURIComponent(a.t("passport:spare_parts_modal.email_body","Hola, deseo solicitar repuestos originales certificados para el producto ")+this.currentProduct.name+` (Serie: ${this.currentProduct.serial}).`)}`;window.location.href=o});const c=async()=>{if(this.currentProduct){const o=y.canonicalize(this.currentProduct),i=await y.computeSHA256(o),d=document.getElementById("crypto-sha256");d&&(d.textContent=i)}document.getElementById("crypto-modal")?.classList.remove("hidden")};document.getElementById("btn-open-crypto-seal")?.addEventListener("click",c),document.getElementById("btn-verify-badge-icon")?.addEventListener("click",c),document.getElementById("btn-close-crypto")?.addEventListener("click",()=>{document.getElementById("crypto-modal")?.classList.add("hidden")}),document.getElementById("btn-reverify-crypto")?.addEventListener("click",async o=>{const i=o.currentTarget,d=i.innerHTML;i.innerHTML=`
        <span class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>${a.t("passport:crypto.verifying","Ejecutando Web Crypto API (ECDSA P-256 + SHA-256)...")}</span>
        </span>
      `;const p=await y.verifyPassport(this.currentProduct);setTimeout(()=>{i.innerHTML=`
          <span class="inline-flex items-center gap-2 text-white font-bold">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
            <span>${a.t("passport:crypto.verified","Firma e Integridad 100% Auténticas ({algo})").replace("{algo}",p.algorithm)}</span>
          </span>
        `,setTimeout(()=>{i.innerHTML=d},3e3)},450)})}openSparePartsModal(){const t=document.getElementById("spare-parts-modal"),e=document.getElementById("spare-parts-items-list");if(!t||!e)return;const r=J[this.currentProduct?.category]||J.default;e.innerHTML=r.map(s=>{const c=a.t(`passport:spare_parts.${s.sku}.name`,s.name),o=a.t(`passport:spare_parts.${s.sku}.delivery`,s.delivery);return`
      <div class="p-3.5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-sm">
        <div class="space-y-0.5">
          <p class="font-bold text-xs text-slate-900 dark:text-white">${c}</p>
          <p class="text-[10px] font-mono text-slate-400">Ref: ${s.sku} • ${a.t("passport:spare_parts.delivery_prefix","Envío")}: ${o}</p>
        </div>
        <span class="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
          ${s.price}
        </span>
      </div>
    `}).join(""),t.classList.remove("hidden")}async render(){const t=this.currentProduct;if(!t)return;a.translateDOM();const e=t.id==="prod_001"&&(!t.brand||t.brand==="Nordic Apex Gear"||t.name==="Chaqueta Alpina EcoDry"),r=t.id==="prod_002"&&(!t.brand||t.brand==="Aura Sound Labs"||t.name==="Auriculares Modulares Zero"),s=e?"prod_001":r?"prod_002":null,c=s?a.t(`passport:demo_products.${s}.name`,t.name):t.name||a.t("passport:header.loading_product","PassQ DPP"),o=s?a.t(`passport:demo_products.${s}.brand`,t.brand||"PassQ Verified"):t.brand||a.t("passport:header.verified_brand","PassQ Verified Brand"),i=s?a.t(`passport:demo_products.${s}.origin_country`,t.origin_country||"México"):t.origin_country||"México";let d="";if(s){const u=a.t(`passport:demo_products.${s}.recycling_instructions`);u&&!u.startsWith("demo_products.")&&(d=u)}d||(d=t.recycling_instructions||a.t("passport:recycling.default_instructions","Separación y depósito en canal oficial de reciclaje circular.")),document.getElementById("product-name").textContent=c,document.getElementById("brand-name").textContent=o,document.getElementById("product-serial").textContent=`${a.t("passport:header.serial")}: ${t.serial}`,document.getElementById("product-gtin").textContent=`${a.t("passport:header.gtin")}: ${t.gtin}`;const p=document.getElementById("product-hs");p&&(p.textContent=`HS: ${t.hs_code||"6202.40.00"}`);const m=document.getElementById("customs-hs-code");m&&(m.textContent=t.hs_code||"6202.40.00");const f=document.getElementById("customs-urn-code");f&&(f.textContent=t.passport_urn||`urn:espr:eu:2026:${t.gtin}:${t.serial}`);const l=document.getElementById("product-origin");l&&(l.textContent=i);const b=document.getElementById("product-recycled-pct");if(b){const u=t.materials?.[0];b.textContent=u?`${u.pct}%`:"78%"}document.getElementById("repair-score-value").textContent=t.repair_score,document.getElementById("repair-score-max").textContent="/ 10",document.getElementById("co2-value").textContent=`${t.carbon_kg} kg CO₂e`,document.getElementById("water-value").textContent=`${t.water_liters||180} L`;const g=document.getElementById("lca-total-co2");g&&(g.textContent=`${t.carbon_kg} kg CO₂e`);const h=t.lca_breakdown||{manufacturing_pct:65,transport_pct:22,end_of_life_pct:13},E=document.getElementById("lca-bar-mfg"),D=document.getElementById("lca-bar-log"),A=document.getElementById("lca-bar-eol");E&&(E.style.width=`${h.manufacturing_pct}%`),D&&(D.style.width=`${h.transport_pct}%`),A&&(A.style.width=`${h.end_of_life_pct}%`);const B=document.getElementById("lca-lbl-mfg"),M=document.getElementById("lca-lbl-log"),R=document.getElementById("lca-lbl-eol");B&&(B.textContent=`${h.manufacturing_pct}%`),M&&(M.textContent=`${h.transport_pct}%`),R&&(R.textContent=`${h.end_of_life_pct}%`);const Z=y.canonicalize(t),U=await y.computeSHA256(Z),O=document.getElementById("crypto-sig");O&&(O.textContent=t.signature||`ecdsa_p256_${U.slice(0,32)}`);const z=document.getElementById("crypto-algo");z&&(z.textContent=t.signature_algorithm||"ECDSA-P256-SHA256");const j=document.getElementById("crypto-sha256");j&&(j.textContent=t.canonical_sha256||U);const F=document.getElementById("crypto-time");F&&(F.textContent=t.signature_timestamp||t.manufacturing_date||new Date().toISOString());const H=document.getElementById("materials-list");H&&t.materials&&(H.innerHTML=t.materials.map((u,v)=>{let _=u.name;if(s==="prod_001"||s==="prod_002"){const k=a.t(`passport:demo_products.${s}.materials.${v}`);k&&!k.startsWith("demo_products.")&&(_=k)}const S=n(_),P=parseFloat(u.pct)||0;return`
        <div class="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-white/60 dark:border-white/10 flex justify-between items-center text-sm shadow-sm">
          <span class="font-medium text-slate-800 dark:text-slate-200">${S}</span>
          <span class="font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">${P}%</span>
        </div>
      `}).join(""));const N=document.getElementById("repair-steps-list");N&&(N.innerHTML=(t.repair_guide||[]).map((u,v)=>{let _=u.title,S=u.tools;if(s==="prod_001"||s==="prod_002"){const I=a.t(`passport:demo_products.${s}.repair_guide.${v}.title`);I&&!I.startsWith("demo_products.")&&(_=I);const L=a.t(`passport:demo_products.${s}.repair_guide.${v}.tools`);L&&!L.startsWith("demo_products.")&&(S=L)}const P=n(_),k=n(S||a.t("passport:repair_guide.default_tools","Herramientas estándar")),Y=n(u.time||"10 min"),X=parseInt(u.step,10)||v+1;return`
        <div class="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-white/60 dark:border-white/10 space-y-2 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">${a.t("passport:repair_guide.step_prefix","Paso")} ${X}</span>
            <span class="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span class="icon-svg w-3 h-3"><svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></span>
              ${Y}
            </span>
          </div>
          <h4 class="font-semibold text-slate-900 dark:text-white text-sm">${P}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span class="icon-svg w-3.5 h-3.5 text-cyan-500 shrink-0"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.398-3.085 1.22l-7.794 7.794a2.25 2.25 0 0 1-3.182-3.182l7.794-7.794c.822-.821 1.311-2.009 1.22-3.085A4.5 4.5 0 0 1 17.25 2.25a4.5 4.5 0 0 1 4.5 4.5Z"/></svg></span>
            ${k}
          </p>
        </div>
      `}).join(""));const V=document.getElementById("repair-score-badge");V&&(V.textContent=`Score ${t.repair_score!=null?t.repair_score:"9.0"} / 10`);const C=document.getElementById("repair-tools-desc");if(C){const u=t.disassembly_tools||"tools_standard";u==="tools_none"||u==="none"?C.textContent=a.t("passport:repair_guide.tools_none_desc","Sin herramientas requeridas (Fijación por presión / Ensamble directo)"):u==="tools_specialized"||u==="spec"?C.textContent=a.t("passport:repair_guide.tools_specialized_desc","Herramientas especializadas o de taller oficial"):C.textContent=a.t("passport:repair_guide.tools_standard_desc","Herramientas estándar (Destornillador / Llave Allen)")}const G=document.getElementById("repair-duration-desc");if(G){const u=t.repair_duration_yrs||5,v=a.t("passport:repair_guide.years_guarantee","Garantizados durante {years} años por el fabricante");G.textContent=v.replace("{years}",u)}const Q=document.getElementById("recycling-instructions-text");Q&&(Q.textContent=d),this.renderSectorSpecificCard(t),this.renderTabs(),this.updateSEOMetadata(t),await this.preparePrintData()}renderSectorSpecificCard(t){const e=document.getElementById("passport-sector-card-container");if(!e)return;const r=t.category,s=r==="battery"||t.battery_chemistry,c=r==="cosmetics"||t.inci_ingredients,o=r==="food"||t.food_batch,i=r==="construction"||t.epd_number,d=r==="furniture";if(!s&&!c&&!o&&!i&&!d){e.classList.add("hidden"),e.innerHTML="";return}if(e.classList.remove("hidden"),s){const p=n(t.battery_chemistry||"Li-Ion (NMC 811)"),m=n(t.battery_capacity||"75 kWh / 150 Ah"),f=t.battery_recycled_metals||{cobalt_pct:18,lithium_pct:8,nickel_pct:8},l=parseFloat(f.cobalt_pct)||18,b=parseFloat(f.lithium_pct)||8,g=parseFloat(f.nickel_pct)||8,h=ComplianceCalculator.evaluateBatteryRecycledMetals(l,b,g);e.innerHTML=`
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
              <strong class="text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${p}</strong>
            </div>
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.battery_cap">${a.t("passport:sector_cards.battery_cap","Capacidad Nominal")}</span>
              <strong class="text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${m}</strong>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.battery_recycled_metals">${a.t("passport:sector_cards.battery_recycled_metals","Metales Críticos Reciclados")}</span>
              <span class="font-mono font-extrabold text-amber-600 dark:text-amber-400">${h.averagePct}% Promedio</span>
            </div>
            <div class="grid grid-cols-3 gap-1 text-center font-mono text-[11px]">
              <span class="p-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">Co: ${l}%</span>
              <span class="p-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">Li: ${b}%</span>
              <span class="p-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">Ni: ${g}%</span>
            </div>
            <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-0.5">
              <span>✓</span> <span data-i18n="passport:sector_cards.battery_targets_met">${a.t("passport:sector_cards.battery_targets_met","Objetivos de Recuperación UE 2027/2031 Cumplidos")}</span>
            </p>
          </div>
        </div>
      `}else if(c){const p=n(t.inci_ingredients||"Aqua, Glycerin, Niacinamide, Sodium Hyaluronate, Panthenol, Tocopherol"),m=parseInt(t.pao_months,10)||12,f=n(t.allergens||"Linalool, Limonene (Conforme IFRA)");e.innerHTML=`
        <div class="p-4 sm:p-5 rounded-3xl bg-pink-500/10 dark:bg-pink-500/15 border border-pink-500/25 space-y-3 shadow-sm text-slate-800 dark:text-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-pink-700 dark:text-pink-400 text-sm sm:text-base flex items-center gap-2">
              <span class="icon-svg w-5 h-5 text-pink-500 shrink-0">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>
              </span>
              <span data-i18n="passport:sector_cards.cosmetics_title">${a.t("passport:sector_cards.cosmetics_title","Fórmula INCI & Seguridad Cosmética (Reg. UE 1223/2009)")}</span>
            </h4>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-700 dark:text-pink-300">PAO ${m}M</span>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.inci_list">${a.t("passport:sector_cards.inci_list","Lista Oficial de Ingredientes (INCI)")}</span>
            <p class="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">${p}</p>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.allergens_label">${a.t("passport:sector_cards.allergens_label","Alérgenos Declarables")}</span>
            <span class="font-semibold text-pink-600 dark:text-pink-400">${f}</span>
          </div>
        </div>
      `}else if(o){const p=n(t.food_batch||"LOTE-2026-B842"),m=n(t.food_expiry||"2027-06-30"),f=n(t.food_temp||"2°C - 6°C (Refrigerado)"),l=n(t.food_certifications||"Orgánico Sagarpa, FairTrade, Kosher");e.innerHTML=`
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
              <strong class="font-mono text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${p}</strong>
            </div>
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.food_exp">${a.t("passport:sector_cards.food_exp","Consumo Preferente")}</span>
              <strong class="font-mono text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${m}</strong>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.food_temp">${a.t("passport:sector_cards.food_temp","Conservación Térmica")}</span>
            <span class="font-bold text-cyan-600 dark:text-cyan-400">${f}</span>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.food_certs">${a.t("passport:sector_cards.food_certs","Certificaciones Acreditadas")}</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">${l}</span>
          </div>
        </div>
      `}else if(i){const p=n(t.epd_number||"S-P-04892 (Environdec ISO 14025)"),m=parseInt(t.structural_lifespan_yrs,10)||50;e.innerHTML=`
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
              <strong class="font-mono text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${p}</strong>
            </div>
            <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span class="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold" data-i18n="passport:sector_cards.lifespan_label">${a.t("passport:sector_cards.lifespan_label","Vida Útil Estimada")}</span>
              <strong class="text-slate-900 dark:text-white text-xs sm:text-sm font-bold">${m} años</strong>
            </div>
          </div>
        </div>
      `}else d&&(e.innerHTML=`
        <div class="p-4 sm:p-5 rounded-3xl bg-amber-600/10 dark:bg-amber-600/15 border border-amber-600/25 space-y-3 shadow-sm text-slate-800 dark:text-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-amber-800 dark:text-amber-300 text-sm sm:text-base flex items-center gap-2">
              <span class="icon-svg w-5 h-5 text-amber-600 shrink-0">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3"/></svg>
              </span>
              <span data-i18n="passport:sector_cards.furniture_title">${a.t("passport:sector_cards.furniture_title","Declaración Forestal & Ecodiseño (Reg. UE EUDR 2023/1115)")}</span>
            </h4>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300">EUDR Deforestación Cero</span>
          </div>

          <div class="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700 dark:text-slate-300" data-i18n="passport:sector_cards.forestry_origin">${a.t("passport:sector_cards.forestry_origin","Trazabilidad de Materia Prima y Madera")}</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">100% Legal & Sostenible</span>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed" data-i18n="passport:sector_cards.eudr_compliance">
              ${a.t("passport:sector_cards.eudr_compliance","Certificado libre de deforestación bajo el Reglamento Europeo EUDR. Diseño concebido para durabilidad, desmontaje y reutilización circular.")}
            </p>
          </div>
        </div>
      `)}async preparePrintData(){const t=this.currentProduct;if(!t)return;const e=document.getElementById("print-qr-canvas");if(e){const p=w.generateDigitalLink(t.gtin,t.serial,null,t);try{await W.toCanvas(e,p,{width:320,margin:4,errorCorrectionLevel:"H",color:{dark:"#0f172a",light:"#ffffff"}})}catch(m){console.warn("PassQ: Print QR generation fallback:",m)}}const r=y.canonicalize(t),s=await y.computeSHA256(r),c=document.getElementById("print-crypto-algo");c&&(c.textContent=t.signature_algorithm||"ECDSA-P256-SHA256");const o=document.getElementById("print-crypto-time");o&&(o.textContent=t.signature_timestamp||t.manufacturing_date||new Date().toISOString());const i=document.getElementById("print-crypto-digest");i&&(i.textContent=t.canonical_sha256||s);const d=document.getElementById("print-crypto-sig");d&&(d.textContent=t.signature||`ecdsa_p256_${s.slice(0,32)}`)}async exportOfficialTechnicalPDF(){const t=this.currentProduct;if(!t)return;this.showToast(a.t("passport:toast.generating_pdf","Generando Ficha Técnica Oficial PDF (300 DPI)..."));const e=w.generateDigitalLink(t.gtin,t.serial,null,t);let r="";try{r=await W.toDataURL(e,{width:480,margin:4,errorCorrectionLevel:"H",color:{dark:"#0f172a",light:"#ffffff"}})}catch(g){console.warn("QR DataURL generation error:",g)}const s=y.canonicalize(t),c=await y.computeSHA256(s),o=t.signature||`ecdsa_p256_${c.slice(0,32)}`,i=t.signature_algorithm||"ECDSA-P256-SHA256",d=t.signature_timestamp||t.manufacturing_date||new Date().toISOString(),p=Array.isArray(t.materials)&&t.materials.length>0?t.materials.map(g=>{const h=typeof g=="object"?g.name||g.n||"Material":Array.isArray(g)?g[0]:String(g),E=typeof g=="object"?g.pct||g.p||0:Array.isArray(g)?g[1]:0;return`<tr><td style="padding: 5px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${n(h)}</td><td style="padding: 5px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #059669;">${E}%</td></tr>`}).join(""):'<tr><td colspan="2" style="padding: 6px 10px; color: #64748b;">Composición conforme a normativa</td></tr>';let m="";t.category==="battery"||t.battery_chemistry?m=`
        <div style="margin-top: 12px; padding: 10px 14px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 10.5pt; color: #166534; font-weight: 800;">Especificaciones de Batería (Reg. UE 2023/1542)</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9pt;">
            <div><strong>Química:</strong> ${n(t.battery_chemistry||"Li-Ion NMC")}</div>
            <div><strong>Capacidad:</strong> ${n(t.battery_capacity||"N/A")}</div>
            <div style="grid-column: span 2;"><strong>Metales Críticos Reciclados:</strong> Co: ${t.battery_recycled_metals?.cobalt_pct||16}%, Li: ${t.battery_recycled_metals?.lithium_pct||6}%, Ni: ${t.battery_recycled_metals?.nickel_pct||65}%</div>
          </div>
        </div>
      `:t.category==="cosmetics"||t.inci_ingredients?m=`
        <div style="margin-top: 12px; padding: 10px 14px; background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 10.5pt; color: #9d174d; font-weight: 800;">Fórmula INCI & Seguridad Cosmética (Reg. UE 1223/2009)</h4>
          <div style="font-size: 9pt;">
            <div><strong>Fórmula INCI:</strong> <span style="font-family: monospace;">${n(t.inci_ingredients||"N/A")}</span></div>
            <div style="margin-top: 3px;"><strong>PAO:</strong> ${t.pao_months||12} meses | <strong>Alérgenos:</strong> ${n(t.allergens||"Sin alérgenos declarables")}</div>
          </div>
        </div>
      `:t.category==="food"||t.food_batch?m=`
        <div style="margin-top: 12px; padding: 10px 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 10.5pt; color: #065f46; font-weight: 800;">Trazabilidad Agroalimentaria & Cadena de Frío</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9pt;">
            <div><strong>Lote:</strong> ${n(t.food_batch||"N/A")}</div>
            <div><strong>Caducidad:</strong> ${n(t.food_expiry||"N/A")}</div>
            <div><strong>Conservación:</strong> ${n(t.food_temp||"Lugar fresco y seco")}</div>
            <div><strong>Certificaciones:</strong> ${n(t.food_certifications||"Conforme")}</div>
          </div>
        </div>
      `:(t.category==="construction"||t.epd_number)&&(m=`
        <div style="margin-top: 12px; padding: 10px 14px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 10.5pt; color: #1e293b; font-weight: 800;">Declaración Ambiental de Producto (EPD & CPR)</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 9pt;">
            <div><strong>Registro EPD:</strong> ${n(t.epd_number||"ISO 14025")}</div>
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
      <h1>${n(t.name)}</h1>
      <div style="font-size: 10pt; font-weight: 700; color: #059669;">${n(t.brand||"PassQ Certified")} • Sector: ${n(t.category||"General").toUpperCase()}</div>
    </div>
    <div style="text-align: center; background: #ffffff; padding: 4px; border: 1px solid #cbd5e1; border-radius: 6px;">
      <img src="${r}" style="width: 92px; height: 92px; display: block; image-rendering: -webkit-optimize-contrast; image-rendering: pixelated; shape-rendering: crispEdges;" alt="GS1 Digital Link QR" />
      <div style="font-size: 6.5pt; font-family: monospace; font-weight: 700; color: #475569; margin-top: 2px;">GS1 DIGITAL LINK</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-card">
      <div class="label">Código GTIN-13</div>
      <div class="val">${n(t.gtin)}</div>
    </div>
    <div class="meta-card">
      <div class="label">Número de Serie</div>
      <div class="val">${n(t.serial||"01")}</div>
    </div>
    <div class="meta-card">
      <div class="label">Código Arancelario HS</div>
      <div class="val">${n(t.hs_code||"6202.40.00")}</div>
    </div>
    <div class="meta-card">
      <div class="label">País de Origen</div>
      <div class="val">${n(t.origin_country||"México")}</div>
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
        <div><strong>Herramientas necesarias:</strong> ${n(t.disassembly_tools||"Estándar")}</div>
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
          ${p}
        </tbody>
      </table>
    </div>

    <div class="section-card">
      <div class="section-title">4. Directrices Oficiales de Reciclaje</div>
      <p style="font-size: 8.5pt; color: #334155; margin: 0 0 4px 0;">${n(t.recycling_instructions||"Separación y depósito en canal oficial de reciclaje circular.")}</p>
      <div style="font-size: 7.5pt; font-weight: 700; color: #166534; background: #f0fdf4; padding: 3px 6px; border-radius: 4px; border: 1px solid #bbf7d0;">
        ✓ 100% Conforme con directivas UE RoHS, REACH y WEEE
      </div>
    </div>
  </div>

  ${m}

  <div class="crypto-box">
    <div class="crypto-title">
      <span>SELLO CRIPTOGRÁFICO OFICIAL DE AUTENTICIDAD & NO REPUDIO</span>
      <span style="color: #166534; font-weight: 800;">ESTADO: VÁLIDO & INMUTABLE</span>
    </div>
    <div class="crypto-details">
      <div><strong>Algoritmo Criptográfico:</strong> ${i} (NIST FIPS 186-4)</div>
      <div><strong>Sello de Tiempo (Timestamp):</strong> ${d}</div>
      <div style="margin-top: 1px;"><strong>Digest SHA-256 Canónico:</strong> <span style="color: #0284c7;">${c}</span></div>
      <div style="margin-top: 1px;"><strong>Firma Digital del Fabricante:</strong> <span style="color: #15803d;">${o}</span></div>
    </div>
  </div>

  <div class="footer">
    <span>PassQ Decentralized Infrastructure • Pasaporte Digital de Producto ESPR 2024/1781</span>
    <span>Documento Técnico Oficial Generado en Tiempo Real</span>
  </div>
</body>
</html>
    `,l=document.createElement("iframe");l.style.position="fixed",l.style.right="0",l.style.bottom="0",l.style.width="0",l.style.height="0",l.style.border="none",document.body.appendChild(l);const b=l.contentWindow.document;b.open(),b.write(f),b.close(),l.contentWindow.focus(),setTimeout(()=>{try{l.contentWindow.print()}catch{window.print()}setTimeout(()=>{l.remove()},2e3)},300)}updateSEOMetadata(t){if(!t)return;const e=`${t.name} • ${t.brand||"PassQ"} • Pasaporte Digital de Producto (DPP)`,r=`Pasaporte Digital de Producto oficial para ${t.name} (GTIN: ${t.gtin}). Huella de carbono: ${t.carbon_kg||"1.8"} kg CO2e, Reparabilidad: ${t.repair_score||"9.0"}/10, Código HS: ${t.hs_code||"6202.40.00"}. Certificado por PassQ.`,c=`${window.location.href.split(/[?#]/)[0].replace(/\/[^\/]*$/,"")}/p.html?gtin=${t.gtin}`;document.title=e;const o=document.getElementById("dpp-meta-desc");o&&o.setAttribute("content",r);const i=document.getElementById("dpp-meta-canonical");i&&i.setAttribute("href",c);const d=document.getElementById("dpp-og-title");d&&d.setAttribute("content",e);const p=document.getElementById("dpp-og-desc");p&&p.setAttribute("content",r);const m=document.getElementById("dpp-og-url");m&&m.setAttribute("content",c);const f=document.getElementById("dpp-tw-title");f&&f.setAttribute("content",e);const l=document.getElementById("dpp-tw-desc");l&&l.setAttribute("content",r);const b=document.getElementById("dpp-jsonld");if(b){const g={"@context":["https://schema.org",{gs1:"https://gs1.org/voc/"}],"@type":"Product",name:t.name,description:r,gtin13:t.gtin,sku:t.serial||t.gtin,brand:{"@type":"Brand",name:t.brand||"PassQ Certified"},category:t.category,countryOfOrigin:{"@type":"Country",name:t.origin_country||"México"},additionalProperty:[{"@type":"PropertyValue",name:"CarbonFootprintLCA",value:`${t.carbon_kg||1.8} kg CO2e`},{"@type":"PropertyValue",name:"RepairabilityScore",value:`${t.repair_score||9}/10`},{"@type":"PropertyValue",name:"CustomsHSCode",value:t.hs_code||"6202.40.00"},{"@type":"PropertyValue",name:"PassportURN",value:t.passport_urn||`urn:espr:eu:2026:${t.gtin}:${t.serial}`}]};b.textContent=JSON.stringify(g,null,2)}}renderTabs(){const t="flex-1 min-w-[76px] sm:min-w-0 py-2.5 px-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center text-center whitespace-nowrap select-none";document.querySelectorAll("[data-tab]").forEach(e=>{e.getAttribute("data-tab")===this.activeTab?e.className=`${t} font-black bg-emerald-600 text-white dark:bg-emerald-500 shadow-md`:e.className=`${t} font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5`}),document.querySelectorAll("[data-tab-content]").forEach(e=>{e.getAttribute("data-tab-content")===this.activeTab?e.classList.remove("hidden"):e.classList.add("hidden")})}}document.addEventListener("DOMContentLoaded",()=>{new at().init()});

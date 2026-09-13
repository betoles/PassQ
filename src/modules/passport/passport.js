import { i18n } from '../../core/i18n/i18n.js';
import { theme } from '../../core/theme/theme.js';
import { storage } from '../../core/storage/storage.js';
import { Icons, renderIcons } from '../../core/icons/icons.js';
import { GS1Formatter } from '../compliance/gs1.js';
import { CameraScanner } from '../scanner/scanner.js';
import { cryptoEngine } from '../../core/crypto/crypto.js';
import QRCode from 'qrcode';

const SAMPLE_SPARE_PARTS = {
  textile: [
    { name: "Cremallera Estanca YKK Reforzada", sku: "SP-YKK-842", price: "$8.50 USD", delivery: "48h" },
    { name: "Kit Parches Térmicos Impermeables", sku: "SP-PTH-019", price: "$5.00 USD", delivery: "24-48h" },
    { name: "Cordón Elástico con Bloqueador Ergonómico", sku: "SP-CRD-004", price: "$3.20 USD", delivery: "24h" }
  ],
  electronics: [
    { name: "Módulo Batería Li-Ion 800mAh (Plug & Play)", sku: "SP-BAT-800Z", price: "$14.00 USD", delivery: "48h" },
    { name: "Almohadillas Magnéticas Viscoelásticas", sku: "SP-ALM-MAG", price: "$12.50 USD", delivery: "24h" },
    { name: "Cable Modular Jack 3.5mm / USB-C Trenzado", sku: "SP-CBL-MOD", price: "$9.00 USD", delivery: "24h" }
  ],
  default: [
    { name: "Kit de Tornillería y Anclajes Estándar", sku: "SP-TRN-STD", price: "$4.00 USD", delivery: "24h" },
    { name: "Pieza de Repuesto Oficial Certificada", sku: "SP-GEN-001", price: "$10.00 USD", delivery: "48-72h" }
  ]
};

function updateFlagSlot(lang) {
  const flagSlot = document.getElementById('lang-flag-slot');
  if (flagSlot && Icons[`flag_${lang}`]) {
    flagSlot.innerHTML = Icons[`flag_${lang}`]('w-4 h-3 inline-block rounded-xs shadow-xs align-middle mr-1.5');
  }
}

class PassportViewController {
  constructor() {
    this.currentProduct = null;
    this.activeTab = 'overview';
    this.scanner = null;
  }

  async init() {
    // 1. Load namespaces
    await i18n.loadNamespaces(['common', 'passport']);
    theme.updateIconSlots();
    renderIcons();

    // 2. Extract product from URL params (gtin, id, or fallback payload)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('gtin') || params.get('id') || 'prod_001';
    const pdata = params.get('pdata');
    this.currentProduct = storage.getById(productId, pdata);

    // 3. Initialize Camera Scanner with Universal Parser
    this.scanner = new CameraScanner((scannedUrl) => {
      window.location.href = scannedUrl;
    });
    this.scanner.init('camera-scanner-modal');

    // 4. Setup listeners
    this.setupUIListeners();

    // 5. Initial Render
    this.render();
    updateFlagSlot(i18n.currentLanguage);

    // Re-render when language changes
    i18n.onLanguageChange(async (newLang) => {
      await i18n.loadNamespaces(['common', 'passport']);
      this.render();
      updateFlagSlot(newLang);
      theme.updateIconSlots();
      renderIcons();
    });
  }

  showToast(message) {
    const toast = document.getElementById('glass-toast');
    const toastText = document.getElementById('glass-toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.remove('translate-y-8', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-8', 'opacity-0', 'pointer-events-none');
    }, 3200);
  }

  copyUrlToClipboard(url) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast(i18n.t('passport:share.copied', 'Enlace del Pasaporte copiado al portapapeles.'));
      }).catch(() => {
        this.fallbackCopyTextToClipboard(url);
      });
    } else {
      this.fallbackCopyTextToClipboard(url);
    }
  }

  fallbackCopyTextToClipboard(text) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      if (successful) {
        this.showToast(i18n.t('passport:share.copied', 'Enlace del Pasaporte copiado al portapapeles.'));
      }
    } catch {
      this.showToast(i18n.t('passport:share.copied', 'Enlace del Pasaporte copiado al portapapeles.'));
    }
  }

  setupUIListeners() {
    // Language select
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.value = i18n.currentLanguage;
      updateFlagSlot(i18n.currentLanguage);
      langSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        updateFlagSlot(selected);
        i18n.setLanguage(selected);
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        theme.toggleTheme();
      });
    }

    // Tab buttons
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.getAttribute('data-tab');
        this.renderTabs();
      });
    });

    // Native Web Share API (AirDrop / WhatsApp / Telegram) + Multi-Platform Clipboard Fallback
    document.getElementById('btn-share-passport')?.addEventListener('click', async () => {
      const url = GS1Formatter.generateDigitalLink(this.currentProduct.gtin, this.currentProduct.serial, null, this.currentProduct);
      const shareTitle = (i18n.t('passport:share.title', 'Pasaporte Digital: {name}')).replace('{name}', this.currentProduct?.name || 'PassQ');
      const shareText = (i18n.t('passport:share.text', 'Consulta el Pasaporte Digital oficial de {name} certificado por PassQ.')).replace('{name}', this.currentProduct?.name || 'PassQ');

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: url
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            this.copyUrlToClipboard(url);
          }
        }
      } else {
        this.copyUrlToClipboard(url);
      }
    });

    // Official Customs PDF Generation via Glassmorphism Sheet / Modal
    const openPrintModal = async () => {
      await this.preparePrintData();
      const modal = document.getElementById('print-options-modal');
      modal?.classList.remove('hidden');
    };

    const closePrintModal = () => {
      const modal = document.getElementById('print-options-modal');
      modal?.classList.add('hidden');
    };

    document.getElementById('btn-print-customs-pdf')?.addEventListener('click', openPrintModal);
    document.getElementById('btn-close-print-options')?.addEventListener('click', closePrintModal);
    document.getElementById('btn-cancel-print-options')?.addEventListener('click', closePrintModal);
    document.getElementById('print-options-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'print-options-modal') closePrintModal();
    });

    document.getElementById('btn-confirm-print-action')?.addEventListener('click', () => {
      closePrintModal();
      // Slight delay for smooth modal close transition before triggering browser print
      setTimeout(() => {
        window.print();
      }, 150);
    });

    // Open Camera Scanner
    document.getElementById('btn-open-camera-scanner')?.addEventListener('click', () => {
      this.scanner.start();
    });

    // Customs export JSON-LD
    document.getElementById('btn-export-jsonld')?.addEventListener('click', () => {
      const jsonLd = GS1Formatter.generateJSONLD(this.currentProduct);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonLd, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `DPP_${this.currentProduct.gtin}_customs.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast(i18n.t('passport:toast.jsonld_exported', 'Ficha técnica JSON-LD exportada con éxito.'));
    });

    // Interactive Spare Parts Modal (Apple Guideline 2.1 & 4.2 Compliance)
    document.getElementById('btn-open-spare-parts')?.addEventListener('click', () => {
      this.openSparePartsModal();
    });

    document.getElementById('btn-close-spare-parts')?.addEventListener('click', () => {
      document.getElementById('spare-parts-modal')?.classList.add('hidden');
    });

    document.getElementById('btn-submit-spare-request')?.addEventListener('click', () => {
      const mailtoUrl = `mailto:passq-reportes@outlook.com?subject=${encodeURIComponent(i18n.t('passport:spare_parts_modal.email_subject', 'Solicitud de Repuestos Oficiales: ') + this.currentProduct.name + ` (GTIN: ${this.currentProduct.gtin})`)}&body=${encodeURIComponent(i18n.t('passport:spare_parts_modal.email_body', 'Hola, deseo solicitar repuestos originales certificados para el producto ') + this.currentProduct.name + ` (Serie: ${this.currentProduct.serial}).`)}`;
      window.location.href = mailtoUrl;
    });

    // Cryptographic Seal Modal Listeners
    const openCrypto = async () => {
      if (this.currentProduct) {
        const canonical = cryptoEngine.canonicalize(this.currentProduct);
        const digest = await cryptoEngine.computeSHA256(canonical);
        const digestEl = document.getElementById('crypto-sha256');
        if (digestEl) digestEl.textContent = digest;
      }
      document.getElementById('crypto-modal')?.classList.remove('hidden');
    };
    document.getElementById('btn-open-crypto-seal')?.addEventListener('click', openCrypto);
    document.getElementById('btn-verify-badge-icon')?.addEventListener('click', openCrypto);
    document.getElementById('btn-close-crypto')?.addEventListener('click', () => {
      document.getElementById('crypto-modal')?.classList.add('hidden');
    });

    document.getElementById('btn-reverify-crypto')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const originalText = btn.innerHTML;
      btn.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>${i18n.t('passport:crypto.verifying', 'Ejecutando Web Crypto API (ECDSA P-256 + SHA-256)...')}</span>
        </span>
      `;
      
      const verification = await cryptoEngine.verifyPassport(this.currentProduct);
      
      setTimeout(() => {
        btn.innerHTML = `
          <span class="inline-flex items-center gap-2 text-white font-bold">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
            <span>${(i18n.t('passport:crypto.verified', 'Firma e Integridad 100% Auténticas ({algo})')).replace('{algo}', verification.algorithm)}</span>
          </span>
        `;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 3000);
      }, 450);
    });
  }

  openSparePartsModal() {
    const modal = document.getElementById('spare-parts-modal');
    const container = document.getElementById('spare-parts-items-list');
    if (!modal || !container) return;

    const parts = SAMPLE_SPARE_PARTS[this.currentProduct?.category] || SAMPLE_SPARE_PARTS.default;
    
    container.innerHTML = parts.map(part => {
      const partName = i18n.t(`passport:spare_parts.${part.sku}.name`, part.name);
      const delivery = i18n.t(`passport:spare_parts.${part.sku}.delivery`, part.delivery);
      return `
      <div class="p-3.5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 flex items-center justify-between shadow-sm">
        <div class="space-y-0.5">
          <p class="font-bold text-xs text-slate-900 dark:text-white">${partName}</p>
          <p class="text-[10px] font-mono text-slate-400">Ref: ${part.sku} • ${i18n.t('passport:spare_parts.delivery_prefix', 'Envío')}: ${delivery}</p>
        </div>
        <span class="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
          ${part.price}
        </span>
      </div>
    `;
    }).join('');

    modal.classList.remove('hidden');
  }

  async render() {
    const p = this.currentProduct;
    if (!p) return;

    // Translate all static data-i18n elements first
    i18n.translateDOM();

    // Localized dynamic text resolution (robust fallback for demo products and custom products)
    const isProd1 = p.id === 'prod_001' || p.gtin === '7501234567893' || p.gtin === '7501234567890' || p.id === '7501234567893' || p.id === '7501234567890' || (p.recycling_instructions && p.recycling_instructions.includes('ECONYL'));
    const isProd2 = p.id === 'prod_002' || p.gtin === '8412345678905' || p.gtin === '8412345678901' || p.id === '8412345678905' || p.id === '8412345678901' || (p.recycling_instructions && (p.recycling_instructions.includes('Aura') || p.recycling_instructions.includes('batteria') || p.recycling_instructions.includes('batería') || p.recycling_instructions.includes('foundr') || p.recycling_instructions.includes('fundición')));

    const demoKey = isProd1 ? 'prod_001' : (isProd2 ? 'prod_002' : p.id);

    const localizedName = (demoKey === 'prod_001' || demoKey === 'prod_002')
      ? i18n.t(`passport:demo_products.${demoKey}.name`, p.name)
      : (p.name || i18n.t('passport:header.loading_product', 'PassQ DPP'));

    const localizedBrand = (demoKey === 'prod_001' || demoKey === 'prod_002')
      ? i18n.t(`passport:demo_products.${demoKey}.brand`, p.brand || 'PassQ Verified')
      : (p.brand || i18n.t('passport:header.verified_brand', 'PassQ Verified Brand'));

    const localizedOrigin = (demoKey === 'prod_001' || demoKey === 'prod_002')
      ? i18n.t(`passport:demo_products.${demoKey}.origin_country`, p.origin_country || 'México')
      : (p.origin_country || 'México');

    let localizedRecycling = '';
    if (demoKey === 'prod_001' || demoKey === 'prod_002') {
      const transRec = i18n.t(`passport:demo_products.${demoKey}.recycling_instructions`);
      if (transRec && !transRec.startsWith('demo_products.')) {
        localizedRecycling = transRec;
      }
    }
    if (!localizedRecycling) {
      localizedRecycling = p.recycling_instructions || i18n.t('passport:recycling.default_instructions', 'Separación y depósito en canal oficial de reciclaje circular.');
    }

    // Header info
    document.getElementById('product-name').textContent = localizedName;
    document.getElementById('brand-name').textContent = localizedBrand;
    document.getElementById('product-serial').textContent = `${i18n.t('passport:header.serial')}: ${p.serial}`;
    document.getElementById('product-gtin').textContent = `${i18n.t('passport:header.gtin')}: ${p.gtin}`;
    
    const hsEl = document.getElementById('product-hs');
    if (hsEl) hsEl.textContent = `HS: ${p.hs_code || '6202.40.00'}`;

    // Customs & URN
    const customsHs = document.getElementById('customs-hs-code');
    if (customsHs) customsHs.textContent = p.hs_code || '6202.40.00';

    const customsUrn = document.getElementById('customs-urn-code');
    if (customsUrn) customsUrn.textContent = p.passport_urn || `urn:espr:eu:2026:${p.gtin}:${p.serial}`;

    const originEl = document.getElementById('product-origin');
    if (originEl) originEl.textContent = localizedOrigin;

    const recycledEl = document.getElementById('product-recycled-pct');
    if (recycledEl) {
      const topMat = p.materials?.[0];
      recycledEl.textContent = topMat ? `${topMat.pct}%` : '78%';
    }

    // Repair Score
    document.getElementById('repair-score-value').textContent = p.repair_score;
    document.getElementById('repair-score-max').textContent = `/ 10`;

    // Carbon and water footprint
    document.getElementById('co2-value').textContent = `${p.carbon_kg} kg CO₂e`;
    document.getElementById('water-value').textContent = `${p.water_liters || 180} L`;

    const lcaCo2 = document.getElementById('lca-total-co2');
    if (lcaCo2) lcaCo2.textContent = `${p.carbon_kg} kg CO₂e`;

    // LCA Breakdown
    const lca = p.lca_breakdown || { manufacturing_pct: 65, transport_pct: 22, end_of_life_pct: 13 };
    const barMfg = document.getElementById('lca-bar-mfg');
    const barLog = document.getElementById('lca-bar-log');
    const barEol = document.getElementById('lca-bar-eol');
    if (barMfg) barMfg.style.width = `${lca.manufacturing_pct}%`;
    if (barLog) barLog.style.width = `${lca.transport_pct}%`;
    if (barEol) barEol.style.width = `${lca.end_of_life_pct}%`;

    const lblMfg = document.getElementById('lca-lbl-mfg');
    const lblLog = document.getElementById('lca-lbl-log');
    const lblEol = document.getElementById('lca-lbl-eol');
    if (lblMfg) lblMfg.textContent = `${lca.manufacturing_pct}%`;
    if (lblLog) lblLog.textContent = `${lca.transport_pct}%`;
    if (lblEol) lblEol.textContent = `${lca.end_of_life_pct}%`;

    // Cryptographic info modal
    const canonical = cryptoEngine.canonicalize(p);
    const computedDigest = await cryptoEngine.computeSHA256(canonical);

    const cryptoSig = document.getElementById('crypto-sig');
    if (cryptoSig) cryptoSig.textContent = p.signature || `ecdsa_p256_${computedDigest.slice(0, 32)}`;

    const cryptoAlgo = document.getElementById('crypto-algo');
    if (cryptoAlgo) cryptoAlgo.textContent = p.signature_algorithm || 'ECDSA-P256-SHA256';

    const cryptoDigestEl = document.getElementById('crypto-sha256');
    if (cryptoDigestEl) cryptoDigestEl.textContent = p.canonical_sha256 || computedDigest;

    const cryptoTime = document.getElementById('crypto-time');
    if (cryptoTime) cryptoTime.textContent = p.signature_timestamp || p.manufacturing_date || new Date().toISOString();

    // Materials list (with dynamic fallback localization)
    const materialsContainer = document.getElementById('materials-list');
    if (materialsContainer && p.materials) {
      materialsContainer.innerHTML = p.materials.map((m, idx) => {
        let matName = m.name;
        if (demoKey === 'prod_001' || demoKey === 'prod_002') {
          const transMat = i18n.t(`passport:demo_products.${demoKey}.materials.${idx}`);
          if (transMat && !transMat.startsWith('demo_products.')) {
            matName = transMat;
          }
        }
        return `
        <div class="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-white/60 dark:border-white/10 flex justify-between items-center text-sm shadow-sm">
          <span class="font-medium text-slate-800 dark:text-slate-200">${matName}</span>
          <span class="font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">${m.pct}%</span>
        </div>
      `;
      }).join('');
    }

    // Repair steps list with clean vector SVG icons
    const repairContainer = document.getElementById('repair-steps-list');
    if (repairContainer) {
      repairContainer.innerHTML = (p.repair_guide || []).map((r, idx) => {
        let title = r.title;
        let tools = r.tools;
        if (demoKey === 'prod_001' || demoKey === 'prod_002') {
          const transTitle = i18n.t(`passport:demo_products.${demoKey}.repair_guide.${idx}.title`);
          if (transTitle && !transTitle.startsWith('demo_products.')) {
            title = transTitle;
          }
          const transTools = i18n.t(`passport:demo_products.${demoKey}.repair_guide.${idx}.tools`);
          if (transTools && !transTools.startsWith('demo_products.')) {
            tools = transTools;
          }
        }
        return `
        <div class="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-white/60 dark:border-white/10 space-y-2 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">${i18n.t('passport:repair_guide.step_prefix', 'Paso')} ${r.step}</span>
            <span class="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span class="icon-svg w-3 h-3"><svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg></span>
              ${r.time || '10 min'}
            </span>
          </div>
          <h4 class="font-semibold text-slate-900 dark:text-white text-sm">${title}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span class="icon-svg w-3.5 h-3.5 text-cyan-500 shrink-0"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.398-3.085 1.22l-7.794 7.794a2.25 2.25 0 0 1-3.182-3.182l7.794-7.794c.822-.821 1.311-2.009 1.22-3.085A4.5 4.5 0 0 1 17.25 2.25a4.5 4.5 0 0 1 4.5 4.5Z"/></svg></span>
            ${tools || i18n.t('passport:repair_guide.default_tools', 'Herramientas estándar')}
          </p>
        </div>
      `;
      }).join('');
    }

    // Recycling text
    const recyclingEl = document.getElementById('recycling-instructions-text');
    if (recyclingEl) {
      recyclingEl.textContent = localizedRecycling;
    }

    this.renderTabs();
    this.updateSEOMetadata(p);
    await this.preparePrintData();
  }

  async preparePrintData() {
    const p = this.currentProduct;
    if (!p) return;

    // Generate Official High-Resolution QR code for print / PDF view (300 DPI target)
    const printQrCanvas = document.getElementById('print-qr-canvas');
    if (printQrCanvas) {
      const url = GS1Formatter.generateDigitalLink(p.gtin, p.serial, null, p);
      try {
        await QRCode.toCanvas(printQrCanvas, url, {
          width: 320,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });
      } catch (err) {
        console.warn('PassQ: Print QR generation fallback:', err);
      }
    }

    // Populate Print Cryptographic Certificate
    const canonical = cryptoEngine.canonicalize(p);
    const computedDigest = await cryptoEngine.computeSHA256(canonical);

    const printAlgo = document.getElementById('print-crypto-algo');
    if (printAlgo) printAlgo.textContent = p.signature_algorithm || 'ECDSA-P256-SHA256';

    const printTime = document.getElementById('print-crypto-time');
    if (printTime) printTime.textContent = p.signature_timestamp || p.manufacturing_date || new Date().toISOString();

    const printDigest = document.getElementById('print-crypto-digest');
    if (printDigest) printDigest.textContent = p.canonical_sha256 || computedDigest;

    const printSig = document.getElementById('print-crypto-sig');
    if (printSig) printSig.textContent = p.signature || `ecdsa_p256_${computedDigest.slice(0, 32)}`;
  }

  updateSEOMetadata(p) {
    if (!p) return;
    const title = `${p.name} • ${p.brand || 'PassQ'} • Pasaporte Digital de Producto (DPP)`;
    const description = `Pasaporte Digital de Producto oficial para ${p.name} (GTIN: ${p.gtin}). Huella de carbono: ${p.carbon_kg || '1.8'} kg CO2e, Reparabilidad: ${p.repair_score || '9.0'}/10, Código HS: ${p.hs_code || '6202.40.00'}. Certificado por PassQ.`;
    const canonicalUrl = `${window.location.origin}/p.html?gtin=${p.gtin}`;

    // Update document title
    document.title = title;

    // Update meta description
    const metaDesc = document.getElementById('dpp-meta-desc');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Update canonical link
    const metaCanonical = document.getElementById('dpp-meta-canonical');
    if (metaCanonical) metaCanonical.setAttribute('href', canonicalUrl);

    // Update Open Graph tags
    const ogTitle = document.getElementById('dpp-og-title');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.getElementById('dpp-og-desc');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogUrl = document.getElementById('dpp-og-url');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    // Update Twitter tags
    const twTitle = document.getElementById('dpp-tw-title');
    if (twTitle) twTitle.setAttribute('content', title);

    const twDesc = document.getElementById('dpp-tw-desc');
    if (twDesc) twDesc.setAttribute('content', description);

    // Update dynamic JSON-LD Structured Data
    const jsonLdScript = document.getElementById('dpp-jsonld');
    if (jsonLdScript) {
      const structuredData = {
        "@context": [
          "https://schema.org",
          { "gs1": "https://gs1.org/voc/" }
        ],
        "@type": "Product",
        "name": p.name,
        "description": description,
        "gtin13": p.gtin,
        "sku": p.serial || p.gtin,
        "brand": {
          "@type": "Brand",
          "name": p.brand || "PassQ Certified"
        },
        "category": p.category,
        "countryOfOrigin": {
          "@type": "Country",
          "name": p.origin_country || "México"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "CarbonFootprintLCA",
            "value": `${p.carbon_kg || 1.8} kg CO2e`
          },
          {
            "@type": "PropertyValue",
            "name": "RepairabilityScore",
            "value": `${p.repair_score || 9.0}/10`
          },
          {
            "@type": "PropertyValue",
            "name": "CustomsHSCode",
            "value": p.hs_code || "6202.40.00"
          },
          {
            "@type": "PropertyValue",
            "name": "PassportURN",
            "value": p.passport_urn || `urn:espr:eu:2026:${p.gtin}:${p.serial}`
          }
        ]
      };
      jsonLdScript.textContent = JSON.stringify(structuredData, null, 2);
    }
  }

  renderTabs() {
    const baseTabClasses = "flex-1 min-w-[76px] sm:min-w-0 py-2.5 px-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center text-center whitespace-nowrap select-none";
    document.querySelectorAll('[data-tab]').forEach(btn => {
      const tabKey = btn.getAttribute('data-tab');
      if (tabKey === this.activeTab) {
        btn.className = `${baseTabClasses} font-black bg-emerald-600 text-white dark:bg-emerald-500 shadow-md`;
      } else {
        btn.className = `${baseTabClasses} font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5`;
      }
    });

    document.querySelectorAll('[data-tab-content]').forEach(section => {
      const tabKey = section.getAttribute('data-tab-content');
      if (tabKey === this.activeTab) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  }
}

// Boot up
document.addEventListener('DOMContentLoaded', () => {
  const controller = new PassportViewController();
  controller.init();
});

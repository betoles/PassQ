import { i18n } from '../../core/i18n/i18n.js';
import { storage } from '../../core/storage/storage.js';
import { ComplianceCalculator } from '../compliance/calculator.js';
import { GS1Formatter } from '../compliance/gs1.js';
import { cryptoEngine } from '../../core/crypto/crypto.js';

export class WizardController {
  constructor(onSuccess) {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.onSuccess = onSuccess;
    this.formData = {
      name: '',
      category: 'textile',
      gtin: '',
      sku: '',
      origin_country: '',
      assembly_country: '',
      carbon_kg: 3.5,
      repair_duration_yrs: 5,
      disassembly_tools: 'tools_standard',
      materials: [{ name: 'Algodón Orgánico', pct: 100 }],
      recycling_instructions: 'Depositar en contenedor textil o punto limpio autorizado.',
      // Sector-specific properties
      battery_chemistry: 'Li-Ion (NMC)',
      battery_capacity: '75 kWh',
      battery_recycled_cobalt: 18,
      battery_recycled_lithium: 8,
      battery_recycled_nickel: 8,
      inci_ingredients: '',
      pao_months: 12,
      allergens: '',
      food_batch: '',
      food_expiry: '',
      food_temp: '2°C - 6°C',
      food_certifications: 'Orgánico, FairTrade',
      epd_number: '',
      structural_lifespan_yrs: 50
    };
  }

  init() {
    this.modal = document.getElementById('wizard-modal');
    this.setupListeners();
    this.renderStep();
  }

  open() {
    this.currentStep = 1;
    this.modal.classList.remove('hidden');
    this.updateToolOptionCards(this.formData.disassembly_tools || 'tools_standard');
    this.updateLiveScore();
    this.renderSectorSpecificFields(this.formData.category || 'textile');
    this.updateStep3SectorUI();
    this.renderStep();
  }

  close() {
    this.modal.classList.add('hidden');
  }

  setupListeners() {
    document.getElementById('btn-close-wizard').addEventListener('click', () => this.close());
    document.getElementById('btn-wizard-next').addEventListener('click', () => this.nextStep());
    document.getElementById('btn-wizard-prev').addEventListener('click', () => this.prevStep());

    // Add material button
    document.getElementById('btn-add-material')?.addEventListener('click', () => {
      this.formData.materials.push({ name: '', pct: 0 });
      this.renderMaterialsList();
      this.updateLiveMaterialsSum();
    });

    // Option card selector for disassembly tools
    document.querySelectorAll('.tool-option-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const val = e.currentTarget.getAttribute('data-tool-val');
        const hiddenInput = document.getElementById('wizard-tools');
        if (hiddenInput) {
          hiddenInput.value = val;
          this.formData.disassembly_tools = val;
        }
        this.updateToolOptionCards(val);
        this.updateLiveScore();
      });
    });

    // Inputs real-time listener for score calculation
    ['wizard-tools', 'wizard-duration', 'wizard-category'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => this.updateLiveScore());
      document.getElementById(id)?.addEventListener('input', () => this.updateLiveScore());
    });

    // GTIN live input sanitize
    document.getElementById('wizard-gtin')?.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
      const errEl = document.getElementById('step-1-error');
      if (errEl) errEl.classList.add('hidden');
    });

    document.getElementById('wizard-name')?.addEventListener('input', () => {
      const errEl = document.getElementById('step-1-error');
      if (errEl) errEl.classList.add('hidden');
    });

    document.getElementById('wizard-legal-consent')?.addEventListener('change', () => {
      const errEl = document.getElementById('step-4-error');
      if (errEl) errEl.classList.add('hidden');
    });

    this.setupCategoryDropdown();
  }

  renderSectorSpecificFields(category) {
    const container = document.getElementById('wizard-sector-fields-container');
    const inputsBox = document.getElementById('wizard-sector-dynamic-inputs');
    if (!container || !inputsBox) return;

    if (['battery', 'cosmetics', 'food', 'construction'].includes(category)) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
      inputsBox.innerHTML = '';
      return;
    }

    if (category === 'battery') {
      inputsBox.innerHTML = `
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.battery_chemistry">${i18n.t('wizard:sector_fields.battery_chemistry', 'Química de Celda')}</label>
          <input id="wizard-bat-chem" type="text" placeholder="Li-Ion (NMC 811) / LFP" value="${this.formData.battery_chemistry}" class="glass-input w-full py-2 px-3 rounded-xl text-xs font-semibold" />
        </div>
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.battery_capacity">${i18n.t('wizard:sector_fields.battery_capacity', 'Capacidad (Ah/kWh)')}</label>
          <input id="wizard-bat-cap" type="text" placeholder="75 kWh / 150 Ah" value="${this.formData.battery_capacity}" class="glass-input w-full py-2 px-3 rounded-xl text-xs font-semibold" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.battery_recycled_metals">${i18n.t('wizard:sector_fields.battery_recycled_metals', 'Metales Críticos Reciclados (% Co, Li, Ni)')}</label>
          <div class="grid grid-cols-3 gap-2">
            <input id="wizard-bat-co" type="number" placeholder="% Co" value="${this.formData.battery_recycled_cobalt}" class="glass-input py-2 px-2 rounded-xl text-xs text-center font-mono" title="Cobalto Reciclado %" />
            <input id="wizard-bat-li" type="number" placeholder="% Li" value="${this.formData.battery_recycled_lithium}" class="glass-input py-2 px-2 rounded-xl text-xs text-center font-mono" title="Litio Reciclado %" />
            <input id="wizard-bat-ni" type="number" placeholder="% Ni" value="${this.formData.battery_recycled_nickel}" class="glass-input py-2 px-2 rounded-xl text-xs text-center font-mono" title="Níquel Reciclado %" />
          </div>
        </div>
      `;
    } else if (category === 'cosmetics') {
      inputsBox.innerHTML = `
        <div class="sm:col-span-2">
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.inci_ingredients">${i18n.t('wizard:sector_fields.inci_ingredients', 'Fórmula INCI de Ingredientes')}</label>
          <input id="wizard-cosm-inci" type="text" placeholder="Aqua, Glycerin, Niacinamide, Sodium Hyaluronate" value="${this.formData.inci_ingredients}" class="glass-input w-full py-2 px-3 rounded-xl text-xs" />
        </div>
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.pao_months">${i18n.t('wizard:sector_fields.pao_months', 'Período tras Apertura (PAO)')}</label>
          <select id="wizard-cosm-pao" class="glass-input w-full py-2 px-3 rounded-xl text-xs font-bold">
            <option value="6" ${this.formData.pao_months === 6 ? 'selected' : ''}>6 Meses (6M)</option>
            <option value="12" ${this.formData.pao_months === 12 ? 'selected' : ''}>12 Meses (12M)</option>
            <option value="24" ${this.formData.pao_months === 24 ? 'selected' : ''}>24 Meses (24M)</option>
          </select>
        </div>
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.allergens">${i18n.t('wizard:sector_fields.allergens', 'Alérgenos Declarables')}</label>
          <input id="wizard-cosm-alg" type="text" placeholder="Linalool, Limonene (o Ninguno)" value="${this.formData.allergens}" class="glass-input w-full py-2 px-3 rounded-xl text-xs" />
        </div>
      `;
    } else if (category === 'food') {
      inputsBox.innerHTML = `
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.food_batch">${i18n.t('wizard:sector_fields.food_batch', 'Lote de Fabricación')}</label>
          <input id="wizard-food-batch" type="text" placeholder="LOTE-2026-B842" value="${this.formData.food_batch}" class="glass-input w-full py-2 px-3 rounded-xl text-xs font-mono" />
        </div>
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.food_expiry">${i18n.t('wizard:sector_fields.food_expiry', 'Consumo Preferente / Caducidad')}</label>
          <input id="wizard-food-exp" type="date" value="${this.formData.food_expiry || '2027-06-30'}" class="glass-input w-full py-2 px-3 rounded-xl text-xs font-mono" />
        </div>
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.food_temp">${i18n.t('wizard:sector_fields.food_temp', 'Cadena de Frío (°C)')}</label>
          <input id="wizard-food-temp" type="text" placeholder="Conservar entre 2°C y 6°C" value="${this.formData.food_temp}" class="glass-input w-full py-2 px-3 rounded-xl text-xs" />
        </div>
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.food_certifications">${i18n.t('wizard:sector_fields.food_certifications', 'Certificaciones')}</label>
          <input id="wizard-food-certs" type="text" placeholder="Orgánico, FairTrade, Kosher" value="${this.formData.food_certifications}" class="glass-input w-full py-2 px-3 rounded-xl text-xs" />
        </div>
      `;
    } else if (category === 'construction') {
      inputsBox.innerHTML = `
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.epd_number">${i18n.t('wizard:sector_fields.epd_number', 'Registro EPD / ISO 14025')}</label>
          <input id="wizard-epd-num" type="text" placeholder="S-P-04892 (Environdec)" value="${this.formData.epd_number}" class="glass-input w-full py-2 px-3 rounded-xl text-xs font-mono" />
        </div>
        <div>
          <label class="block text-slate-600 dark:text-slate-300 font-bold mb-1" data-i18n="wizard:sector_fields.structural_lifespan">${i18n.t('wizard:sector_fields.structural_lifespan', 'Vida Útil de Diseño (Años)')}</label>
          <input id="wizard-struct-life" type="number" placeholder="50" value="${this.formData.structural_lifespan_yrs}" class="glass-input w-full py-2 px-3 rounded-xl text-xs font-mono" />
        </div>
      `;
    }
  }

  setupCategoryDropdown() {
    const select = document.getElementById('wizard-category');
    if (!select) return;

    select.addEventListener('change', (e) => {
      const val = e.target.value || 'textile';
      this.formData.category = val;
      this.renderSectorSpecificFields(val);
      this.updateStep3SectorUI();
      this.updateLiveScore();
    });

    i18n.onLanguageChange(() => {
      this.updateStep3SectorUI();
    });
  }

  updateLiveMaterialsSum() {
    const total = this.formData.materials.reduce((acc, m) => acc + (parseFloat(m.pct) || 0), 0);
    const badge = document.getElementById('materials-sum-badge');
    const errEl = document.getElementById('step-2-error');

    if (badge) {
      badge.textContent = `${total}%`;
      if (total === 100) {
        badge.className = "text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
        if (errEl) errEl.classList.add('hidden');
      } else {
        badge.className = "text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400";
      }
    }
    return total;
  }

  updateToolOptionCards(selectedVal) {
    document.querySelectorAll('.tool-option-card').forEach(card => {
      const val = card.getAttribute('data-tool-val');
      const isSelected = val === selectedVal;
      const indicator = card.querySelector('.radio-indicator');
      const dot = card.querySelector('.dot');
      let checkIcon = card.querySelector('.icon-svg');

      if (isSelected) {
        card.className = "tool-option-card active w-full p-3.5 rounded-2xl border-2 transition flex items-center justify-between text-left border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-xs active:scale-[0.99]";
        if (indicator) indicator.className = "radio-indicator w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0";
        if (dot) dot.className = "dot w-2.5 h-2.5 rounded-full bg-emerald-500 block";
        if (!checkIcon) {
          const checkEl = document.createElement('span');
          checkEl.className = "icon-svg w-4 h-4 text-emerald-500 shrink-0";
          checkEl.innerHTML = '<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>';
          card.appendChild(checkEl);
        }
      } else {
        card.className = "tool-option-card w-full p-3.5 rounded-2xl border transition flex items-center justify-between text-left border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] hover:border-emerald-500/40 active:scale-[0.99]";
        if (indicator) indicator.className = "radio-indicator w-5 h-5 rounded-full border-2 border-slate-300 dark:border-white/20 flex items-center justify-center shrink-0";
        if (dot) dot.className = "dot w-2.5 h-2.5 rounded-full bg-emerald-500 hidden";
        if (checkIcon) checkIcon.remove();
      }
    });
  }

  updateLiveScore() {
    const disassembly_tools = document.getElementById('wizard-tools')?.value || 'tools_standard';
    const repair_duration_yrs = document.getElementById('wizard-duration')?.value || 5;
    const category = document.getElementById('wizard-category')?.value || 'textile';

    const score = ComplianceCalculator.calculateRepairScore({
      disassembly_tools,
      repair_duration_yrs,
      category
    });

    const scoreEl = document.getElementById('wizard-calculated-score');
    if (scoreEl) scoreEl.textContent = `${score} / 10`;
  }

  updateStep3SectorUI() {
    const category = this.formData.category || 'textile';
    const titleEl = document.getElementById('wizard-tools-title');
    const durationLabelEl = document.getElementById('wizard-duration-label');
    const cardNoneText = document.getElementById('tool-text-none');
    const cardStdText = document.getElementById('tool-text-standard');
    const cardSpecText = document.getElementById('tool-text-specialized');

    const key = (sub) => `wizard:sector_repair.${category}_${sub}`;
    const fallback = (sub, def) => i18n.t(key(sub), def);

    if (titleEl) titleEl.textContent = fallback('title', i18n.t('wizard:fields.disassembly_tools', 'Herramientas para Desmontar'));
    if (durationLabelEl) durationLabelEl.textContent = fallback('duration', i18n.t('wizard:fields.repair_duration_yrs', 'Disponibilidad de Repuestos (Años)'));
    if (cardNoneText) cardNoneText.textContent = fallback('none', i18n.t('wizard:tools.none', 'Sin herramientas (Fijación por presión/clips)'));
    if (cardStdText) cardStdText.textContent = fallback('standard', i18n.t('wizard:tools.standard', 'Herramientas estándar (Destornillador / Allen)'));
    if (cardSpecText) cardSpecText.textContent = fallback('specialized', i18n.t('wizard:tools.specialized', 'Herramientas especializadas o propietarias'));
  }

  renderStep() {
    // Scroll body container back to top on step transition
    const scrollBody = document.getElementById('wizard-body-scroll');
    if (scrollBody) {
      scrollBody.scrollTop = 0;
    }

    // Hide all steps, show current
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepEl = document.getElementById(`wizard-step-${i}`);
      if (stepEl) {
        if (i === this.currentStep) stepEl.classList.remove('hidden');
        else stepEl.classList.add('hidden');
      }
    }

    // Step indicators
    document.querySelectorAll('.step-indicator').forEach((el, index) => {
      if (index + 1 === this.currentStep) {
        el.className = "step-indicator h-2.5 w-10 rounded-full bg-emerald-500 transition-all";
      } else if (index + 1 < this.currentStep) {
        el.className = "step-indicator h-2.5 w-4 rounded-full bg-emerald-500/40 transition-all";
      } else {
        el.className = "step-indicator h-2.5 w-4 rounded-full bg-slate-200 dark:bg-white/10 transition-all";
      }
    });

    // Buttons
    const prevBtn = document.getElementById('btn-wizard-prev');
    const nextBtn = document.getElementById('btn-wizard-next');

    if (this.currentStep === 1) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }

    if (this.currentStep === this.totalSteps) {
      nextBtn.innerHTML = `
        <span class="icon-svg w-4 h-4"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"/></svg></span>
        <span>${i18n.t('common:buttons.finish')}</span>`;
      this.renderReviewSummary();
    } else {
      nextBtn.innerHTML = `
        <span>${i18n.t('common:buttons.next')}</span>
        <span class="icon-svg w-4 h-4"><svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg></span>`;
    }

    if (this.currentStep === 2) {
      this.renderMaterialsList();
      this.updateLiveMaterialsSum();
    }

    if (this.currentStep === 3) {
      this.updateStep3SectorUI();
      this.updateToolOptionCards(this.formData.disassembly_tools || 'tools_standard');
      this.updateLiveScore();
    }
  }

  renderMaterialsList() {
    const container = document.getElementById('wizard-materials-inputs');
    if (!container) return;

    container.innerHTML = this.formData.materials.map((m, idx) => `
      <div class="flex gap-2 items-center">
        <input type="text" placeholder="Material (ej. Algodón Orgánico)" value="${m.name}" 
               class="glass-input flex-1 py-2 px-3 rounded-xl text-xs" 
               oninput="window._updateMatName(${idx}, this.value)" />
        <input type="number" placeholder="%" value="${m.pct}" min="1" max="100" 
               class="glass-input w-20 py-2 px-2 rounded-xl text-xs text-center font-mono" 
               oninput="window._updateMatPct(${idx}, this.value)" />
        ${this.formData.materials.length > 1 ? `
          <button type="button" onclick="window._removeMat(${idx})" class="text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 p-2 min-h-[36px] min-w-[36px] rounded-xl transition flex items-center justify-center" title="Eliminar material">
            <span class="icon-svg w-4 h-4"><svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg></span>
          </button>
        ` : ''}
      </div>
    `).join('');

    window._updateMatName = (idx, val) => {
      this.formData.materials[idx].name = val;
    };
    window._updateMatPct = (idx, val) => {
      this.formData.materials[idx].pct = parseFloat(val) || 0;
      this.updateLiveMaterialsSum();
    };
    window._removeMat = (idx) => {
      this.formData.materials.splice(idx, 1);
      this.renderMaterialsList();
      this.updateLiveMaterialsSum();
    };
  }

  validateStep1() {
    const name = document.getElementById('wizard-name')?.value.trim();
    const gtin = document.getElementById('wizard-gtin')?.value.trim();
    const errEl = document.getElementById('step-1-error');

    if (!name) {
      if (errEl) {
        errEl.textContent = i18n.t('wizard:validation.name_required', 'Por favor, ingresa el nombre del producto.');
        errEl.classList.remove('hidden');
      }
      return false;
    }

    // GS1 GTIN Modulo 10 Check Digit Validation
    const gtinCheck = GS1Formatter.validateGTIN(gtin);
    if (!gtinCheck.isValid) {
      if (errEl) {
        if (gtinCheck.error === 'gtin_check_digit_mismatch') {
          errEl.textContent = (i18n.t('wizard:validation.gtin_check_digit_error', 'Dígito de control GS1 inválido. Para este código, el último dígito debe ser {expected} (ingresaste {actual}).')).replace('{expected}', gtinCheck.expectedCheckDigit).replace('{actual}', gtinCheck.actualCheckDigit);
        } else if (gtinCheck.error === 'gtin_invalid_length') {
          errEl.textContent = i18n.t('wizard:validation.gtin_invalid', 'El GTIN debe tener 8, 12, 13 o 14 dígitos numéricos.');
        } else {
          errEl.textContent = i18n.t('wizard:validation.gtin_numeric_error', 'Por favor, ingresa un código GTIN numérico válido.');
        }
        errEl.classList.remove('hidden');
      }
      return false;
    }

    if (errEl) errEl.classList.add('hidden');
    return true;
  }

  validateStep2() {
    const total = this.updateLiveMaterialsSum();
    const errEl = document.getElementById('step-2-error');

    if (total !== 100) {
      if (errEl) {
        errEl.textContent = (i18n.t('wizard:validation.materials_sum_error', 'La suma de materiales debe ser exactamente 100% (actual: {sum}%).')).replace('{sum}', total);
        errEl.classList.remove('hidden');
      }
      return false;
    }

    // Check empty names
    const hasEmpty = this.formData.materials.some(m => !m.name.trim());
    if (hasEmpty) {
      if (errEl) {
        errEl.textContent = i18n.t('wizard:validation.materials_empty_error', 'Por favor, completa el nombre de todos los materiales.');
        errEl.classList.remove('hidden');
      }
      return false;
    }

    if (errEl) errEl.classList.add('hidden');
    return true;
  }

  validateStep4() {
    const consent = document.getElementById('wizard-legal-consent');
    const errEl = document.getElementById('step-4-error');
    if (consent && !consent.checked) {
      if (errEl) {
        errEl.textContent = i18n.t('wizard:validation.legal_consent_required', 'Debes certificar la titularidad de los derechos y aceptar la exención regulatoria para continuar.');
        errEl.classList.remove('hidden');
      }
      return false;
    }
    if (errEl) errEl.classList.add('hidden');
    return true;
  }

  async nextStep() {
    if (this.currentStep === 1 && !this.validateStep1()) {
      return;
    }
    if (this.currentStep === 2 && !this.validateStep2()) {
      return;
    }
    if (this.currentStep === 4 && !this.validateStep4()) {
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderStep();
    } else {
      // Finish and Save
      await this.savePassport();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep();
    }
  }

  renderReviewSummary() {
    const name = document.getElementById('wizard-name')?.value || 'Producto sin nombre';
    const gtin = document.getElementById('wizard-gtin')?.value || '7501234567893';
    const origin = document.getElementById('wizard-origin')?.value || 'México';
    const category = document.getElementById('wizard-category')?.value || 'textile';

    document.getElementById('summary-name').textContent = name;
    document.getElementById('summary-gtin').textContent = gtin;
    document.getElementById('summary-origin').textContent = origin;

    // Simulate product payload to calculate real-time QR optical metrics
    const sampleProduct = {
      name,
      gtin,
      serial: 'SN-01',
      category,
      brand: 'Mi Marca',
      repair_score: 9.0,
      carbon_kg: parseFloat(document.getElementById('wizard-co2')?.value) || 2.8,
      materials: this.formData.materials.filter(m => m.name.trim() !== ''),
      origin_country: origin
    };

    const simulatedUrl = GS1Formatter.generateDigitalLink(gtin, 'SN-01', null, sampleProduct, { includeOfflinePayload: true });
    const metrics = GS1Formatter.getQROpticalMetrics(simulatedUrl, 'H');

    const descEl = document.getElementById('wizard-qr-quality-desc');
    const badgeEl = document.getElementById('wizard-qr-quality-badge');

    if (descEl) {
      descEl.textContent = `Etiqueta mín: ${metrics.minPrintLabel} • ${metrics.scannabilitySpeed}`;
    }
    if (badgeEl) {
      badgeEl.textContent = `Matriz ${metrics.matrixSize} (V${metrics.version}) • ECC H`;
    }
  }

  async savePassport() {
    const name = document.getElementById('wizard-name')?.value.trim() || 'Nuevo Producto Sostenible';
    const gtin = document.getElementById('wizard-gtin')?.value.trim() || GS1Formatter.generateValidGTIN('750');
    const serial = `SN-${Math.floor(1000 + Math.random() * 9000)}`;
    const category = document.getElementById('wizard-category')?.value || 'textile';
    const origin = document.getElementById('wizard-origin')?.value || 'México';
    const disassembly_tools = document.getElementById('wizard-tools')?.value || 'tools_standard';
    const repair_duration_yrs = parseInt(document.getElementById('wizard-duration')?.value) || 5;
    const carbon_kg = parseFloat(document.getElementById('wizard-co2')?.value) || 2.8;
    const manufacturing_date = new Date().toISOString().split('T')[0];
    const passport_urn = `urn:espr:eu:2026:${gtin}:${serial}`;
    const hs_code = ComplianceCalculator.getDefaultHsCode(category);
    const materials = this.formData.materials.filter(m => m.name.trim() !== '');

    // Extract sector-specific fields
    const battery_chemistry = document.getElementById('wizard-bat-chem')?.value || (category === 'battery' ? 'Li-Ion (NMC)' : '');
    const battery_capacity = document.getElementById('wizard-bat-cap')?.value || (category === 'battery' ? '75 kWh' : '');
    const battery_recycled_metals = category === 'battery' ? {
      cobalt_pct: parseFloat(document.getElementById('wizard-bat-co')?.value) || 18,
      lithium_pct: parseFloat(document.getElementById('wizard-bat-li')?.value) || 8,
      nickel_pct: parseFloat(document.getElementById('wizard-bat-ni')?.value) || 8
    } : null;

    const inci_ingredients = document.getElementById('wizard-cosm-inci')?.value || '';
    const pao_months = parseInt(document.getElementById('wizard-cosm-pao')?.value) || 12;
    const allergens = document.getElementById('wizard-cosm-alg')?.value || '';

    const food_batch = document.getElementById('wizard-food-batch')?.value || '';
    const food_expiry = document.getElementById('wizard-food-exp')?.value || '';
    const food_temp = document.getElementById('wizard-food-temp')?.value || '';
    const food_certifications = document.getElementById('wizard-food-certs')?.value || '';

    const epd_number = document.getElementById('wizard-epd-num')?.value || '';
    const structural_lifespan_yrs = parseInt(document.getElementById('wizard-struct-life')?.value) || 50;

    const repair_score = ComplianceCalculator.calculateRepairScore({
      disassembly_tools,
      repair_duration_yrs,
      category
    });

    // Real client-side cryptographic signature (ECDSA P-256 + SHA-256)
    const cryptoProof = await cryptoEngine.signPassport({
      gtin,
      serial,
      passport_urn,
      hs_code,
      origin_country: origin,
      carbon_kg,
      repair_score,
      materials,
      manufacturing_date
    });

    const newProduct = {
      id: `prod_${Date.now()}`,
      gtin,
      serial,
      name,
      category,
      brand: 'Mi Marca PyME',
      origin_country: origin,
      assembly_country: origin,
      manufacturing_date,
      hs_code,
      passport_urn,
      carbon_kg,
      water_liters: 120,
      repair_score,
      repair_duration_yrs,
      disassembly_tools,
      materials,
      certifications: ["EU ESPR Verified", "PassQ Certified", "CE Compliant"],
      // Sector-specific metadata
      ...(category === 'battery' && { battery_chemistry, battery_capacity, battery_recycled_metals }),
      ...(category === 'cosmetics' && { inci_ingredients, pao_months, allergens }),
      ...(category === 'food' && { food_batch, food_expiry, food_temp, food_certifications }),
      ...(category === 'construction' && { epd_number, structural_lifespan_yrs }),
      repair_guide: storage.constructor?.getDefaultRepairGuide ? storage.constructor.getDefaultRepairGuide(category, disassembly_tools) : [
        { step: 1, title: "Mantenimiento Preventivo y Limpieza", time: "5 min", difficulty: "easy", tools: "Lavado / paño suave" },
        { step: 2, title: "Sustitución de Piezas de Desgaste", time: "10 min", difficulty: "easy", tools: "Herramientas estándar" }
      ],
      recycling_instructions: document.getElementById('wizard-recycling')?.value || "Apto para reciclaje en centros de acopio autorizados.",
      signature: cryptoProof.signature,
      signature_raw: cryptoProof.signature_raw,
      signature_algorithm: cryptoProof.signature_algorithm,
      signature_timestamp: cryptoProof.signature_timestamp,
      canonical_sha256: cryptoProof.canonical_sha256,
      public_key: cryptoProof.public_key
    };

    storage.save(newProduct);
    this.close();
    if (this.onSuccess) this.onSuccess(newProduct);
  }
}

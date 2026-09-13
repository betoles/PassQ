/**
 * PassQ Google Play Billing & 7-Day Free Trial Engine
 * 100% Google Play Console Subscriptions & Digital Goods API Integration
 */

import { i18n } from '../i18n/i18n.js';
import { Icons } from '../icons/icons.js';

export const PLAY_SUBSCRIPTIONS = [
  {
    id: 'passq_starter_monthly',
    nameKey: 'starter',
    price: '$19.99 USD',
    period: '/ mes',
    trialDays: 7,
  },
  {
    id: 'passq_growth_monthly',
    nameKey: 'growth',
    price: '$39.99 USD',
    period: '/ mes',
    recommended: true,
    trialDays: 7,
  },
  {
    id: 'passq_scale_monthly',
    nameKey: 'scale',
    price: '$99.99 USD',
    period: '/ mes',
    trialDays: 7,
  }
];

export class PlayBillingManager {
  constructor() {
    this.initTrial();
  }

  initTrial() {
    if (typeof window === 'undefined') return;
    let trialStart = localStorage.getItem('passq_trial_start');
    if (!trialStart) {
      trialStart = Date.now().toString();
      localStorage.setItem('passq_trial_start', trialStart);
    }
  }

  getTrialStatus() {
    if (typeof window === 'undefined') {
      return { day: 1, daysRemaining: 7, isTrialActive: true, isSubscribed: false };
    }

    const isSubscribed = localStorage.getItem('passq_play_subscription_active') === 'true';
    const activePlan = localStorage.getItem('passq_play_subscription_plan') || 'growth';

    let trialStart = localStorage.getItem('passq_trial_start');
    if (!trialStart) {
      trialStart = Date.now().toString();
      localStorage.setItem('passq_trial_start', trialStart);
    }

    const elapsedMs = Date.now() - parseInt(trialStart, 10);
    const dayNumber = Math.min(7, Math.max(1, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1));
    const daysRemaining = Math.max(0, 7 - Math.floor(elapsedMs / (1000 * 60 * 60 * 24)));
    const isTrialActive = daysRemaining > 0;

    return {
      day: dayNumber,
      daysRemaining,
      isTrialActive,
      isSubscribed,
      activePlan,
      isAccessGranted: isTrialActive || isSubscribed
    };
  }

  async launchGooglePlayPurchase(sku = 'passq_growth_monthly') {
    // 1. Check if running inside Google Play TWA with Digital Goods API
    if ('getDigitalGoodsService' in window) {
      try {
        const service = await window.getDigitalGoodsService('https://play.google.com/billing');
        if (service) {
          const details = await service.getDetails([sku]);
          if (details && details.length > 0) {
            const paymentMethodData = [{
              supportedMethods: 'https://play.google.com/billing',
              data: { sku }
            }];
            const request = new PaymentRequest(paymentMethodData);
            const response = await request.show();
            await response.complete('success');
            
            localStorage.setItem('passq_play_subscription_active', 'true');
            localStorage.setItem('passq_play_subscription_plan', sku);
            return { success: true, method: 'digital_goods_api' };
          }
        }
      } catch (err) {
        console.warn('Google Play Digital Goods API flow:', err);
      }
    }

    // 2. Fallback / Web redirection to Google Play Console Subscriptions
    const playStoreUrl = 'https://play.google.com/store/account/subscriptions';
    window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
    return { success: true, method: 'play_store_external' };
  }
}

export class PlaySubscriptionModal {
  constructor() {
    this.modalEl = null;
    this.isOpen = false;
    this.billing = new PlayBillingManager();
    this.selectedPlan = 'passq_growth_monthly';
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#btn-open-subscription-modal, [data-open-subscription-modal]');
      if (trigger) {
        e.preventDefault();
        const plan = trigger.getAttribute('data-plan') || 'passq_growth_monthly';
        this.open(plan);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Reactive language change listener
    i18n.onLanguageChange(async () => {
      if (this.isOpen) {
        await i18n.loadNamespaces(['common']);
        this.render();
      }
    });
  }

  async open(planId = 'passq_growth_monthly') {
    this.selectedPlan = planId;
    await i18n.loadNamespaces(['common']);
    this.isOpen = true;
    this.render();
    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.isOpen = false;
    if (this.modalEl) {
      this.modalEl.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        if (!this.isOpen && this.modalEl) {
          this.modalEl.remove();
          this.modalEl = null;
        }
      }, 200);
    }
    document.body.classList.remove('overflow-hidden');
  }

  render() {
    let container = document.getElementById('passq-subscription-modal-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'passq-subscription-modal-root';
      document.body.appendChild(container);
    }
    this.modalEl = container;

    const trial = this.billing.getTrialStatus();

    // Localized dynamic texts
    const badgeText = i18n.t('common:billing.badge', 'Google Play Billing • 7 Días de Prueba Gratis');
    const titleText = i18n.t('common:billing.title', 'Suscripción Oficial en Google Play');
    const subtitleText = i18n.t('common:billing.subtitle', 'Todos los cobros, renovaciones y cancelaciones son administrados 100% por Google Play Console. Sin sorpresas, cancela cuando quieras con 1 clic en tu cuenta de Google.');
    const trialBadgeText = i18n.t('common:billing.trial_badge', '7D');
    const trialActiveTemplate = i18n.t('common:billing.trial_status_active', 'Estado de Prueba Actual: Día {day} de 7 ({remaining} días restantes)');
    const trialEndedText = i18n.t('common:billing.trial_status_ended', 'Prueba Concluida');
    const trialStatusLabel = trial.isTrialActive 
      ? trialActiveTemplate.replace('{day}', trial.day).replace('{remaining}', trial.daysRemaining)
      : trialEndedText;
    const trialDescText = i18n.t('common:billing.trial_desc', 'Tienes acceso completo e ilimitado a todas las herramientas Pro. Al suscribirte ahora, no se te cobrará nada hasta terminar tus 7 días de prueba.');
    const founderRateText = i18n.t('common:billing.founder_rate', 'Tarifa Fundador');
    const daysFreeText = i18n.t('common:billing.features.days_free', '✓ 7 Días Gratis');
    const playBillingFeatureText = i18n.t('common:billing.features.play_billing', '✓ Google Play Billing');
    const guaranteesTitle = i18n.t('common:billing.guarantees_title', 'Garantías de Google Play:');
    const guarantee1 = i18n.t('common:billing.guarantee_1', 'Facturación oficial respaldada por Google Play Store con comprobante fiscal.');
    const guarantee2Prefix = i18n.t('common:billing.guarantee_2_prefix', 'Cancelación en cualquier momento desde ');
    const guarantee2Link = i18n.t('common:billing.guarantee_2_link', 'Google Play Subscriptions');
    const guarantee2Suffix = i18n.t('common:billing.guarantee_2_suffix', ' con 1 solo toque.');
    const guarantee3 = i18n.t('common:billing.guarantee_3', 'Cero almacenamiento de tarjetas bancarias en servidores de PassQ.');
    const btnSubscribeMain = i18n.t('common:billing.btn_subscribe_main', 'Continuar con Google Play');
    const btnSubscribeSub = i18n.t('common:billing.btn_subscribe_sub', '(7 Días Gratis)');
    const btnCloseText = i18n.t('common:buttons.close', 'Cerrar');

    container.className = 'fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md transition-opacity duration-200';
    container.innerHTML = `
      <div id="subscription-modal-backdrop" class="absolute inset-0"></div>

      <div class="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200 dark:border-white/15 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-5">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-wide">
            <span class="w-4 h-4 flex items-center">${Icons.googlePlay ? Icons.googlePlay('w-4 h-4') : '▶'}</span>
            <span>${badgeText}</span>
          </div>

          <button id="btn-close-sub-modal" type="button" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 flex items-center justify-center transition cursor-pointer" aria-label="${btnCloseText}">
            ${Icons.close ? Icons.close('w-5 h-5') : '✕'}
          </button>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-1">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>${titleText}</span>
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            ${subtitleText}
          </p>
        </div>

        <!-- 7-Day Trial Highlight Banner -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 font-black shadow-md shadow-emerald-500/20">
            ${trialBadgeText}
          </div>
          <div class="text-xs sm:text-sm">
            <div class="font-extrabold text-slate-900 dark:text-white">${trialStatusLabel}</div>
            <div class="text-slate-600 dark:text-slate-300 mt-0.5 font-medium">${trialDescText}</div>
          </div>
        </div>

        <!-- Plan Selection Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          ${PLAY_SUBSCRIPTIONS.map(plan => {
            const isSelected = this.selectedPlan === plan.id;
            const planName = i18n.t(`common:billing.plans.${plan.nameKey}.name`, plan.nameKey.toUpperCase());
            const planLimit = i18n.t(`common:billing.plans.${plan.nameKey}.limit`, 'PassQ Pro');
            return `
              <div data-plan-select="${plan.id}" class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative select-none ${
                isSelected 
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10' 
                  : 'border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20'
              }">
                ${plan.recommended ? `
                  <span class="absolute -top-2.5 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                    ${founderRateText}
                  </span>
                ` : ''}
                <div class="space-y-1.5">
                  <div class="text-xs font-black uppercase text-slate-500 dark:text-slate-400">${planName}</div>
                  <div class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${plan.price}</div>
                  <div class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">${planLimit}</div>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-300 font-medium space-y-1">
                  <div>${daysFreeText}</div>
                  <div>${playBillingFeatureText}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Google Play Guarantees -->
        <div class="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
          <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span class="w-4 h-4 text-emerald-500">${Icons.shieldCheck ? Icons.shieldCheck('w-4 h-4') : '✓'}</span>
            <span>${guaranteesTitle}</span>
          </div>
          <ul class="list-disc pl-5 space-y-1 leading-relaxed text-[11.5px]">
            <li>${guarantee1}</li>
            <li>${guarantee2Prefix}<a href="https://play.google.com/store/account/subscriptions" target="_blank" class="text-emerald-500 underline font-bold">${guarantee2Link}</a>${guarantee2Suffix}</li>
            <li>${guarantee3}</li>
          </ul>
        </div>

        <!-- Primary CTA Button -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button id="btn-confirm-play-subscribe" type="button" class="flex-1 min-h-[58px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/35 transition active:scale-[0.98] flex items-center justify-center gap-3.5 cursor-pointer">
            <span class="w-6 h-6 flex items-center shrink-0">${Icons.googlePlay ? Icons.googlePlay('w-6 h-6') : '▶'}</span>
            <div class="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
              <span class="font-black text-sm sm:text-base tracking-tight">${btnSubscribeMain}</span>
              <span class="text-xs sm:text-[13px] font-extrabold text-emerald-100 opacity-95">${btnSubscribeSub}</span>
            </div>
          </button>

          <button id="btn-cancel-sub-modal" type="button" class="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-sm transition cursor-pointer">
            ${btnCloseText}
          </button>
        </div>

      </div>
    `;

    // Wire events
    container.querySelector('#subscription-modal-backdrop')?.addEventListener('click', () => this.close());
    container.querySelector('#btn-close-sub-modal')?.addEventListener('click', () => this.close());
    container.querySelector('#btn-cancel-sub-modal')?.addEventListener('click', () => this.close());

    container.querySelectorAll('[data-plan-select]').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedPlan = card.getAttribute('data-plan-select');
        this.render();
      });
    });

    container.querySelector('#btn-confirm-play-subscribe')?.addEventListener('click', async () => {
      await this.billing.launchGooglePlayPurchase(this.selectedPlan);
      this.close();
    });
  }
}

export const playBilling = new PlayBillingManager();
export const playSubscriptionModal = new PlaySubscriptionModal();

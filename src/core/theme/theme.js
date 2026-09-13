/**
 * PassQ Theme & UI Engine (Glassmorphism Dark & Light Modes & Encapsulated Dropdowns)
 */

import { Icons } from '../icons/icons.js';
import { i18n } from '../i18n/i18n.js';
import { userGuideModal } from '../../modules/guide/guide.js';
import { playBilling, playSubscriptionModal } from '../billing/play-billing.js';

export const LANGUAGES = [
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'de', short: 'DE', name: 'Deutsch' },
  { code: 'fr', short: 'FR', name: 'Français' },
  { code: 'it', short: 'IT', name: 'Italiano' },
  { code: 'pt', short: 'PT', name: 'Português' },
  { code: 'zh', short: 'ZH', name: '中文' },
];

export class LanguageDropdown {
  constructor(target = '#lang-select') {
    this.target = typeof target === 'string' ? document.querySelector(target) : target;
    this.container = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    const existing = document.getElementById('custom-lang-dropdown-wrapper');
    if (existing) {
      this.container = existing;
      this.updateActiveState(i18n.currentLanguage);
      return;
    }

    if (!this.target) return;
    
    // Target's parent is the wrapper container (.flex.items-center...)
    const wrapper = this.target.parentElement;
    if (!wrapper || !wrapper.parentElement) return;

    this.container = document.createElement('div');
    this.container.className = 'relative inline-block text-left z-50 shrink-0';
    this.container.id = 'custom-lang-dropdown-wrapper';

    wrapper.parentElement.replaceChild(this.container, wrapper);

    this.render();
    this.setupListeners();

    i18n.onLanguageChange((newLang) => {
      this.updateActiveState(newLang);
    });
  }

  render() {
    const currentLang = i18n.currentLanguage || 'es';
    const activeItem = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
    const flagSvg = Icons[`flag_${activeItem.code}`] ? Icons[`flag_${activeItem.code}`]('w-4 h-3 rounded-xs shadow-xs shrink-0') : '';

    this.container.innerHTML = `
      <!-- Encapsulated Trigger Button -->
      <button id="custom-lang-btn" type="button" class="h-10 sm:h-11 px-2.5 sm:px-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 active:scale-95 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2 transition cursor-pointer select-none shrink-0 whitespace-nowrap" aria-haspopup="true" aria-expanded="false">
        <span id="custom-lang-current-flag" class="flex items-center shrink-0">${flagSvg}</span>
        <span id="custom-lang-current-label" class="text-xs sm:text-sm font-bold uppercase tracking-wider">${activeItem.short}</span>
        <span class="icon-svg w-3.5 h-3.5 text-slate-400 transition-transform duration-200" id="custom-lang-chevron">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
        </span>
      </button>

      <!-- Anchored Absolute Dropdown Menu (Anchored to right, expanding to left) -->
      <div id="custom-lang-menu" class="hidden opacity-0 scale-95 transition-all duration-150 ease-out absolute right-0 top-full mt-2 w-48 sm:w-52 p-1.5 rounded-2xl bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200/90 dark:border-white/15 shadow-2xl backdrop-blur-2xl z-[9999] origin-top-right">
        <div class="space-y-1" role="menu" aria-orientation="vertical">
          ${LANGUAGES.map(lang => {
            const isSelected = lang.code === currentLang;
            const itemFlag = Icons[`flag_${lang.code}`] ? Icons[`flag_${lang.code}`]('w-4 h-3 rounded-xs shadow-xs shrink-0') : '';
            return `
              <button type="button" data-lang-code="${lang.code}" class="lang-option-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer select-none ${
                isSelected 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20' 
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
              }">
                <div class="flex items-center gap-2.5">
                  <span class="flex items-center shrink-0">${itemFlag}</span>
                  <span>${lang.name}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] font-mono uppercase font-bold text-slate-400 dark:text-slate-500">${lang.short}</span>
                  ${isSelected ? `
                    <span class="icon-svg w-3.5 h-3.5 text-emerald-500">
                      <svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                    </span>
                  ` : ''}
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  setupListeners() {
    const btn = this.container.querySelector('#custom-lang-btn');
    const menu = this.container.querySelector('#custom-lang-menu');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Event delegation on menu: permanent across all language updates
    menu.addEventListener('click', (e) => {
      const optBtn = e.target.closest('.lang-option-btn');
      if (!optBtn) return;
      e.stopPropagation();
      const code = optBtn.getAttribute('data-lang-code');
      if (code) {
        i18n.setLanguage(code);
        this.closeMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.container.contains(e.target)) {
        this.closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) this.closeMenu();
    else this.openMenu();
  }

  openMenu() {
    const menu = this.container?.querySelector('#custom-lang-menu');
    const chevron = this.container?.querySelector('#custom-lang-chevron');
    const btn = this.container?.querySelector('#custom-lang-btn');
    if (!menu) return;

    this.isOpen = true;
    if (this.container) {
      this.container.style.zIndex = '9999';
    }
    const headerParent = this.container.closest('header') || this.container.closest('.glass-card');
    if (headerParent) {
      headerParent.style.zIndex = '999';
    }

    menu.classList.remove('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'true');

    requestAnimationFrame(() => {
      // Viewport overflow guard
      const rect = menu.getBoundingClientRect();
      if (rect.left < 8) {
        menu.classList.remove('right-0', 'origin-top-right');
        menu.classList.add('left-0', 'origin-top-left');
      } else if (rect.right > window.innerWidth - 8) {
        menu.classList.remove('left-0', 'origin-top-left');
        menu.classList.add('right-0', 'origin-top-right');
      }

      menu.classList.remove('opacity-0', 'scale-95');
      menu.classList.add('opacity-100', 'scale-100');
      if (chevron) chevron.classList.add('rotate-180');
    });
  }

  closeMenu() {
    const menu = this.container?.querySelector('#custom-lang-menu');
    const chevron = this.container?.querySelector('#custom-lang-chevron');
    const btn = this.container?.querySelector('#custom-lang-btn');
    if (!menu) return;

    this.isOpen = false;
    if (btn) btn.setAttribute('aria-expanded', 'false');
    menu.classList.remove('opacity-100', 'scale-100');
    menu.classList.add('opacity-0', 'scale-95');
    if (chevron) chevron.classList.remove('rotate-180');

    setTimeout(() => {
      if (!this.isOpen) {
        menu.classList.add('hidden');
        if (this.container) {
          this.container.style.zIndex = '';
        }
        const headerParent = this.container?.closest('header') || this.container?.closest('.glass-card');
        if (headerParent) {
          headerParent.style.zIndex = '';
        }
      }
    }, 150);
  }

  updateActiveState(currentLang) {
    const activeItem = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];
    const flagEl = this.container?.querySelector('#custom-lang-current-flag');
    const labelEl = this.container?.querySelector('#custom-lang-current-label');

    if (flagEl && Icons[`flag_${activeItem.code}`]) {
      flagEl.innerHTML = Icons[`flag_${activeItem.code}`]('w-4 h-3 rounded-xs shadow-xs shrink-0');
    }
    if (labelEl) {
      labelEl.textContent = activeItem.short;
    }

    const menu = this.container?.querySelector('#custom-lang-menu > div');
    if (menu) {
      menu.innerHTML = LANGUAGES.map(lang => {
        const isSelected = lang.code === currentLang;
        const itemFlag = Icons[`flag_${lang.code}`] ? Icons[`flag_${lang.code}`]('w-4 h-3 rounded-xs shadow-xs shrink-0') : '';
        return `
          <button type="button" data-lang-code="${lang.code}" class="lang-option-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer select-none ${
            isSelected 
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20' 
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
          }">
            <div class="flex items-center gap-2.5">
              <span class="flex items-center shrink-0">${itemFlag}</span>
              <span>${lang.name}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-mono uppercase font-bold text-slate-400 dark:text-slate-500">${lang.short}</span>
              ${isSelected ? `
                <span class="icon-svg w-3.5 h-3.5 text-emerald-500">
                  <svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
                </span>
              ` : ''}
            </div>
          </button>
        `;
      }).join('');
    }
  }
}

class ThemeEngine {
  constructor() {
    this.currentTheme = localStorage.getItem('passq_theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.updateIconSlots();
          this.initLanguageDropdown();
        });
      } else {
        this.updateIconSlots();
        this.initLanguageDropdown();
      }
    }

    // Register Service Worker globally across all pages and views
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
          console.debug('ServiceWorker registration optional:', err);
        });
      });
    }

    // Listen to OS theme changes if user hasn't set explicit preference
    window.matchMedia?.('(prefers-color-scheme: dark)')?.addEventListener('change', (e) => {
      if (!localStorage.getItem('passq_theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  initLanguageDropdown(selector = '#lang-select') {
    if (typeof document !== 'undefined' && document.querySelector(selector)) {
      new LanguageDropdown(selector);
    }
  }

  updateIconSlots() {
    const isDark = document.documentElement.classList.contains('dark');
    const slots = document.querySelectorAll('#theme-icon-slot, [data-theme-icon]');
    slots.forEach((slot) => {
      slot.innerHTML = isDark ? Icons.sun('w-5 h-5') : Icons.moon('w-5 h-5');
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('passq_theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }

    this.updateIconSlots();
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    return nextTheme;
  }
}

export class ContactModal {
  constructor() {
    this.modalEl = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    // Delegate click events for opening modal across entire document
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#btn-open-contact-modal, [data-open-contact-modal]');
      if (trigger) {
        e.preventDefault();
        this.open();
      }
    });

    // Keyboard ESC listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Language change listener
    i18n.onLanguageChange(() => {
      if (this.isOpen) {
        this.render();
      }
    });
  }

  async open() {
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
    let container = document.getElementById('passq-contact-modal-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'passq-contact-modal-root';
      document.body.appendChild(container);
    }
    this.modalEl = container;

    const title = i18n.t('contact_modal.title', 'Contacto & Sugerencias');
    const badge = i18n.t('contact_modal.badge', 'Escucha Activa del Usuario');
    const subtitle = i18n.t('contact_modal.subtitle', '¡Tu opinión impulsa la evolución continua de PassQ!');
    const message = i18n.t('contact_modal.message', 'Estamos en la mejor disposición de escuchar a los usuarios, aprender de tu experiencia y adaptar la plataforma a tus necesidades reales. Envíanos tus comentarios, dudas, sugerencias de mejora o solicitudes de funciones.');
    const emailLabel = i18n.t('contact_modal.email_label', 'Canal Oficial de Contacto:');
    const emailAddress = i18n.t('contact_modal.email_address', 'passq-reportes@outlook.com');
    const btnSend = i18n.t('contact_modal.btn_send_email', 'Enviar Correo Directo');
    const btnCopy = i18n.t('contact_modal.btn_copy_email', 'Copiar Dirección');
    const responseTime = i18n.t('contact_modal.response_time', 'Respuesta habitual en menos de 72 horas hábiles.');
    const mailSubject = encodeURIComponent(i18n.t('contact_modal.mail_subject', 'Comentarios y Sugerencias de Mejora • PassQ'));
    const mailBody = encodeURIComponent(i18n.t('contact_modal.mail_body', 'Hola equipo de PassQ,\n\nMe gustaría compartir los siguientes comentarios y sugerencias para adaptar la plataforma a mis necesidades:\n\n'));

    const mailtoHref = `mailto:${emailAddress}?subject=${mailSubject}&body=${mailBody}`;

    container.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-opacity duration-200';
    container.innerHTML = `
      <!-- Backdrop Click Catch -->
      <div id="contact-modal-backdrop" class="absolute inset-0"></div>

      <!-- Modal Card -->
      <div class="relative w-full max-w-xl max-h-[88vh] max-h-[88dvh] overflow-y-auto overscroll-contain rounded-3xl bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200 dark:border-white/15 shadow-2xl p-5 sm:p-8 backdrop-blur-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-5">
        
        <!-- Header / Close button -->
        <div class="flex items-center justify-between">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide">
            <span class="w-4 h-4 flex items-center">${Icons.chatBubble ? Icons.chatBubble('w-4 h-4') : ''}</span>
            <span>${badge}</span>
          </div>

          <button id="btn-close-contact-modal" type="button" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 flex items-center justify-center transition cursor-pointer" aria-label="Cerrar modal">
            ${Icons.close ? Icons.close('w-5 h-5') : '✕'}
          </button>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-1.5">
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span class="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              ${Icons.envelope ? Icons.envelope('w-5 h-5') : ''}
            </span>
            <span>${title}</span>
          </h2>
          <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">${subtitle}</p>
        </div>

        <!-- Friendly Narrative (Justified) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed text-justify">
          <p>${message}</p>
        </div>

        <!-- Official Email Card -->
        <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">${emailLabel}</div>
            <div id="contact-modal-email-val" class="text-base sm:text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 selection:bg-emerald-200 dark:selection:bg-emerald-800">${emailAddress}</div>
          </div>
          
          <button id="btn-copy-email-action" type="button" class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 cursor-pointer">
            <span id="copy-icon-slot" class="w-4 h-4 flex items-center">${Icons.copy ? Icons.copy('w-4 h-4') : ''}</span>
            <span id="copy-text-slot">${btnCopy}</span>
          </button>
        </div>

        <!-- Action CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <a href="${mailtoHref}" id="btn-send-mail-action" class="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition active:scale-[0.98] cursor-pointer">
            <span class="w-5 h-5 flex items-center">${Icons.envelope ? Icons.envelope('w-5 h-5') : ''}</span>
            <span>${btnSend}</span>
          </a>

          <button id="btn-cancel-contact-modal" type="button" class="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base transition cursor-pointer">
            ${i18n.t('buttons.close', 'Cerrar')}
          </button>
        </div>

        <!-- Response guarantee footer note -->
        <div class="flex items-center justify-center gap-2 text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span class="w-3.5 h-3.5 text-emerald-500 shrink-0">${Icons.shieldCheck ? Icons.shieldCheck('w-3.5 h-3.5') : '✓'}</span>
          <span>${responseTime}</span>
        </div>

      </div>
    `;

    // Wire listeners
    container.querySelector('#contact-modal-backdrop')?.addEventListener('click', () => this.close());
    container.querySelector('#btn-close-contact-modal')?.addEventListener('click', () => this.close());
    container.querySelector('#btn-cancel-contact-modal')?.addEventListener('click', () => this.close());

    const copyBtn = container.querySelector('#btn-copy-email-action');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(emailAddress);
          const iconSlot = container.querySelector('#copy-icon-slot');
          const textSlot = container.querySelector('#copy-text-slot');
          if (iconSlot && textSlot) {
            iconSlot.innerHTML = Icons.checkCircle ? Icons.checkCircle('w-4 h-4 text-emerald-500') : '✓';
            textSlot.textContent = i18n.t('contact_modal.email_copied', '¡Copiado!');
            setTimeout(() => {
              iconSlot.innerHTML = Icons.copy ? Icons.copy('w-4 h-4') : '';
              textSlot.textContent = btnCopy;
            }, 2500);
          }
        } catch (err) {
          console.warn('Clipboard write error:', err);
        }
      });
    }
  }
}

export const contactModal = new ContactModal();
export const theme = new ThemeEngine();
export { userGuideModal, playBilling, playSubscriptionModal };


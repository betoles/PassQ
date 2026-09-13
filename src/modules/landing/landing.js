import '../../styles/glassmorphism.css';
import { i18n } from '../../core/i18n/i18n.js';
import { theme } from '../../core/theme/theme.js';
import { Icons, renderIcons } from '../../core/icons/icons.js';
import { storage } from '../../core/storage/storage.js';
import { GS1Formatter } from '../compliance/gs1.js';
import { userGuideModal } from '../guide/guide.js';
import { playSubscriptionModal } from '../../core/billing/play-billing.js';
import QRCode from 'qrcode';

function updateFlagSlot(lang) {
  const flagSlot = document.getElementById('lang-flag-slot');
  if (flagSlot && Icons[`flag_${lang}`]) {
    flagSlot.innerHTML = Icons[`flag_${lang}`]('w-4 h-3 inline-block rounded-xs shadow-xs align-middle mr-1.5');
  }
}

// Register Service Worker v2 for full PWA offline resilience
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('PassQ SW registration note:', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await i18n.loadNamespaces(['common', 'landing']);
  theme.updateIconSlots();
  renderIcons();

  // Setup language selector
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

  // Setup theme toggle
  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    theme.toggleTheme();
  });

  // Hero QR Code Interactive Network Mode Controller
  let heroQRMode = localStorage.getItem('passq_hero_qr_mode') || 'wifi';

  async function updateHeroQR(mode) {
    heroQRMode = mode;
    localStorage.setItem('passq_hero_qr_mode', mode);

    const btnWifi = document.getElementById('hero-qr-mode-wifi');
    const btnProd = document.getElementById('hero-qr-mode-prod');
    const heroCanvas = document.getElementById('hero-qr-canvas');
    const heroLink = document.getElementById('hero-qr-link');

    const activeClasses = ['bg-emerald-600', 'text-white', 'shadow-xs'];
    const inactiveClasses = ['text-slate-700', 'dark:text-slate-300', 'hover:bg-white/50', 'dark:hover:bg-white/10'];

    if (btnWifi && btnProd) {
      if (mode === 'wifi') {
        btnWifi.classList.add(...activeClasses);
        btnWifi.classList.remove(...inactiveClasses);
        btnProd.classList.remove(...activeClasses);
        btnProd.classList.add(...inactiveClasses);
      } else {
        btnProd.classList.add(...activeClasses);
        btnProd.classList.remove(...inactiveClasses);
        btnWifi.classList.remove(...activeClasses);
        btnWifi.classList.add(...inactiveClasses);
      }
    }

    const baseUrl = GS1Formatter.resolveBaseUrl(null);
    const sampleProduct = storage.getById('prod_001');
    const demoUrl = GS1Formatter.generateDigitalLink('7501234567893', '0842-MX', baseUrl, sampleProduct);

    if (heroLink) {
      heroLink.href = demoUrl;
    }

    if (heroCanvas) {
      await QRCode.toCanvas(heroCanvas, demoUrl, {
        width: 180,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    }
  }

  document.getElementById('hero-qr-mode-wifi')?.addEventListener('click', () => updateHeroQR('wifi'));
  document.getElementById('hero-qr-mode-prod')?.addEventListener('click', () => updateHeroQR('prod'));

  await updateHeroQR(heroQRMode);

  i18n.translateDOM();
  renderIcons();

  i18n.onLanguageChange(async (newLang) => {
    await i18n.loadNamespaces(['common', 'landing']);
    i18n.translateDOM();
    updateFlagSlot(newLang);
    theme.updateIconSlots();
    renderIcons();
  });
});

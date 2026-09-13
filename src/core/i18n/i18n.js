/**
 * PassQ Modular i18n Engine (Namespaces & Mirror System)
 * Ultra-lightweight: Zero external dependencies, < 2KB.
 * Features: Auto-detection, lazy loading, English fallback shield.
 */

class I18nEngine {
  constructor() {
    this.supportedLanguages = ['en', 'es', 'de', 'fr', 'it', 'pt', 'zh'];
    this.currentLanguage = this.detectLanguage();
    this.cache = {}; // Stores loaded namespaces per language
    this.loadedNamespaces = new Set(['common']);
    this.listeners = [];
  }

  detectLanguage() {
    const saved = localStorage.getItem('passq_lang');
    if (saved && this.supportedLanguages.includes(saved)) {
      return saved;
    }

    const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase();
    if (this.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    return 'en'; // Default global fallback
  }

  async setLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) return;
    this.currentLanguage = lang;
    localStorage.setItem('passq_lang', lang);
    document.documentElement.lang = lang;
    
    // Automatically load all tracked namespaces for the new language BEFORE notifying listeners
    if (this.loadedNamespaces.size > 0) {
      await this.loadNamespaces(Array.from(this.loadedNamespaces));
    }

    // Notify all active views to re-render
    for (const fn of this.listeners) {
      try {
        await fn(lang);
      } catch (err) {
        console.warn('Error in language change listener:', err);
      }
    }
  }

  onLanguageChange(fn) {
    this.listeners.push(fn);
  }

  /**
   * Load only the specific namespaces needed for the current screen (Lazy Loading)
   * @param {string[]} namespaces - e.g. ['common', 'passport']
   */
  async loadNamespaces(namespaces = ['common']) {
    const lang = this.currentLanguage;
    if (!this.cache[lang]) this.cache[lang] = {};
    if (!this.cache['en']) this.cache['en'] = {}; // Always cache English as fallback

    for (const ns of namespaces) {
      this.loadedNamespaces.add(ns);
      if (!this.cache[lang][ns]) {
        try {
          const res = await fetch(`/locales/${lang}/${ns}.json`);
          if (res.ok) {
            this.cache[lang][ns] = await res.json();
          }
        } catch (e) {
          console.warn(`Could not load /locales/${lang}/${ns}.json, falling back to English`);
        }
      }

      // Ensure English fallback exists
      if (lang !== 'en' && !this.cache['en'][ns]) {
        try {
          const res = await fetch(`/locales/en/${ns}.json`);
          if (res.ok) {
            this.cache['en'][ns] = await res.json();
          }
        } catch (e) {
          console.error(`Could not load fallback /locales/en/${ns}.json`);
        }
      }
    }
  }

  /**
   * Translate a key with namespace support (e.g. 'passport:header.title')
   */
  t(path, defaultText = '') {
    if (!path) return defaultText;

    const [namespace, keyPath] = path.includes(':') ? path.split(':') : ['common', path];
    const lang = this.currentLanguage;

    // 1. Try in current language
    let value = this._getValue(this.cache[lang]?.[namespace], keyPath);
    if (value !== undefined) return value;

    // 2. Fallback to English
    value = this._getValue(this.cache['en']?.[namespace], keyPath);
    if (value !== undefined) return value;

    // 3. Return default text or key path
    return defaultText || keyPath;
  }

  _getValue(obj, keyPath) {
    if (!obj) return undefined;
    return keyPath.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  /**
   * Automatically translate all DOM elements with data-i18n attributes
   */
  translateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      el.setAttribute('aria-label', this.t(el.getAttribute('data-i18n-aria-label')));
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.getAttribute('data-i18n-html'));
    });
  }
}

export const i18n = new I18nEngine();

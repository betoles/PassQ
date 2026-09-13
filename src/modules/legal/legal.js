import { i18n } from '../../core/i18n/i18n.js';
import { theme, LanguageDropdown } from '../../core/theme/theme.js';
import { Icons, renderIcons } from '../../core/icons/icons.js';

function updateFlagSlot(lang) {
  const flagSlot = document.getElementById('lang-flag-slot');
  if (flagSlot && Icons[`flag_${lang}`]) {
    flagSlot.innerHTML = Icons[`flag_${lang}`]('w-4 h-3 inline-block rounded-xs shadow-xs align-middle mr-1.5');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await i18n.loadNamespaces(['common', 'legal']);
  theme.updateIconSlots();
  renderIcons();

  new LanguageDropdown('#lang-select');

  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    theme.toggleTheme();
  });

  i18n.translateDOM();
  renderIcons();

  i18n.onLanguageChange(async (newLang) => {
    await i18n.loadNamespaces(['common', 'legal']);
    i18n.translateDOM();
    updateFlagSlot(newLang);
    theme.updateIconSlots();
    renderIcons();
  });
});

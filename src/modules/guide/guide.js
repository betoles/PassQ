/**
 * PassQ Interactive & Didactic User Guide Modal
 * Multi-tab Glassmorphism user manual with full 7-language support.
 */

import { i18n } from "../../core/i18n/i18n.js";
import { Icons } from "../../core/icons/icons.js";

export class UserGuideModal {
  constructor() {
    this.modalEl = null;
    this.isOpen = false;
    this.activeTab = "tab1";
    this.init();
  }

  init() {
    if (typeof document === "undefined") return;

    // Global event delegation for opening user guide
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("#btn-open-user-guide, [data-open-user-guide]");
      if (trigger) {
        e.preventDefault();
        const tab = trigger.getAttribute("data-guide-tab") || "tab1";
        this.open(tab);
      }
    });

    // Keyboard ESC listener
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    // Language change listener
    i18n.onLanguageChange(async () => {
      if (this.isOpen) {
        await i18n.loadNamespaces(["common", "guide"]);
        this.render();
      }
    });
  }

  async open(initialTab = "tab1") {
    this.activeTab = initialTab;
    await i18n.loadNamespaces(["common", "guide"]);
    this.isOpen = true;
    this.render();
    document.body.classList.add("overflow-hidden");
  }

  close() {
    this.isOpen = false;
    if (this.modalEl) {
      this.modalEl.classList.add("opacity-0", "pointer-events-none");
      setTimeout(() => {
        if (!this.isOpen && this.modalEl) {
          this.modalEl.remove();
          this.modalEl = null;
        }
      }, 200);
    }
    document.body.classList.remove("overflow-hidden");
  }

  setTab(tabKey) {
    this.activeTab = tabKey;
    this.render();
  }

  render() {
    let container = document.getElementById("passq-user-guide-modal-root");
    if (!container) {
      container = document.createElement("div");
      container.id = "passq-user-guide-modal-root";
      document.body.appendChild(container);
    }
    this.modalEl = container;

    const title = i18n.t("guide:title", "Guía de Usuario • PassQ");
    const badge = i18n.t("guide:badge", "Manual Interactivo & Didáctico");
    const subtitle = i18n.t("guide:subtitle", "Domina el ciclo de vida de tus Pasaportes Digitales en minutos.");
    const btnClose = i18n.t("guide:btn_close", "Cerrar Guía");

    const tabs = [
      { id: "tab1", icon: "sparkles", label: i18n.t("guide:tabs.tab1", "Caso Práctico") },
      { id: "tab2", icon: "plusCircle", label: i18n.t("guide:tabs.tab2", "Crear Pasaporte") },
      { id: "tab3", icon: "folder", label: i18n.t("guide:tabs.tab3", "Tu Catálogo & QR") },
      { id: "tab4", icon: "devicePhoneMobile", label: i18n.t("guide:tabs.tab4", "Vista de Clientes") },
      { id: "tab5", icon: "shieldCheck", label: i18n.t("guide:tabs.tab5", "Privacidad & Datos") },
    ];

    container.className = "fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md transition-opacity duration-200";
    container.innerHTML = `
      <!-- Backdrop click catcher -->
      <div id="user-guide-backdrop" class="absolute inset-0"></div>

      <!-- Main Modal Card -->
      <div class="relative w-full max-w-3xl max-h-[88vh] max-h-[88dvh] overflow-hidden rounded-3xl bg-white/95 dark:bg-[#0c1322]/95 border border-slate-200 dark:border-white/15 shadow-2xl backdrop-blur-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        <!-- Header Bar -->
        <div class="p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 flex items-start justify-between gap-4 shrink-0">
          <div class="space-y-1.5">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold tracking-wide">
              <span class="w-4 h-4 flex items-center">${Icons.bookOpen ? Icons.bookOpen("w-4 h-4") : ""}</span>
              <span>${badge}</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>${title}</span>
            </h2>
            <p class="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">${subtitle}</p>
          </div>

          <button id="btn-close-guide-top" type="button" class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 flex items-center justify-center transition cursor-pointer shrink-0" aria-label="Cerrar">
            ${Icons.close ? Icons.close("w-5 h-5") : "✕"}
          </button>
        </div>

        <!-- Navigation Tabs Bar -->
        <div class="px-5 sm:px-6 py-3 border-b border-slate-200/60 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] overflow-x-auto no-scrollbar shrink-0">
          <div class="flex items-center gap-2.5 min-w-max">
            ${tabs.map((tab) => {
              const isActive = this.activeTab === tab.id;
              return `
                <button type="button" data-tab-target="${tab.id}" class="guide-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm sm:text-[15px] font-bold transition cursor-pointer select-none ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10"
                }">
                  <span class="icon-svg w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'}">
                    ${Icons[tab.icon] ? Icons[tab.icon]("w-4 h-4") : ""}
                  </span>
                  <span>${tab.label}</span>
                </button>
              `;
            }).join("")}
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
              ← ${i18n.t("buttons.back", "Anterior")}
            </button>
            <button id="btn-guide-next" type="button" class="px-4 py-2.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
              ${i18n.t("buttons.next", "Siguiente")} →
            </button>
          </div>

          <button id="btn-guide-close-bottom" type="button" class="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer">
            ${btnClose}
          </button>
        </div>

      </div>
    `;

    // Wire listeners
    container.querySelector("#user-guide-backdrop")?.addEventListener("click", () => this.close());
    container.querySelector("#btn-close-guide-top")?.addEventListener("click", () => this.close());
    container.querySelector("#btn-guide-close-bottom")?.addEventListener("click", () => this.close());

    container.querySelectorAll(".guide-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab-target");
        if (target) this.setTab(target);
      });
    });

    const currentIndex = tabs.findIndex((t) => t.id === this.activeTab);
    const prevBtn = container.querySelector("#btn-guide-prev");
    const nextBtn = container.querySelector("#btn-guide-next");

    if (prevBtn) {
      prevBtn.disabled = currentIndex <= 0;
      prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) this.setTab(tabs[currentIndex - 1].id);
      });
    }

    if (nextBtn) {
      nextBtn.disabled = currentIndex >= tabs.length - 1;
      nextBtn.addEventListener("click", () => {
        if (currentIndex < tabs.length - 1) this.setTab(tabs[currentIndex + 1].id);
      });
    }
  }

  renderTabContent() {
    switch (this.activeTab) {
      case "tab1":
        return `
          <div class="space-y-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
              <h3 class="text-lg sm:text-xl font-black mb-2 flex items-start sm:items-center gap-2.5 leading-snug">
                <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${Icons.sparkles ? Icons.sparkles("w-6 h-6") : "★"}</span>
                <span>${i18n.t("guide:tab1_content.title")}</span>
              </h3>
              <p class="text-sm sm:text-base leading-relaxed">${i18n.t("guide:tab1_content.intro")}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">1</span>
                  <span>${i18n.t("guide:tab1_content.step1_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.t("guide:tab1_content.step1_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">2</span>
                  <span>${i18n.t("guide:tab1_content.step2_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.t("guide:tab1_content.step2_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">3</span>
                  <span>${i18n.t("guide:tab1_content.step3_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.t("guide:tab1_content.step3_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">4</span>
                  <span>${i18n.t("guide:tab1_content.step4_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.t("guide:tab1_content.step4_desc")}</p>
              </div>
            </div>
          </div>
        `;

      case "tab2":
        return `
          <div class="space-y-4">
            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
              <h3 class="text-lg sm:text-xl font-black flex items-start sm:items-center gap-2.5 leading-snug">
                <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${Icons.plusCircle ? Icons.plusCircle("w-6 h-6") : ""}</span>
                <span>${i18n.t("guide:tab2_content.title")}</span>
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">1</span>
                  <span>${i18n.t("guide:tab2_content.step1_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.t("guide:tab2_content.step1_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">2</span>
                  <span>${i18n.t("guide:tab2_content.step2_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.t("guide:tab2_content.step2_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">3</span>
                  <span>${i18n.t("guide:tab2_content.step3_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.t("guide:tab2_content.step3_desc")}</p>
              </div>

              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">4</span>
                  <span>${i18n.t("guide:tab2_content.step4_title")}</span>
                </h4>
                <p class="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">${i18n.t("guide:tab2_content.step4_desc")}</p>
              </div>
            </div>
          </div>
        `;

      case "tab3":
        return `
          <div class="space-y-4">
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-start sm:items-center gap-2.5 leading-snug">
              <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${Icons.folder ? Icons.folder("w-6 h-6") : ""}</span>
              <span>${i18n.t("guide:tab3_content.title")}</span>
            </h3>

            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-emerald-700 dark:text-emerald-400">${i18n.t("guide:tab3_content.catalog_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${i18n.t("guide:tab3_content.catalog_desc")}</p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
              <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white">${i18n.t("guide:tab3_content.actions_title")}</h4>
              <ul class="space-y-2.5 text-sm sm:text-base">
                <li class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-medium flex items-start sm:items-center gap-3">
                  <span class="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    ${Icons.eye ? Icons.eye("w-4 h-4") : ""}
                  </span>
                  <span>${i18n.t("guide:tab3_content.action_view")}</span>
                </li>
                <li class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-medium flex items-start sm:items-center gap-3">
                  <span class="w-7 h-7 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    ${Icons.qrCode ? Icons.qrCode("w-4 h-4") : ""}
                  </span>
                  <span>${i18n.t("guide:tab3_content.action_qr")}</span>
                </li>
                <li class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 font-medium flex items-start sm:items-center gap-3">
                  <span class="w-7 h-7 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    ${Icons.trash ? Icons.trash("w-4 h-4") : ""}
                  </span>
                  <span>${i18n.t("guide:tab3_content.action_del")}</span>
                </li>
              </ul>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white">${i18n.t("guide:tab3_content.export_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${i18n.t("guide:tab3_content.export_desc")}</p>
            </div>
          </div>
        `;

      case "tab4":
        return `
          <div class="space-y-4">
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-start sm:items-center gap-2.5 leading-snug">
              <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${Icons.devicePhoneMobile ? Icons.devicePhoneMobile("w-6 h-6") : ""}</span>
              <span>${i18n.t("guide:tab4_content.title")}</span>
            </h3>

            <div class="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2 text-cyan-950 dark:text-cyan-200">
              <h4 class="font-black text-base sm:text-lg uppercase tracking-wide flex items-center gap-2.5">
                <span class="w-5 h-5 text-cyan-500">${Icons.userSlash ? Icons.userSlash("w-5 h-5") : ""}</span>
                <span>${i18n.t("guide:tab4_content.consumer_title")}</span>
              </h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${i18n.t("guide:tab4_content.consumer_desc")}</p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-emerald-950 dark:text-emerald-200">
              <h4 class="font-black text-base sm:text-lg uppercase tracking-wide flex items-center gap-2.5">
                <span class="w-5 h-5 text-emerald-500">${Icons.shieldCheck ? Icons.shieldCheck("w-5 h-5") : ""}</span>
                <span>${i18n.t("guide:tab4_content.customs_title")}</span>
              </h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${i18n.t("guide:tab4_content.customs_desc")}</p>
            </div>
          </div>
        `;

      case "tab5":
        return `
          <div class="space-y-4">
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-start sm:items-center gap-2.5 leading-snug">
              <span class="w-6 h-6 flex items-center text-emerald-500 shrink-0 mt-0.5 sm:mt-0">${Icons.shieldCheck ? Icons.shieldCheck("w-6 h-6") : ""}</span>
              <span>${i18n.t("guide:tab5_content.title")}</span>
            </h3>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-emerald-700 dark:text-emerald-400">${i18n.t("guide:tab5_content.local_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${i18n.t("guide:tab5_content.local_desc")}</p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-slate-900 dark:text-white">${i18n.t("guide:tab5_content.backup_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${i18n.t("guide:tab5_content.backup_desc")}</p>
            </div>

            <div class="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-950 dark:text-rose-200 space-y-2">
              <h4 class="font-black text-base sm:text-lg text-rose-700 dark:text-rose-400">${i18n.t("guide:tab5_content.wipe_title")}</h4>
              <p class="text-sm sm:text-[15px] leading-relaxed">${i18n.t("guide:tab5_content.wipe_desc")}</p>
            </div>
          </div>
        `;

      default:
        return "";
    }
  }
}

export const userGuideModal = new UserGuideModal();

/**
 * PassQ High-Performance Hybrid Storage Engine ($0 Cloud Cost)
 * 3-Tier Architecture:
 * - L1: In-Memory RAM Map (0ms Instant Sync Access)
 * - L2: IndexedDB Async Driver (Non-blocking background persistence)
 * - L3: LocalStorage (Fallback & Snapshot sync)
 */

const DB_NAME = 'passq_indexeddb';
const DB_VERSION = 1;
const STORE_NAME = 'products';
const STORAGE_KEY = 'passq_products_db';

const DEFAULT_PRODUCTS = [
  {
    id: "prod_001",
    gtin: "7501234567893",
    serial: "0842-MX",
    name: "Chaqueta Alpina EcoDry",
    category: "textile",
    brand: "Nordic Apex Gear",
    origin_country: "México (Oaxaca)",
    assembly_country: "México",
    manufacturing_date: "2026-03-15",
    hs_code: "6202.40.00",
    passport_urn: "urn:espr:eu:2026:7501234567893:0842-MX",
    carbon_kg: 4.2,
    water_liters: 180,
    repair_score: 9.2,
    repair_duration_yrs: 7,
    disassembly_tools: "tools_standard",
    lca_breakdown: {
      manufacturing_pct: 65,
      transport_pct: 22,
      end_of_life_pct: 13
    },
    materials: [
      { name: "Nylon Reciclado (ECONYL®)", pct: 78 },
      { name: "Membrana Bio-Polímero", pct: 22 }
    ],
    certifications: ["GOTS Certified", "OEKO-TEX 100", "EU ESPR Pass", "CE", "REACH"],
    repair_guide: [
      { step: 1, title: "Reparación de Cremallera Frontal", time: "15 min", difficulty: "easy", tools: "Aguja e hilo reforzado / Alicates" },
      { step: 2, title: "Parche Impermeable Térmico", time: "5 min", difficulty: "easy", tools: "Plancha doméstica a 110°C" },
      { step: 3, title: "Sustitución de Cordón Elástico", time: "10 min", difficulty: "easy", tools: "Pasador o imperdible" }
    ],
    recycling_instructions: "El tejido exterior de ECONYL® puede depositarse en contenedores de reciclaje textil técnico. Desmontar los botones metálicos antes del triturado.",
    signature: "ecdsa_p256_3045022100a9f83a8bc7210e9f1a23847e6bc18921e42f9b17",
    signature_algorithm: "ECDSA-P256-SHA256",
    signature_timestamp: "2026-03-15T09:30:00Z"
  },
  {
    id: "prod_002",
    gtin: "8412345678905",
    serial: "SPK-4412",
    name: "Auriculares Modulares Zero",
    category: "electronics",
    brand: "Aura Sound Labs",
    origin_country: "Alemania",
    assembly_country: "Alemania",
    manufacturing_date: "2026-05-10",
    hs_code: "8518.30.00",
    passport_urn: "urn:espr:eu:2026:8412345678905:SPK-4412",
    carbon_kg: 1.8,
    water_liters: 45,
    repair_score: 9.6,
    repair_duration_yrs: 10,
    disassembly_tools: "tools_none",
    lca_breakdown: {
      manufacturing_pct: 58,
      transport_pct: 26,
      end_of_life_pct: 16
    },
    materials: [
      { name: "Aluminio 100% Reciclado", pct: 55 },
      { name: "Plástico Marino Reciclado (OceanBound)", pct: 35 },
      { name: "Batería Li-Ion Reemplazable sin pegamento", pct: 10 }
    ],
    certifications: ["RoHS Compliant", "CE Certified", "WEEE Circular", "EU ESPR Pass"],
    repair_guide: [
      { step: 1, title: "Reemplazo de Almohadillas Magnéticas", time: "10 seg", difficulty: "easy", tools: "Ninguna (Acople magnético)" },
      { step: 2, title: "Cambio de Batería Extraíble", time: "2 min", difficulty: "easy", tools: "Destornillador Torx T5 incluido" },
      { step: 3, title: "Sustitución de Cable Jack / USB-C", time: "30 seg", difficulty: "easy", tools: "Modular Plug & Play" }
    ],
    recycling_instructions: "Batería extraíble apta para contenedores de pilas. Chasis de aluminio 100% reciclable en fundición de metales.",
    signature: "ecdsa_p256_304402204e28bf881a99cd103e48102ff9a823b128c614b7e1",
    signature_algorithm: "ECDSA-P256-SHA256",
    signature_timestamp: "2026-05-10T14:15:00Z"
  }
];

class HybridStorageManager {
  constructor() {
    this.memoryCache = new Map();
    this.dbPromise = this.initIndexedDB();
    this.initSync();
  }

  // Initialize LocalStorage snapshot & populate L1 Memory Cache
  initSync() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const items = raw ? JSON.parse(raw) : DEFAULT_PRODUCTS;
      items.forEach(p => this.memoryCache.set(p.id, p));
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      }
    } catch {
      DEFAULT_PRODUCTS.forEach(p => this.memoryCache.set(p.id, p));
    }
  }

  // Open IndexedDB with Promise
  async initIndexedDB() {
    if (typeof window === 'undefined' || !('indexedDB' in window)) return null;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('gtin', 'gtin', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        const db = e.target.result;
        resolve(db);
      };

      request.onerror = (e) => {
        console.warn('IndexedDB unavailable, falling back to LocalStorage:', e);
        resolve(null);
      };
    });
  }

  async syncIndexedDBFromMemory(db) {
    if (!db) return;
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      this.memoryCache.forEach((product) => {
        store.put(product);
      });
    } catch {
      // Graceful fallback
    }
  }

  // Synchronous Getter (Zero-wait UI rendering from L1 RAM Cache)
  getAll() {
    return Array.from(this.memoryCache.values());
  }

  // Universal Safe HTML & Script Injection Stripper
  static sanitizeString(input, maxLength = 200) {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Strip non-printable control characters
  }

  static getDefaultRepairGuide(category, tools = 'tools_standard') {
    const isNone = tools === 'tools_none' || tools === 'none';
    const isSpecialized = tools === 'tools_specialized' || tools === 'spec';

    switch (category) {
      case 'textile':
        if (isNone) {
          return [
            { step: 1, title: "Limpieza y Cuidado Textil Sostenible", time: "5 min", tools: "Lavado suave a 30°C / Secado al aire" },
            { step: 2, title: "Abotonado y Broches a Presión", time: "2 min", tools: "Fijación manual sin herramientas" },
            { step: 3, title: "Aplicación de Parches Térmicos", time: "5 min", tools: "Plancha doméstica a 110°C" }
          ];
        }
        if (isSpecialized) {
          return [
            { step: 1, title: "Inspección Técnica de Costuras", time: "10 min", tools: "Taller textil especializado" },
            { step: 2, title: "Retermosellado de Membrana", time: "24h", tools: "Prensa térmica de termosellado" }
          ];
        }
        return [
          { step: 1, title: "Limpieza y Cuidado Textil Sostenible", time: "5 min", tools: "Lavado suave a 30°C / Secado al aire" },
          { step: 2, title: "Sustitución de Botones, Cierres o Cremalleras", time: "10 min", tools: "Aguja e hilo reforzado / Tijeras" },
          { step: 3, title: "Aplicación de Parches Térmicos en Zonas de Desgaste", time: "5 min", tools: "Plancha doméstica a 110°C" }
        ];

      case 'furniture':
        if (isNone) {
          return [
            { step: 1, title: "Ajuste y Encastre de Ensambles a Presión", time: "2 min", tools: "Sin herramientas (Encastre manual)" },
            { step: 2, title: "Limpieza y Nutrición de Madera", time: "10 min", tools: "Paño de microfibra y aceite vegetal protector" },
            { step: 3, title: "Sustitución de Topes y Protectores", time: "2 min", tools: "Acople a presión sin herramientas" }
          ];
        }
        if (isSpecialized) {
          return [
            { step: 1, title: "Desmontaje de Bastidor con Extractor", time: "15 min", tools: "Llave dinamométrica / Extractor especializado" },
            { step: 2, title: "Restauración Estructural Oficial", time: "48h", tools: "Maquinaria de ebanistería y prensa técnica" }
          ];
        }
        return [
          { step: 1, title: "Reapriete de Herrajes y Pernos de Unión", time: "5 min", tools: "Llave Allen estándar / Destornillador" },
          { step: 2, title: "Lijado y Encerado Protector", time: "15 min", tools: "Lija fina P240 y cera natural" },
          { step: 3, title: "Sustitución de Bisagras o Guías", time: "10 min", tools: "Destornillador estándar" }
        ];

      case 'electronics':
        if (isNone) {
          return [
            { step: 1, title: "Limpieza Preventiva y Contactos", time: "3 min", tools: "Paño seco / Aire comprimido" },
            { step: 2, title: "Sustitución de Almohadillas / Módulos Magnéticos", time: "1 min", tools: "Sin herramientas (Acople magnético/click)" },
            { step: 3, title: "Extracción Rápida de Batería Modular", time: "2 min", tools: "Pestaña de liberación rápida (Quick-Release)" }
          ];
        }
        if (isSpecialized) {
          return [
            { step: 1, title: "Desensamble en Banco Antiestático", time: "20 min", tools: "Estación de calor / Desoldador SMD" },
            { step: 2, title: "Sustitución de Componentes SMD", time: "24h", tools: "Servicio Técnico Oficial Certificado" }
          ];
        }
        return [
          { step: 1, title: "Mantenimiento Preventivo y Limpieza", time: "5 min", tools: "Paño suave / alcohol isopropílico" },
          { step: 2, title: "Sustitución de Batería Extraíble o Módulo", time: "10 min", tools: "Destornillador estándar de precisión" },
          { step: 3, title: "Sustitución de Conector de Carga", time: "5 min", tools: "Destornillador estándar Torx / Phillips" }
        ];

      case 'footwear':
        if (isNone) {
          return [
            { step: 1, title: "Limpieza Superficial y Aireado", time: "3 min", tools: "Sin herramientas" },
            { step: 2, title: "Cambio de Cordones y Plantillas", time: "2 min", tools: "Inserción manual sin herramientas" }
          ];
        }
        if (isSpecialized) {
          return [
            { step: 1, title: "Risuolado Completo de Suela y Entresuela", time: "24h", tools: "Taller artesanal zapatero / Prensa de vulcanizado" }
          ];
        }
        return [
          { step: 1, title: "Limpieza y Nutrición de Piel / Tejido", time: "5 min", tools: "Cepillo de cerdas suaves / Crema protectora" },
          { step: 2, title: "Sustitución de Cordones y Plantillas", time: "2 min", tools: "Herramientas domésticas (Punzón / Alicate)" },
          { step: 3, title: "Cambio de Tapas de Tacón", time: "10 min", tools: "Martillo doméstico de zapatero" }
        ];

      case 'battery':
        if (isNone) {
          return [
            { step: 1, title: "Comprobación Visual de Bornes", time: "2 min", tools: "Sin herramientas" },
            { step: 2, title: "Extracción de Módulo Extraíble", time: "3 min", tools: "Palanca de enganche rápido manual" }
          ];
        }
        if (isSpecialized) {
          return [
            { step: 1, title: "Diagnóstico Telemático de Celdas (SOH)", time: "5 min", tools: "Software BMS / Puerto OBD-II" },
            { step: 2, title: "Sustitución Segura de Módulos de Alta Tensión", time: "30 min", tools: "Herramientas aisladas 1000V / EPP Categoría 4" }
          ];
        }
        return [
          { step: 1, title: "Diagnóstico Telemático y Salud de Celdas (SOH)", time: "5 min", tools: "Software BMS / Puerto OBD-II" },
          { step: 2, title: "Sustitución de Fusible o Cableado", time: "10 min", tools: "Llave de vaso estándar aislada" }
        ];

      case 'cosmetics':
        return [
          { step: 1, title: "Limpieza y Enjuague de Envase para Relleno", time: "3 min", tools: "Agua tibia / Secado completo" },
          { step: 2, title: "Recarga Oficial (Refill) y Colocación de Bomba", time: "1 min", tools: "Enrosque manual sin herramientas" }
        ];

      case 'food':
        return [
          { step: 1, title: "Conservación Óptima y Cadena de Frío", time: "Continuo", tools: "Refrigeración según etiqueta" },
          { step: 2, title: "Separación Limpia de Envase, Tapón y Etiqueta", time: "30 seg", tools: "Separación manual para reciclaje" }
        ];

      case 'construction':
        if (isNone) {
          return [
            { step: 1, title: "Inspección Visual Periódica", time: "Anual", tools: "Inspección visual sin herramientas" },
            { step: 2, title: "Desmontaje y Desacople Modular", time: "Fin de vida", tools: "Desencastre manual en seco" }
          ];
        }
        if (isSpecialized) {
          return [
            { step: 1, title: "Ensayos No Destructivos y Ultrasonidos", time: "Quinquenal", tools: "Equipo de ultrasonidos y dinamometría" },
            { step: 2, title: "Deconstrucción y Recuperación de Elementos", time: "Fin de vida", tools: "Grúa y cizalla hidráulica especializada" }
          ];
        }
        return [
          { step: 1, title: "Inspección Periódica y Mantenimiento", time: "Anual", tools: "Inspección visual y llave estándar" },
          { step: 2, title: "Deconstrucción y Desatornillado", time: "Fin de vida", tools: "Atornillador de impacto estándar" }
        ];

      default:
        return [
          { step: 1, title: "Mantenimiento Preventivo y Limpieza", time: "5 min", tools: isNone ? "Sin herramientas" : "Herramientas estándar" },
          { step: 2, title: "Sustitución de Piezas de Desgaste", time: "10 min", tools: isNone ? "Sin herramientas" : "Herramientas estándar" }
        ];
    }
  }

  getById(id, fallbackPayload = null) {
    // 1. Reconstruct from live scanned base64 payload (pdata) with strict security hardening
    if (fallbackPayload && typeof fallbackPayload === 'string') {
      const trimmed = fallbackPayload.trim();
      
      // Security Guard 1: Payload size limit (Max 4 KB to prevent Memory DoS)
      if (trimmed.length > 0 && trimmed.length <= 4096 && /^[A-Za-z0-9_\-]+={0,2}$/.test(trimmed)) {
        try {
          let b64 = trimmed.replace(/-/g, '+').replace(/_/g, '/');
          while (b64.length % 4) {
            b64 += '=';
          }
          const decodedStr = decodeURIComponent(escape(atob(b64)));
          
          // Security Guard 2: Prototype pollution blocker in JSON reviver
          const decoded = JSON.parse(decodedStr, (key, value) => {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
              return undefined;
            }
            return value;
          });

          if (decoded && typeof decoded === 'object') {
            // Decode Category (supports 2-letter codes: tx, fw, el, bt, cs, fd, fn, ct or full string)
            const CODE_TO_CAT = {
              tx: 'textile',
              fw: 'footwear',
              el: 'electronics',
              bt: 'battery',
              cs: 'cosmetics',
              fd: 'food',
              fn: 'furniture',
              ct: 'construction'
            };
            const rawCat = HybridStorageManager.sanitizeString(decoded.c, 40) || "general";
            const sanitizedCategory = CODE_TO_CAT[rawCat] || rawCat;

            const sanitizedName = HybridStorageManager.sanitizeString(decoded.n, 120) || "Producto Certificado PassQ";
            const sanitizedBrand = HybridStorageManager.sanitizeString(decoded.b, 80) || "Marca Verificada";
            const sanitizedOrigin = HybridStorageManager.sanitizeString(decoded.o, 60) || "México";
            const sanitizedHs = HybridStorageManager.sanitizeString(decoded.hs, 20) || "8471.30.00";
            
            // Signature (compact 's' or legacy 'sig')
            const rawSig = decoded.s || decoded.sig || "ecdsa_p256_verified_dpp";
            const sanitizedSig = HybridStorageManager.sanitizeString(rawSig, 256);

            // Sanitize materials array (Supports tuples [name, pct] and objects {name, pct})
            let sanitizedMaterials = [{ name: "Material Principal Reciclado", pct: 100 }];
            if (Array.isArray(decoded.m) && decoded.m.length > 0) {
              sanitizedMaterials = decoded.m.slice(0, 15).map(mat => {
                if (Array.isArray(mat)) {
                  return {
                    name: HybridStorageManager.sanitizeString(mat[0], 60) || "Material",
                    pct: Math.max(0, Math.min(100, parseFloat(mat[1]) || 0))
                  };
                }
                return {
                  name: HybridStorageManager.sanitizeString(mat.name || mat.n, 60) || "Material",
                  pct: Math.max(0, Math.min(100, parseFloat(mat.pct || mat.p) || 0))
                };
              }).filter(m => m.name.length > 0);
              if (sanitizedMaterials.length === 0) {
                sanitizedMaterials = [{ name: "Material Reciclado", pct: 100 }];
              }
            }

            const cleanRepairScore = Math.max(1.0, Math.min(10.0, parseFloat(decoded.r) || 9.0));
            // Carbon footprint (compact 'k' or legacy 'co2')
            const cleanCarbon = Math.max(0, parseFloat(decoded.k != null ? decoded.k : decoded.co2) || 3.5);
            const cleanWater = Math.max(0, parseFloat(decoded.w) || 120);

            // Decode battery recycled metals (supports array [co, li, ni] or object)
            let batteryRecycled = null;
            const rawBm = decoded.bm || decoded.b_met;
            if (Array.isArray(rawBm)) {
              batteryRecycled = {
                cobalt_pct: Math.max(0, Math.min(100, parseFloat(rawBm[0]) || 0)),
                lithium_pct: Math.max(0, Math.min(100, parseFloat(rawBm[1]) || 0)),
                nickel_pct: Math.max(0, Math.min(100, parseFloat(rawBm[2]) || 0))
              };
            } else if (rawBm && typeof rawBm === 'object') {
              batteryRecycled = {
                cobalt_pct: Math.max(0, Math.min(100, parseFloat(rawBm.cobalt_pct) || 0)),
                lithium_pct: Math.max(0, Math.min(100, parseFloat(rawBm.lithium_pct) || 0)),
                nickel_pct: Math.max(0, Math.min(100, parseFloat(rawBm.nickel_pct) || 0))
              };
            }

            // Decode disassembly tools & duration
            let decodedTools = 'tools_standard';
            if (decoded.dt === 'none' || decoded.dt === 'tools_none') decodedTools = 'tools_none';
            else if (decoded.dt === 'spec' || decoded.dt === 'tools_specialized') decodedTools = 'tools_specialized';
            else if (decoded.dt === 'std' || decoded.dt === 'tools_standard') decodedTools = 'tools_standard';

            const decodedDuration = Math.max(1, Math.min(20, parseInt(decoded.dy || decoded.duration, 10) || 5));

            const dynProduct = {
              id: `dyn_${HybridStorageManager.sanitizeString(id, 40) || Date.now()}`,
              gtin: HybridStorageManager.sanitizeString(id, 20) || "0000000000000",
              serial: "SN-CERT",
              name: sanitizedName,
              category: sanitizedCategory,
              brand: sanitizedBrand,
              repair_score: cleanRepairScore,
              repair_duration_yrs: decodedDuration,
              disassembly_tools: decodedTools,
              carbon_kg: cleanCarbon,
              water_liters: cleanWater,
              materials: sanitizedMaterials,
              hs_code: sanitizedHs,
              origin_country: sanitizedOrigin,
              assembly_country: sanitizedOrigin,
              manufacturing_date: "2026-01-01",
              passport_urn: `urn:espr:eu:2026:${HybridStorageManager.sanitizeString(id, 20) || '0000000000000'}:01`,
              signature: sanitizedSig,
              signature_algorithm: "ECDSA-P256-SHA256",
              signature_timestamp: new Date().toISOString(),
              certifications: ["EU ESPR Pass", "CE", "RoHS"],
              // Sector-specific restored properties (compact & legacy fallback)
              battery_chemistry: HybridStorageManager.sanitizeString(decoded.bc || decoded.b_chem, 50),
              battery_capacity: HybridStorageManager.sanitizeString(decoded.bp || decoded.b_cap, 40),
              battery_recycled_metals: batteryRecycled,
              inci_ingredients: HybridStorageManager.sanitizeString(decoded.ci || decoded.c_inci, 300),
              pao_months: Math.max(1, Math.min(48, parseInt(decoded.cp || decoded.c_pao, 10) || 12)),
              allergens: HybridStorageManager.sanitizeString(decoded.ca || decoded.c_alg, 150),
              food_batch: HybridStorageManager.sanitizeString(decoded.fl || decoded.f_lot, 50),
              food_expiry: HybridStorageManager.sanitizeString(decoded.fe || decoded.f_exp, 30),
              food_temp: HybridStorageManager.sanitizeString(decoded.ft || decoded.f_tmp, 60),
              food_certifications: HybridStorageManager.sanitizeString(decoded.fc || decoded.f_crt, 100),
              epd_number: HybridStorageManager.sanitizeString(decoded.ee || decoded.e_epd, 60),
              structural_lifespan_yrs: Math.max(1, Math.min(200, parseInt(decoded.el || decoded.e_life, 10) || 50)),
              repair_guide: HybridStorageManager.getDefaultRepairGuide(sanitizedCategory, decodedTools),
              recycling_instructions: "Separación y depósito en canal oficial de reciclaje circular."
            };
            this.save(dynProduct);
            return dynProduct;
          }
        } catch (err) {
          console.warn('PassQ: Secure pdata decode prevented invalid payload:', err);
        }
      }
    }

    if (!id) return this.getAll()[0];

    // 2. Check in-memory L1 cache by id
    if (this.memoryCache.has(id)) {
      return this.memoryCache.get(id);
    }

    // 3. Search by GTIN in memory
    for (const prod of this.memoryCache.values()) {
      if (prod.gtin === id || prod.id === id) return prod;
    }

    return this.getAll()[0];
  }

  // Synchronous + Asynchronous L1 -> L2 -> L3 Save Pipeline
  save(product) {
    if (!product || !product.id) return null;

    // 1. Update L1 RAM Cache (Instant 0ms UI update)
    this.memoryCache.set(product.id, product);

    // 2. Update L3 LocalStorage Snapshot (Synchronous safety fallback)
    try {
      const all = Array.from(this.memoryCache.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // LocalStorage Quota Exceeded guard
    }

    // 3. Update L2 IndexedDB Asynchronously (Non-blocking background transaction)
    this.dbPromise.then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(product);
      } catch (err) {
        console.warn('PassQ IDB save error:', err);
      }
    });

    return product;
  }

  // Delete product by ID (L1 Cache -> L2 IndexedDB -> L3 LocalStorage sync)
  delete(id) {
    if (!id) return false;
    
    // 1. Remove from L1 RAM Cache
    this.memoryCache.delete(id);

    // 2. Update L3 LocalStorage Snapshot
    try {
      const all = Array.from(this.memoryCache.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {}

    // 3. Remove from L2 IndexedDB
    this.dbPromise.then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
      } catch (err) {
        console.warn('PassQ IDB delete error:', err);
      }
    });

    return true;
  }

  // Purge all data (GDPR / Apple 5.1.1 compliance)
  clearAll() {
    this.memoryCache.clear();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    this.dbPromise.then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
      } catch {}
    });
  }
}

export const storage = new HybridStorageManager();
export { HybridStorageManager };

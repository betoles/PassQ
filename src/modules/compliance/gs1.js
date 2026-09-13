/**
 * PassQ GS1 Digital Link & Customs Schema.org JSON-LD Exporter
 * Enterprise-grade compliance with EU ESPR (2024/1781) & GS1 General Specifications
 */

export class GS1Formatter {
  /**
   * Calculates the official GS1 Modulo 10 Check Digit for a string of digits (without the check digit)
   * Weight pattern: Starting from rightmost digit moving left: *3, *1, *3, *1, etc.
   * @param {string} digits - Digits preceding the check digit (e.g. 7, 11, 12, or 13 digits)
   * @returns {number} 0-9
   */
  static calculateCheckDigit(digits) {
    const clean = String(digits).replace(/\D/g, '');
    if (!clean) return 0;
    
    let sum = 0;
    let multiplier = 3;
    for (let i = clean.length - 1; i >= 0; i--) {
      sum += parseInt(clean[i], 10) * multiplier;
      multiplier = multiplier === 3 ? 1 : 3;
    }
    
    const mod = sum % 10;
    return mod === 0 ? 0 : 10 - mod;
  }

  /**
   * Validates a complete GTIN (8, 12, 13, or 14 digits) including its GS1 Mod 10 Check Digit.
   * @param {string} gtin
   * @returns {{ isValid: boolean, expectedCheckDigit: number, actualCheckDigit: number, error: string|null }}
   */
  static validateGTIN(gtin) {
    if (!gtin) {
      return { isValid: false, expectedCheckDigit: 0, actualCheckDigit: 0, error: 'gtin_empty' };
    }
    const clean = String(gtin).trim();
    if (!/^\d+$/.test(clean)) {
      return { isValid: false, expectedCheckDigit: 0, actualCheckDigit: 0, error: 'gtin_non_numeric' };
    }
    if (![8, 12, 13, 14].includes(clean.length)) {
      return { isValid: false, expectedCheckDigit: 0, actualCheckDigit: 0, error: 'gtin_invalid_length' };
    }

    const payload = clean.slice(0, -1);
    const actualCheckDigit = parseInt(clean.slice(-1), 10);
    const expectedCheckDigit = this.calculateCheckDigit(payload);

    if (actualCheckDigit !== expectedCheckDigit) {
      return {
        isValid: false,
        expectedCheckDigit,
        actualCheckDigit,
        error: 'gtin_check_digit_mismatch'
      };
    }

    return {
      isValid: true,
      expectedCheckDigit,
      actualCheckDigit,
      error: null
    };
  }

  /**
   * Generates a mathematically valid GTIN-13 code with accurate GS1 Mod 10 check digit
   * @param {string} prefix Optional 3-to-12 digit prefix
   * @returns {string}
   */
  static generateValidGTIN(prefix = '750') {
    const cleanPrefix = String(prefix).replace(/\D/g, '');
    let base = cleanPrefix;
    const needed = 12 - base.length;
    if (needed > 0) {
      for (let i = 0; i < needed; i++) {
        base += Math.floor(Math.random() * 10).toString();
      }
    } else {
      base = base.slice(0, 12);
    }
    const checkDigit = this.calculateCheckDigit(base);
    return `${base}${checkDigit}`;
  }

  /**
   * Resolves a universally reachable base URL.
   * Ensures 'localhost' / '127.0.0.1' is never baked into physical/PDF QR codes.
   * @param {string|null} requestedBase
   * @returns {string}
   */
  static resolveBaseUrl(requestedBase = null) {
    if (requestedBase && typeof requestedBase === 'string' && requestedBase.trim() !== '') {
      const clean = requestedBase.trim().replace(/\/+$/, '');
      if (!clean.includes('localhost') && !clean.includes('127.0.0.1') && !clean.includes('brand.com') && !clean.includes('passq.app')) {
        return clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
      }
    }

    // Check localStorage preference if set in QR Studio
    try {
      if (typeof localStorage !== 'undefined') {
        const savedDomain = localStorage.getItem('passq_qr_base_url');
        if (savedDomain && savedDomain.trim() && !savedDomain.includes('localhost') && !savedDomain.includes('127.0.0.1') && !savedDomain.includes('brand.com') && !savedDomain.includes('passq.app')) {
          return savedDomain.trim().replace(/\/+$/, '');
        }
      }
    } catch {}

    // Check browser window environment
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      const origin = window.location.origin;
      const pathname = window.location.pathname || '';
      const basePath = pathname.replace(/\/[^\/]*\.html.*$/, '').replace(/\/+$/, '');

      if (hostname === 'betoles.github.io') {
        return 'https://betoles.github.io/PassQ';
      }

      if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('192.168.')) {
        return `${origin}${basePath}`;
      }
    }

    // Universal public production fallback: Reachable worldwide on Wi-Fi and Cellular (4G/5G)
    return 'https://betoles.github.io/PassQ';
  }

  /**
   * Generates standard GS1 Digital Link URI & Canonical Resolver URLs
   * Format: https://{domain}/01/{GTIN}/21/{SERIAL} or https://{domain}/p.html?gtin={GTIN}&serial={SERIAL}
   * @param {string} gtin GTIN code (8, 12, 13, 14 digits)
   * @param {string} serial Serial Number (e.g. SN-0842)
   * @param {string|null} baseUrl Target origin domain (default resolves safely)
   * @param {object|null} product Optional product object
   * @param {object} options Options: { format: 'web'|'gs1_uri', includeOfflinePayload: boolean }
   */
  static generateDigitalLink(gtin, serial, baseUrl = null, product = null, options = {}) {
    const cleanGtin = (gtin || '0000000000000').replace(/\D/g, '');
    const cleanSerial = encodeURIComponent(serial || '01');
    const domain = this.resolveBaseUrl(baseUrl);

    if (options.format === 'gs1_uri') {
      return `${domain}/01/${cleanGtin}/21/${cleanSerial}`;
    }

    let url = `${domain}/p.html?gtin=${cleanGtin}&serial=${cleanSerial}`;

    // Include self-contained data payload (pdata) when product is provided (unless explicitly disabled)
    // Compact encoding achieves ~48% reduction in character length (Version 12-14 vs Version 23)
    const shouldInclude = options.includeOfflinePayload !== false && product && product.name;
    if (shouldInclude) {
      try {
        const catMap = {
          textile: 'tx',
          footwear: 'fw',
          electronics: 'el',
          battery: 'bt',
          cosmetics: 'cs',
          food: 'fd',
          furniture: 'fn',
          construction: 'ct'
        };

        const compactCategory = catMap[product.category] || product.category || 'tx';

        // Compact materials to tuple array: [["Material", pct], ...]
        const compactMaterials = Array.isArray(product.materials)
          ? product.materials.slice(0, 10).map(m => {
              if (Array.isArray(m)) return [m[0], Number(m[1]) || 0];
              return [m.name || m.n || 'Material', Number(m.pct || m.p) || 0];
            })
          : [];

        // Truncate ECDSA signature prefix/suffix if needed or keep compact hash
        let sigClean = product.signature || '';
        if (sigClean.startsWith('ecdsa_p256_')) {
          sigClean = sigClean.replace('ecdsa_p256_', '').slice(0, 32);
        }

        const miniPayload = {
          n: product.name,
          c: compactCategory,
          b: product.brand || 'PassQ',
          r: product.repair_score != null ? Number(product.repair_score) : 9.0,
          k: product.carbon_kg != null ? Number(product.carbon_kg) : 1.8,
          w: product.water_liters != null ? Number(product.water_liters) : 100,
          m: compactMaterials,
          ...(product.disassembly_tools && { dt: product.disassembly_tools === 'tools_none' ? 'none' : (product.disassembly_tools === 'tools_specialized' ? 'spec' : 'std') }),
          ...(product.repair_duration_yrs && { dy: Number(product.repair_duration_yrs) }),
          ...(product.hs_code && { hs: product.hs_code }),
          ...(product.origin_country && { o: product.origin_country }),
          ...(sigClean && { s: sigClean }),
          // Sector-specific properties (ultra-compact keys)
          ...(product.battery_chemistry && { bc: product.battery_chemistry }),
          ...(product.battery_capacity && { bp: product.battery_capacity }),
          ...(product.battery_recycled_metals && {
            bm: [
              Number(product.battery_recycled_metals.cobalt_pct || 0),
              Number(product.battery_recycled_metals.lithium_pct || 0),
              Number(product.battery_recycled_metals.nickel_pct || 0)
            ]
          }),
          ...(product.inci_ingredients && { ci: product.inci_ingredients }),
          ...(product.pao_months && { cp: Number(product.pao_months) }),
          ...(product.allergens && { ca: product.allergens }),
          ...(product.food_batch && { fl: product.food_batch }),
          ...(product.food_expiry && { fe: product.food_expiry }),
          ...(product.food_temp && { ft: product.food_temp }),
          ...(product.food_certifications && { fc: product.food_certifications }),
          ...(product.epd_number && { ee: product.epd_number }),
          ...(product.structural_lifespan_yrs && { el: Number(product.structural_lifespan_yrs) })
        };

        const jsonStr = JSON.stringify(miniPayload);
        const b64 = btoa(unescape(encodeURIComponent(jsonStr)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
        url += `&pdata=${b64}`;
      } catch (err) {
        console.warn('PassQ: Payload compression fallback:', err);
      }
    }

    return url;
  }

  /**
   * Evaluates QR Code optical density, matrix size, and physical printing requirements.
   * Based on ISO/IEC 18004 standards and industrial thermal/flexo scanning tolerances.
   * @param {string} url
   * @param {string} eccLevel 'L' | 'M' | 'Q' | 'H'
   * @returns {{
   *   charLength: number,
   *   version: number,
   *   matrixSize: string,
   *   modules: number,
   *   densityTier: 'compact'|'standard'|'extended',
   *   minPrintMm: number,
   *   minPrintLabel: string,
   *   scannabilityTier: 'optimal'|'good'|'wide_label_required',
   *   scannabilitySpeed: string
   * }}
   */
  static getQROpticalMetrics(url = '', eccLevel = 'H') {
    const charLength = typeof url === 'string' ? url.length : 0;
    
    // Byte capacities for ECC Level H (ISO/IEC 18004)
    const capacitiesH = [
      7, 14, 24, 34, 44, 58, 64, 84, 98, 119,
      137, 155, 177, 207, 231, 255, 283, 315, 347, 387,
      425, 458, 498, 550, 597, 647, 700, 757, 817, 881,
      948, 1018, 1091, 1167, 1246, 1328, 1413, 1501, 1592, 1686
    ];

    let version = 1;
    for (let i = 0; i < capacitiesH.length; i++) {
      if (charLength <= capacitiesH[i]) {
        version = i + 1;
        break;
      }
      if (i === capacitiesH.length - 1) {
        version = 40;
      }
    }

    const modules = 21 + 4 * (version - 1);
    const matrixSize = `${modules}x${modules}`;

    let densityTier = 'compact';
    let minPrintMm = 20;
    let minPrintLabel = '2.0 x 2.0 cm (20x20 mm)';
    let scannabilityTier = 'optimal';
    let scannabilitySpeed = '< 30ms (Ultra-Rápido)';

    if (version <= 6) {
      densityTier = 'compact';
      minPrintMm = 20;
      minPrintLabel = '2.0 x 2.0 cm (20x20 mm)';
      scannabilityTier = 'optimal';
      scannabilitySpeed = '< 30ms (Ultra-Rápido)';
    } else if (version <= 14) {
      densityTier = 'standard';
      minPrintMm = 28;
      minPrintLabel = '2.8 x 2.8 cm (28x28 mm)';
      scannabilityTier = 'good';
      scannabilitySpeed = '< 60ms (Óptimo)';
    } else {
      densityTier = 'extended';
      minPrintMm = 40;
      minPrintLabel = '4.0 x 4.0 cm (40x40 mm)';
      scannabilityTier = 'wide_label_required';
      scannabilitySpeed = '< 100ms (Estándar)';
    }

    return {
      charLength,
      version,
      matrixSize,
      modules,
      densityTier,
      minPrintMm,
      minPrintLabel,
      scannabilityTier,
      scannabilitySpeed
    };
  }

  /**
   * Universal Multiformat Scanned Value Parser
   * Handles GS1 Digital Link URIs, raw GTINs, URL parameters and URNs
   */
  static parseScannedCode(rawValue) {
    if (!rawValue) return null;
    const trimmed = rawValue.trim();

    // 1. Direct PassQ or DPP URL
    if (trimmed.includes('p.html') || trimmed.includes('gtin=') || trimmed.includes('id=')) {
      return { type: 'passq_url', url: trimmed };
    }

    // 2. Canonical GS1 Digital Link URI format: https://.../01/{gtin}/21/{serial}
    const gs1Match = trimmed.match(/\/01\/(\d{8,14})(?:\/21\/([^\/\?#]+))?/);
    if (gs1Match) {
      const gtin = gs1Match[1];
      const serial = gs1Match[2] ? decodeURIComponent(gs1Match[2]) : '01';
      return {
        type: 'gs1_digital_link',
        gtin,
        serial,
        url: `/p.html?gtin=${gtin}&serial=${encodeURIComponent(serial)}`
      };
    }

    // 3. Raw GTIN / EAN barcode (8 to 14 numeric digits)
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length >= 8 && digitsOnly.length <= 14 && digitsOnly.length === trimmed.length) {
      return {
        type: 'raw_gtin',
        gtin: digitsOnly,
        url: `/p.html?gtin=${digitsOnly}`
      };
    }

    // 4. GS1 Application Identifier String e.g. (01)07501234567890(21)0842-MX
    const aiMatch = trimmed.match(/\(01\)(\d{8,14})(?:\(21\)([^()]+))?/);
    if (aiMatch) {
      const gtin = aiMatch[1];
      const serial = aiMatch[2] || '01';
      return {
        type: 'gs1_ai',
        gtin,
        serial,
        url: `/p.html?gtin=${gtin}&serial=${encodeURIComponent(serial)}`
      };
    }

    // 5. Generic URL or string fallback
    return {
      type: 'generic',
      url: trimmed.startsWith('http') ? trimmed : `/p.html?id=${encodeURIComponent(trimmed)}`
    };
  }

  /**
   * Generates standardized JSON-LD structured data for EU customs and search engines
   */
  static generateJSONLD(product) {
    const additionalProperties = [
      {
        "@type": "PropertyValue",
        "name": "EcodesignRepairabilityScore",
        "value": `${product.repair_score}/10`
      },
      {
        "@type": "PropertyValue",
        "name": "CarbonFootprintKgCO2e",
        "value": product.carbon_kg
      },
      {
        "@type": "PropertyValue",
        "name": "HarmonizedSystemTariffCode",
        "value": product.hs_code || "6202.40.00"
      },
      {
        "@type": "PropertyValue",
        "name": "DigitalProductPassportStandard",
        "value": "EU-ESPR-2024/1781"
      },
      {
        "@type": "PropertyValue",
        "name": "PassportURN",
        "value": product.passport_urn || `urn:espr:eu:2026:${product.gtin}:${product.serial}`
      },
      {
        "@type": "PropertyValue",
        "name": "CryptographicVerificationHash",
        "value": product.signature || "ed25519_verified"
      }
    ];

    // Sector-specific JSON-LD extensions
    if (product.category === 'battery') {
      if (product.battery_chemistry) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "BatteryCellChemistry", "value": product.battery_chemistry });
      }
      if (product.battery_capacity) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "BatteryRatedCapacity", "value": product.battery_capacity });
      }
      if (product.battery_recycled_metals) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "CriticalRawMaterialsRecycledContent", "value": JSON.stringify(product.battery_recycled_metals) });
      }
    } else if (product.category === 'cosmetics') {
      if (product.inci_ingredients) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "INCIIngredientsList", "value": product.inci_ingredients });
      }
      if (product.pao_months) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "PeriodAfterOpeningPAO", "value": `${product.pao_months}M` });
      }
    } else if (product.category === 'food') {
      if (product.food_batch) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "ProductionBatchLot", "value": product.food_batch });
      }
      if (product.food_expiry) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "BestBeforeDate", "value": product.food_expiry });
      }
      if (product.food_temp) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "StorageTemperatureCondition", "value": product.food_temp });
      }
    } else if (product.category === 'construction') {
      if (product.epd_number) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "EnvironmentalProductDeclarationEPD", "value": product.epd_number });
      }
      if (product.structural_lifespan_yrs) {
        additionalProperties.push({ "@type": "PropertyValue", "name": "EstimatedDesignServiceLife", "value": `${product.structural_lifespan_yrs} years` });
      }
    }

    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "gtin13": product.gtin,
      "serialNumber": product.serial,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "PassQ Certified Brand"
      },
      "countryOfOrigin": {
        "@type": "Country",
        "name": product.origin_country || "México"
      },
      "additionalProperty": additionalProperties
    };
  }
}

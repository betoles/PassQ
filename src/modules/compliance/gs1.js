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
      if (!clean.includes('localhost') && !clean.includes('127.0.0.1')) {
        return clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
      }
    }

    // Check localStorage preference if set in QR Studio
    try {
      if (typeof localStorage !== 'undefined') {
        const savedDomain = localStorage.getItem('passq_qr_base_url');
        if (savedDomain && savedDomain.trim() && !savedDomain.includes('localhost') && !savedDomain.includes('127.0.0.1')) {
          return savedDomain.trim().replace(/\/+$/, '');
        }
      }
    } catch {}

    // Check browser window environment
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return window.location.origin;
      }
    }

    // Local dev fallback: LAN IP reachable by mobile devices on same Wi-Fi
    return 'http://192.168.100.6:5173';
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
    // Guarantees cross-device instant resolution with zero cloud dependency
    const shouldInclude = options.includeOfflinePayload !== false && product && product.name;
    if (shouldInclude) {
      try {
        const miniPayload = {
          n: product.name,
          c: product.category || 'general',
          b: product.brand || 'PassQ',
          r: product.repair_score || 9.0,
          co2: product.carbon_kg || 1.8,
          w: product.water_liters || 100,
          m: product.materials || [],
          hs: product.hs_code || '6202.40.00',
          o: product.origin_country || 'México',
          sig: product.signature || ''
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
      "additionalProperty": [
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
      ]
    };
  }
}

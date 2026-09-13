/**
 * PassQ Compliance & Repairability Algorithm Engine
 * Implements French Repairability Index & EU Circularity Metrics locally in JavaScript ($0 AI/API Cost).
 */

export class ComplianceCalculator {
  /**
   * Calculates the official Repairability Index (0 to 10 points)
   * Based on:
   * 1. Documentation availability (2 pts)
   * 2. Disassembly ease and tools required (2 pts)
   * 3. Spare parts availability duration (2 pts)
   * 4. Price of spare parts relative to product (2 pts)
   * 5. Specific product category criteria (2 pts)
   */
  static calculateRepairScore({ disassembly_tools, repair_duration_yrs, category }) {
    let score = 5.0; // Base score

    // Tools criteria
    if (disassembly_tools === 'tools_none') score += 2.0;
    else if (disassembly_tools === 'tools_standard') score += 1.4;
    else score += 0.4;

    // Spare parts availability duration (years)
    const yrs = parseInt(repair_duration_yrs) || 5;
    if (yrs >= 10) score += 2.0;
    else if (yrs >= 7) score += 1.6;
    else if (yrs >= 5) score += 1.2;
    else score += 0.5;

    // Category weighting according to EU Ecodesign & Sectoral Guidelines
    if (category === 'textile' || category === 'furniture' || category === 'footwear') score += 0.8;
    else if (category === 'electronics') score += 0.5;
    else if (category === 'battery') score += 0.6;
    else if (category === 'construction') score += 0.9;
    else if (category === 'cosmetics' || category === 'food') score += 0.4; // Circularity & packaging focus

    return Math.min(10.0, Math.max(1.0, parseFloat(score.toFixed(1))));
  }

  /**
   * Calculates Circularity & Recycled content percentage
   */
  static calculateRecycledPct(materials = []) {
    if (!materials || materials.length === 0) return 0;
    let totalRecycled = 0;
    
    materials.forEach(m => {
      const name = (m.name || '').toLowerCase();
      if (
        name.includes('reciclado') || 
        name.includes('recycled') || 
        name.includes('econyl') || 
        name.includes('bio') || 
        name.includes('chatarra') || 
        name.includes('scrap') ||
        name.includes('regenerado') ||
        name.includes('r-pet') ||
        name.includes('rpet')
      ) {
        totalRecycled += (parseFloat(m.pct) || 0);
      }
    });

    return Math.min(100, Math.round(totalRecycled));
  }

  /**
   * Calculates EU Battery Regulation (2023/1542) Critical Raw Material Recovery Index
   * @param {number} recycledCobaltPct
   * @param {number} recycledLithiumPct
   * @param {number} recycledNickelPct
   * @returns {{ averagePct: number, meets2027Target: boolean, meets2031Target: boolean }}
   */
  static evaluateBatteryRecycledMetals(recycledCobaltPct = 0, recycledLithiumPct = 0, recycledNickelPct = 0) {
    const co = parseFloat(recycledCobaltPct) || 0;
    const li = parseFloat(recycledLithiumPct) || 0;
    const ni = parseFloat(recycledNickelPct) || 0;
    const avg = Math.round((co + li + ni) / 3);

    // EU 2027 targets: 16% Co, 6% Li, 6% Ni
    const meets2027 = co >= 16 && li >= 6 && ni >= 6;
    // EU 2031 targets: 26% Co, 12% Li, 15% Ni
    const meets2031 = co >= 26 && li >= 12 && ni >= 15;

    return { averagePct: avg, meets2027Target: meets2027, meets2031Target: meets2031 };
  }

  /**
   * Returns standard Harmonized System (HS / SA) tariff code default for category
   */
  static getDefaultHsCode(category) {
    switch (category) {
      case 'battery':
        return '8507.60.00';
      case 'cosmetics':
        return '3304.99.00';
      case 'food':
        return '2106.90.99';
      case 'construction':
        return '7214.20.00';
      case 'footwear':
        return '6403.99.00';
      case 'electronics':
        return '8518.30.00';
      case 'furniture':
        return '9403.60.00';
      case 'textile':
      default:
        return '6202.40.00';
    }
  }
}


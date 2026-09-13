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

    // Category weighting
    if (category === 'textile' || category === 'furniture') score += 0.8;
    else if (category === 'electronics') score += 0.5;

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
      if (name.includes('reciclado') || name.includes('recycled') || name.includes('econyl') || name.includes('bio')) {
        totalRecycled += (parseFloat(m.pct) || 0);
      }
    });

    return Math.min(100, Math.round(totalRecycled));
  }
}

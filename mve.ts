/**
 * Market Validation Engine (MVE)
 * Protocol: SLAVKO-V7-ORCHESTRATION
 * Governance: INSTITUTIONAL_SPECIFICATION_v1.0.md
 * 
 * Domain: Narrative Strength
 * Function: Quantifies validation signals, lead quality, and early-market resonance.
 */

export interface MVEInputs {
    monthlyLeads: number
    conversionRate: number
    rawValidationScore: number // User-provided confidence (0-100)
}

export interface MVEOutput {
    mvs: number // Market Validation Score
    rating: "STRONG" | "MODERATE" | "WEAK" | "SPECULATIVE"
    components: {
        signalStrength: number
        narrativeQuality: number
    }
}

/**
 * Deterministically calculates the Market Validation Score (MVS).
 * Implements the "Myth" quantification logic of the Triple-Engine Architecture.
 */
export function executeMVE(inputs: MVEInputs): MVEOutput {
    const { monthlyLeads, conversionRate, rawValidationScore } = inputs

    // 1. Signal Strength Calculation (Hard Metrics)
    // Volume: Cap at 500 leads for max score (MVP scale)
    const leadScore = Math.min(monthlyLeads / 5, 100)

    // Resonance: Cap at 10% conversion for max score
    const conversionScore = Math.min(conversionRate * 10, 100)

    // Signal Strength is a weighted mix: 40% Volume, 60% Resonance
    const signalStrength = Math.round((leadScore * 0.4) + (conversionScore * 0.6))

    // 2. Narrative Quality (Soft Metrics)
    const narrativeQuality = Math.round(rawValidationScore)

    // 3. Final MVS Synthesis
    // Institutional weighting: 70% Hard Signal, 30% Narrative
    let weightedScore = (signalStrength * 0.7) + (narrativeQuality * 0.3)

    // Governance Constraint: Narrative cannot salvage non-existent signal
    if (signalStrength < 15 && weightedScore > 45) {
        weightedScore = 45
    }

    const mvs = Math.round(weightedScore)

    // 4. Rating Determination
    let rating: MVEOutput["rating"]
    if (mvs >= 80) rating = "STRONG"
    else if (mvs >= 60) rating = "MODERATE"
    else if (mvs >= 40) rating = "WEAK"
    else rating = "SPECULATIVE"

    return {
        mvs,
        rating,
        components: {
            signalStrength,
            narrativeQuality
        }
    }
}
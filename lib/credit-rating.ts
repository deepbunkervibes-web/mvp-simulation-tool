/**
 * MVP Simulation Tool — Credit Rating Module
 * Protocol: SLAVKO-V7-ORCHESTRATION
 * Governance: INSTITUTIONAL_SPECIFICATION_v1.0.md
 */

export type CreditRating = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D"

export interface RatingFactor {
    score: number
    threshold: number
    rating: CreditRating
}

export const RATING_THRESHOLDS: Record<CreditRating, number> = {
    AAA: 90,
    AA: 80,
    A: 70,
    BBB: 60,
    BB: 50,
    B: 40,
    CCC: 0,
    D: -1 // Fallback/Error state
}

/**
 * Calculates the institutional credit rating based on a confidence score.
 * This is a deterministic, reputational-grade calculation.
 * 
 * @param score The confidence score (0-100)
 * @returns The CreditRating (AAA through CCC)
 */
export function calculateCreditRating(score: number): CreditRating {
    if (score >= RATING_THRESHOLDS.AAA) return "AAA"
    if (score >= RATING_THRESHOLDS.AA) return "AA"
    if (score >= RATING_THRESHOLDS.A) return "A"
    if (score >= RATING_THRESHOLDS.BBB) return "BBB"
    if (score >= RATING_THRESHOLDS.BB) return "BB"
    if (score >= RATING_THRESHOLDS.B) return "B"
    return "CCC"
}

/**
 * Returns the color token associated with a specific credit rating
 * for use in the ceremonial interface.
 */
export function getRatingColor(rating: CreditRating): string {
    switch (rating) {
        case "AAA": return "text-emerald-400"
        case "AA": return "text-emerald-500"
        case "A": return "text-teal-400"
        case "BBB": return "text-blue-400"
        case "BB": return "text-yellow-400"
        case "B": return "text-orange-400"
        case "CCC": return "text-red-500"
        case "D": return "text-red-700"
        default: return "text-gray-400"
    }
}

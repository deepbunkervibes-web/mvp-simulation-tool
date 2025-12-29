/**
 * Growth & Confidence Engine (GCE)
 * Protocol: SLAVKO-V7-ORCHESTRATION
 * Governance: INSTITUTIONAL_SPECIFICATION_v1.0.md
 * 
 * Domain: Risk Horizon
 * Function: Evaluates churn exposure, time horizon, and confidence stability.
 */

export interface GCEInputs {
    churnRate: number
    breakEvenMonth: number | null
    horizonMonths: number
}

export interface GCEOutput {
    gcs: number // Growth Confidence Score
    rating: "ROBUST" | "STABLE" | "FRAGILE" | "CRITICAL"
    components: {
        churnStability: number
        horizonRisk: number
    }
}

/**
 * Deterministically calculates the Growth Confidence Score (GCS).
 * Evaluates the structural stability of the growth model.
 */
export function executeGCE(inputs: GCEInputs): GCEOutput {
    const { churnRate, breakEvenMonth, horizonMonths } = inputs

    // 1. Churn Stability (Retention Mechanics)
    // Institutional Churn Thresholds:
    // < 2%: Elite (80-100)
    // 2-5%: Stable (50-80)
    // 5-10%: High Risk (0-50)
    // > 10%: Critical Failure (0)

    let churnScore = 0
    if (churnRate <= 2) {
        // Linear interpolation 0% -> 100, 2% -> 80
        churnScore = 100 - (churnRate * 10)
    } else if (churnRate <= 5) {
        // Linear interpolation 2% -> 80, 5% -> 50
        churnScore = 80 - ((churnRate - 2) * 10)
    } else if (churnRate <= 10) {
        // Linear interpolation 5% -> 50, 10% -> 0
        churnScore = 50 - ((churnRate - 5) * 10)
    } else {
        churnScore = 0
    }

    // 2. Horizon Risk (Time to Viability)
    // Evaluates if the break-even point is within a safe horizon.

    let horizonScore = 0
    if (breakEvenMonth === null) {
        // Never breaks even within horizon -> Maximum Risk
        horizonScore = 0
    } else {
        // Base score on absolute speed to break-even
        if (breakEvenMonth <= 6) horizonScore = 100       // Immediate validation
        else if (breakEvenMonth <= 12) horizonScore = 80  // Standard venture pace
        else if (breakEvenMonth <= 18) horizonScore = 60  // Extended runway needed
        else if (breakEvenMonth <= 24) horizonScore = 40  // High capital risk
        else horizonScore = 20                            // Speculative horizon

        // Penalty: If break-even is too close to the end of the simulation horizon
        const horizonUtilization = breakEvenMonth / horizonMonths
        if (horizonUtilization > 0.85) {
            horizonScore = Math.round(horizonScore * 0.5) // 50% penalty for razor-thin margin
        }
    }

    // 3. Final GCS Synthesis
    // Weighting: 50% Retention (Structural), 50% Horizon (Execution)
    const weightedScore = (churnScore * 0.5) + (horizonScore * 0.5)
    const gcs = Math.round(weightedScore)

    // 4. Rating Determination
    let rating: GCEOutput["rating"]
    if (gcs >= 80) rating = "ROBUST"
    else if (gcs >= 60) rating = "STABLE"
    else if (gcs >= 40) rating = "FRAGILE"
    else rating = "CRITICAL"

    return {
        gcs,
        rating,
        components: {
            churnStability: Math.round(churnScore),
            horizonRisk: Math.round(horizonScore)
        }
    }
}
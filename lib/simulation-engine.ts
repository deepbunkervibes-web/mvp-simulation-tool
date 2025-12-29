// FORMATDISC MVP Simulation Engine
// Core logic for business model validation

import { calculateCreditRating, type CreditRating } from "@/lib/credit-rating"
import { executeMVE } from "@/lib/engines/mve"
import { executeGCE } from "@/lib/engines/gce"

export interface SimulationInputs {
  monthlyLeads: number
  conversionRate: number // percentage
  price: number // monthly price
  churnRate: number // percentage
  cac: number // customer acquisition cost
  validationScore: number // 0-100
  horizonMonths: number
}

export interface MonthlyProjection {
  month: number
  newCustomers: number
  churnedCustomers: number
  totalCustomers: number
  mrr: number
  revenue: number
  costs: number
  profit: number
  cumulativeRevenue: number
  cumulativeCosts: number
  cumulativeProfit: number
}

export interface SimulationResult {
  projections: MonthlyProjection[]
  summary: {
    finalCustomers: number
    finalMRR: number
    totalRevenue: number
    totalCosts: number
    totalProfit: number
    breakEvenMonth: number | null
    ltv: number
    ltvCacRatio: number
    paybackPeriod: number
    growthRate: number
  }
  confidence: {
    score: number
    validationWeight: number
    unitEconomicsWeight: number
    growthWeight: number
    rating: CreditRating
    factors: {
      name: string
      score: number
      weight: number
      impact: "positive" | "neutral" | "negative"
    }[]
  }
  verdict: "GO" | "MAYBE" | "NO_GO"
  verdictReason: string
}

export function runSimulation(inputs: SimulationInputs): SimulationResult {
  const { monthlyLeads, conversionRate, price, churnRate, cac, validationScore, horizonMonths } = inputs

  // 1. Execute Market Validation Engine (MVE)
  const mveOutput = executeMVE({
    monthlyLeads,
    conversionRate,
    rawValidationScore: validationScore,
  })

  // Calculate derived metrics
  const monthlyNewCustomers = Math.round(monthlyLeads * (conversionRate / 100))
  const monthlyChurnRate = churnRate / 100
  const ltv = price / monthlyChurnRate
  const ltvCacRatio = ltv / cac
  const paybackPeriod = cac / price

  // Generate monthly projections
  const projections: MonthlyProjection[] = []
  let totalCustomers = 0
  let cumulativeRevenue = 0
  let cumulativeCosts = 0
  let breakEvenMonth: number | null = null

  for (let month = 1; month <= horizonMonths; month++) {
    const newCustomers = monthlyNewCustomers
    const churnedCustomers = Math.round(totalCustomers * monthlyChurnRate)
    totalCustomers = Math.max(0, totalCustomers + newCustomers - churnedCustomers)

    const mrr = totalCustomers * price
    const revenue = mrr
    const costs = newCustomers * cac + totalCustomers * price * 0.2 // 20% operational costs
    const profit = revenue - costs

    cumulativeRevenue += revenue
    cumulativeCosts += costs
    const cumulativeProfit = cumulativeRevenue - cumulativeCosts

    if (breakEvenMonth === null && cumulativeProfit > 0) {
      breakEvenMonth = month
    }

    projections.push({
      month,
      newCustomers,
      churnedCustomers,
      totalCustomers,
      mrr,
      revenue,
      costs,
      profit,
      cumulativeRevenue,
      cumulativeCosts,
      cumulativeProfit,
    })
  }

  const finalProjection = projections[projections.length - 1]
  const growthRate =
    projections.length > 1
      ? ((finalProjection.totalCustomers - projections[0].totalCustomers) /
        Math.max(1, projections[0].totalCustomers)) *
      100
      : 0

  // 2. Execute Growth & Confidence Engine (GCE)
  const gceOutput = executeGCE({
    churnRate,
    breakEvenMonth,
    horizonMonths,
  })

  // Calculate confidence score
  const factors: { name: string; score: number; weight: number; impact: "positive" | "neutral" | "negative" }[] = [
    {
      name: "Market Validation (MVS)",
      score: mveOutput.mvs,
      weight: 0.3,
      impact: mveOutput.mvs >= 70 ? "positive" : mveOutput.mvs >= 40 ? "neutral" : "negative",
    },
    {
      name: "LTV/CAC Ratio",
      score: Math.min(100, ltvCacRatio * 33.33),
      weight: 0.25,
      impact: ltvCacRatio >= 3 ? "positive" : ltvCacRatio >= 1.5 ? "neutral" : "negative",
    },
    {
      name: "Payback Period",
      score: Math.max(0, 100 - paybackPeriod * 8.33),
      weight: 0.15,
      impact: paybackPeriod <= 6 ? "positive" : paybackPeriod <= 12 ? "neutral" : "negative",
    },
    {
      name: "Growth Confidence (GCS)",
      score: gceOutput.gcs,
      weight: 0.3,
      impact: gceOutput.gcs >= 70 ? "positive" : gceOutput.gcs >= 40 ? "neutral" : "negative",
    },
  ]

  const confidenceScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0)

  // Determine verdict
  let verdict: "GO" | "MAYBE" | "NO_GO"
  let verdictReason: string

  if (confidenceScore >= 70 && ltvCacRatio >= 3 && mveOutput.mvs >= 60 && gceOutput.gcs >= 60) {
    verdict = "GO"
    verdictReason = "Strong unit economics, validated market demand, and healthy growth trajectory. Ready to scale."
  } else if (confidenceScore >= 45 || (ltvCacRatio >= 1.5 && mveOutput.mvs >= 40 && gceOutput.gcs >= 40)) {
    verdict = "MAYBE"
    verdictReason = "Promising indicators but needs optimization. Focus on improving weak areas before scaling."
  } else {
    verdict = "NO_GO"
    verdictReason = "Fundamentals need significant work. Revisit pricing, reduce CAC, or pivot the model."
  }

  return {
    projections,
    summary: {
      finalCustomers: finalProjection.totalCustomers,
      finalMRR: finalProjection.mrr,
      totalRevenue: finalProjection.cumulativeRevenue,
      totalCosts: finalProjection.cumulativeCosts,
      totalProfit: finalProjection.cumulativeProfit,
      breakEvenMonth,
      ltv,
      ltvCacRatio,
      paybackPeriod,
      growthRate,
    },
    confidence: {
      score: confidenceScore,
      rating: calculateCreditRating(confidenceScore),
      validationWeight: 30,
      unitEconomicsWeight: 40,
      growthWeight: 30,
      factors,
    },
    verdict,
    verdictReason,
  }
}



export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value))
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

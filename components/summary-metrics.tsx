"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Clock, Target, Percent, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { SimulationResult } from "@/lib/simulation-engine"
import { formatCurrency, formatNumber, formatPercent } from "@/lib/simulation-engine"

interface SummaryMetricsProps {
  result: SimulationResult
}

export function SummaryMetrics({ result }: SummaryMetricsProps) {
  const { summary } = result

  const metrics = [
    {
      icon: Users,
      label: "Final Customers",
      value: formatNumber(summary.finalCustomers),
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: DollarSign,
      label: "Monthly Recurring Revenue",
      value: formatCurrency(summary.finalMRR),
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      icon: TrendingUp,
      label: "Customer Lifetime Value",
      value: formatCurrency(summary.ltv),
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      icon: Target,
      label: "LTV/CAC Ratio",
      value: `${summary.ltvCacRatio.toFixed(2)}x`,
      color:
        summary.ltvCacRatio >= 3 ? "text-green-400" : summary.ltvCacRatio >= 1.5 ? "text-yellow-400" : "text-red-400",
      bg:
        summary.ltvCacRatio >= 3
          ? "bg-green-400/10"
          : summary.ltvCacRatio >= 1.5
            ? "bg-yellow-400/10"
            : "bg-red-400/10",
      trend: summary.ltvCacRatio >= 3 ? "up" : "down",
    },
    {
      icon: Clock,
      label: "Payback Period",
      value: `${summary.paybackPeriod.toFixed(1)} months`,
      color:
        summary.paybackPeriod <= 6
          ? "text-green-400"
          : summary.paybackPeriod <= 12
            ? "text-yellow-400"
            : "text-red-400",
      bg:
        summary.paybackPeriod <= 6
          ? "bg-green-400/10"
          : summary.paybackPeriod <= 12
            ? "bg-yellow-400/10"
            : "bg-red-400/10",
    },
    {
      icon: Percent,
      label: "Growth Rate",
      value: formatPercent(summary.growthRate),
      color: summary.growthRate > 0 ? "text-green-400" : "text-red-400",
      bg: summary.growthRate > 0 ? "bg-green-400/10" : "bg-red-400/10",
      trend: summary.growthRate > 0 ? "up" : "down",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className={`border-border/50 ${metric.bg} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              {metric.trend &&
                (metric.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                ))}
            </div>
            <div className={`text-xl font-bold font-mono ${metric.color}`}>{metric.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"
import { useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { analytics } from "@/lib/analytics"
import { CheckCircle2, AlertTriangle, XCircle, Rocket, ArrowRight, ShieldCheck, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SimulationResult } from "@/lib/simulation-engine"
import { formatCurrency } from "@/lib/simulation-engine"

interface VerdictCardProps {
  result: SimulationResult
  onExportPDF: () => void
}

export function VerdictCard({ result, onExportPDF }: VerdictCardProps) {
  const { verdict, verdictReason, summary, confidence } = result

  const verdictConfig = {
    GO: {
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/50",
      glow: "shadow-2xl shadow-green-900/40",
      label: "GO — PROCEED",
      sub: "Institutional indicators green",
    },
    MAYBE: {
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/50",
      glow: "shadow-2xl shadow-amber-900/40",
      label: "CAUTION — OPTIMIZE",
      sub: "Score below threshold",
    },
    NO_GO: {
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/50",
      glow: "shadow-2xl shadow-red-900/40",
      label: "NO GO — PIVOT",
      sub: "Fundamental risks detected",
    },
  }

  const config = verdictConfig[verdict]
  const Icon = config.icon

  useEffect(() => {
    analytics.capture("simulation_verdict_viewed", {
      verdict,
      creditRating: confidence.rating,
      score: confidence.score,
      revenue: summary.totalRevenue,
    })
  }, [verdict, confidence.rating, confidence.score, summary.totalRevenue])






  return (
    <Card className={`border ${config.border} ${config.bg} backdrop-blur-xl ${config.glow} overflow-hidden`}>
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-[1.2fr_2fr] h-full">
          {/* Left: Ceremonial Verdict */}
          <div className={`p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r ${config.border.replace('border-', 'border-opacity-30 border-')}`}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className={`h-5 w-5 ${config.color} opacity-80`} />
                <span className={`text-xs font-mono uppercase tracking-widest ${config.color} opacity-80`}>Kernel Verdict</span>
              </div>
              <div className={`flex items-start gap-4 mb-6`}>
                <div className={`p-3 rounded-full ${config.bg} border ${config.border}`}>
                  <Icon className={`h-8 w-8 ${config.color}`} />
                </div>
                <div>
                  <h3 className={`text-3xl font-black tracking-tighter ${config.color}`}>{config.label}</h3>
                  <p className="text-sm text-foreground/70 font-mono mt-1">{config.sub}</p>
                </div>
              </div>
              <p className="text-md text-foreground/80 leading-relaxed font-light">{verdictReason}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest block">Confidence Score</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-mono font-bold ${config.color}`}>{confidence.score.toFixed(0)}</span>
                    <span className="text-sm opacity-50">/100</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest block">Rating</span>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xl font-mono font-bold text-white tracking-widest">
                    {confidence.rating}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Executive Brief */}
          <div className="p-8 bg-black/20">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Executive Financial Brief</h4>
              <span className="text-xs font-mono text-muted-foreground/50">SLAVKO-V7-OUTPUT</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <MetricBox label="Projected ARR (Year 1)" value={formatCurrency(summary.finalMRR * 12)} highlight />
              <MetricBox label="Break-Even Point" value={summary.breakEvenMonth ? `Month ${summary.breakEvenMonth}` : "N/A"} status={summary.breakEvenMonth && summary.breakEvenMonth <= 12 ? "good" : "bad"} />
              <MetricBox
                label="LTV / CAC Ratio"
                value={`${summary.ltvCacRatio.toFixed(2)}x`}
                status={summary.ltvCacRatio >= 3 ? "good" : summary.ltvCacRatio >= 1.5 ? "warning" : "bad"}
              />
              <MetricBox label="Gross Margin" value="80%" /> {/* Mocked for now or added to engine */}
            </div>

            <div className="flex gap-3">
              <Button onClick={onExportPDF} className={`flex-1 ${config.bg} hover:${config.bg} text-white border ${config.border}`}>
                <Rocket className="h-4 w-4 mr-2" />
                Download Audit Report
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-white">
                Share Brief <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricBox({
  label,
  value,
  highlight,
  status,
}: {
  label: string
  value: string
  highlight?: boolean
  status?: "good" | "warning" | "bad"
}) {
  const statusColors = {
    good: "text-green-400",
    warning: "text-yellow-400",
    bad: "text-red-400",
  }

  return (
    <div className={`p-4 rounded-xl ${highlight ? "bg-white/5 border border-white/10" : "bg-transparent border border-white/5"}`}>
      <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold font-mono tracking-tight ${status ? statusColors[status] : "text-white"}`}>
        {value}
      </div>
    </div>
  )
}

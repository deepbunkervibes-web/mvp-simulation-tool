"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Gauge } from "lucide-react"

interface ConfidenceGaugeProps {
  score: number
  factors: {
    name: string
    score: number
    weight: number
    impact: "positive" | "neutral" | "negative"
  }[]
}

export function ConfidenceGauge({ score, factors }: ConfidenceGaugeProps) {
  const gaugeData = useMemo(() => {
    return [
      { name: "Score", value: score },
      { name: "Remaining", value: 100 - score },
    ]
  }, [score])

  const getScoreColor = (s: number) => {
    if (s >= 70) return "#22c55e"
    if (s >= 45) return "#f59e0b"
    return "#ef4444"
  }

  const getImpactColor = (impact: string) => {
    if (impact === "positive") return "text-green-400"
    if (impact === "neutral") return "text-yellow-400"
    return "text-red-400"
  }

  const getImpactBg = (impact: string) => {
    if (impact === "positive") return "bg-green-400/10"
    if (impact === "neutral") return "bg-yellow-400/10"
    return "bg-red-400/10"
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="h-5 w-5 text-purple-400" />
          Confidence Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Gauge */}
          <div className="relative h-[160px] w-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={getScoreColor(score)} />
                  <Cell fill="rgba(255,255,255,0.1)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center mt-4">
                <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
                  {Math.round(score)}
                </div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>

          {/* Factors */}
          <div className="flex-1 space-y-2">
            {factors.map((factor) => (
              <div
                key={factor.name}
                className={`flex items-center justify-between p-2 rounded-lg ${getImpactBg(factor.impact)}`}
              >
                <span className="text-sm">{factor.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono ${getImpactColor(factor.impact)}`}>
                    {Math.round(factor.score)}
                  </span>
                  <span className="text-xs text-muted-foreground">({Math.round(factor.weight * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

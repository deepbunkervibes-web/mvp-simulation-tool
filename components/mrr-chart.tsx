"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { DollarSign } from "lucide-react"
import type { MonthlyProjection } from "@/lib/simulation-engine"
import { formatCurrency } from "@/lib/simulation-engine"

interface MRRChartProps {
  projections: MonthlyProjection[]
  breakEvenMonth: number | null
}

export function MRRChart({ projections, breakEvenMonth }: MRRChartProps) {
  const chartData = useMemo(() => {
    return projections.map((p) => ({
      month: `M${p.month}`,
      monthNum: p.month,
      mrr: p.mrr,
      cumulative: p.cumulativeProfit,
    }))
  }, [projections])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          MRR & Cumulative Profit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 15, 20, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                formatter={(value: number) => [formatCurrency(value), ""]}
              />
              {breakEvenMonth && (
                <ReferenceLine
                  x={`M${breakEvenMonth}`}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  label={{
                    value: "Break-even",
                    fill: "#22c55e",
                    fontSize: 12,
                    position: "top",
                  }}
                />
              )}
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />
              <Area
                type="monotone"
                dataKey="mrr"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#mrrGradient)"
                name="MRR"
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cumulativeGradient)"
                name="Cumulative Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

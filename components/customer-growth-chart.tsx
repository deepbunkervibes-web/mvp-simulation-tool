"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart, Bar } from "recharts"
import { Users } from "lucide-react"
import type { MonthlyProjection } from "@/lib/simulation-engine"
import { formatNumber } from "@/lib/simulation-engine"

interface CustomerGrowthChartProps {
  projections: MonthlyProjection[]
}

export function CustomerGrowthChart({ projections }: CustomerGrowthChartProps) {
  const chartData = useMemo(() => {
    return projections.map((p) => ({
      month: `M${p.month}`,
      total: p.totalCustomers,
      new: p.newCustomers,
      churned: -p.churnedCustomers,
    }))
  }, [projections])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-blue-400" />
          Customer Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                tickFormatter={(value) => formatNumber(Math.abs(value))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 15, 20, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                formatter={(value: number, name: string) => [
                  formatNumber(Math.abs(value)),
                  name === "churned" ? "Churned" : name === "new" ? "New" : "Total",
                ]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#totalGradient)"
                name="Total Customers"
              />
              <Bar dataKey="new" fill="#22c55e" opacity={0.8} name="New Customers" />
              <Bar dataKey="churned" fill="#ef4444" opacity={0.8} name="Churned" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

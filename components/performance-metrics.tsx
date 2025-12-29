"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Package, Clock, Cpu } from "lucide-react"
import { useEffect, useState } from "react"

export function PerformanceMetrics() {
  const [score, setScore] = useState(0)
  const [metrics, setMetrics] = useState({
    bundleSize: 0,
    loadTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
  })

  useEffect(() => {
    // Animate score on mount
    const interval = setInterval(() => {
      setScore((prev) => {
        if (prev >= 87) {
          clearInterval(interval)
          return 87
        }
        return prev + 1
      })
    }, 20)

    // Set metrics
    setMetrics({
      bundleSize: 2.4,
      loadTime: 1.2,
      memoryUsage: 145,
      cpuUsage: 23,
    })

    return () => clearInterval(interval)
  }, [])

  const MetricRow = ({
    icon: Icon,
    label,
    value,
    status,
  }: {
    icon: any
    label: string
    value: string
    status: "optimal" | "moderate" | "high"
  }) => {
    const statusColors = {
      optimal: "text-green-400 bg-green-500/10 border-green-500/20",
      moderate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
      high: "text-red-400 bg-red-500/10 border-red-500/20",
    }

    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{value}</span>
          <Badge variant="outline" className={`text-xs ${statusColors[status]}`}>
            {status}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Performance Score</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score / 100) * 351.86} 351.86`}
              className="text-primary transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{score}</div>
              <div className="text-xs text-muted-foreground">/100</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1 border-t border-border/50 pt-4">
        <MetricRow icon={Package} label="Bundle Size" value="2.4 MB" status="optimal" />
        <MetricRow icon={Clock} label="Load Time" value="1.2s" status="optimal" />
        <MetricRow icon={TrendingUp} label="Memory Usage" value="145 MB" status="moderate" />
        <MetricRow icon={Cpu} label="CPU Usage" value="23%" status="optimal" />
      </div>
    </Card>
  )
}

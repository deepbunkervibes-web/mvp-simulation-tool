"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Activity, Cpu, Zap, TrendingUp, Database, Network } from "lucide-react"

interface MetricsProps {
  isAnalyzing: boolean
}

export function RealTimeMetrics({ isAnalyzing }: MetricsProps) {
  const [metrics, setMetrics] = useState({
    linesAnalyzed: 0,
    issuesFound: 0,
    throughput: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    analysisSpeed: 0,
  })

  useEffect(() => {
    if (!isAnalyzing) return

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        linesAnalyzed: Math.min(prev.linesAnalyzed + Math.floor(Math.random() * 50 + 20), 10000),
        issuesFound: Math.min(prev.issuesFound + Math.floor(Math.random() * 3), 50),
        throughput: Math.random() * 1000 + 500,
        cpuUsage: Math.random() * 30 + 40,
        memoryUsage: Math.random() * 20 + 50,
        analysisSpeed: Math.random() * 500 + 1000,
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [isAnalyzing])

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    unit,
    color,
  }: {
    icon: any
    label: string
    value: number
    unit: string
    color: string
  }) => (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className={`h-4 w-4 ${color}`} />
          {isAnalyzing && <div className={`h-2 w-2 rounded-full ${color.replace("text-", "bg-")} animate-pulse`} />}
        </div>
        <div className="text-2xl font-bold tabular-nums">
          {value.toFixed(0)}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </Card>
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <MetricCard icon={Database} label="Lines Analyzed" value={metrics.linesAnalyzed} unit="" color="text-blue-400" />
      <MetricCard icon={Activity} label="Issues Found" value={metrics.issuesFound} unit="" color="text-red-400" />
      <MetricCard icon={TrendingUp} label="Throughput" value={metrics.throughput} unit="L/s" color="text-green-400" />
      <MetricCard icon={Cpu} label="CPU Usage" value={metrics.cpuUsage} unit="%" color="text-purple-400" />
      <MetricCard icon={Network} label="Memory" value={metrics.memoryUsage} unit="%" color="text-yellow-400" />
      <MetricCard icon={Zap} label="Speed" value={metrics.analysisSpeed} unit="L/s" color="text-cyan-400" />
    </div>
  )
}

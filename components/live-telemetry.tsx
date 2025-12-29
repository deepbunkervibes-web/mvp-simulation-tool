"use client"

import { Card } from "@/components/ui/card"
import { LiveChart } from "@/components/live-chart"
import { useEffect, useState } from "react"

export function LiveTelemetry() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Auto-start telemetry after mount
    const timer = setTimeout(() => setIsActive(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Real-Time Telemetry</h3>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isActive ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
          <span className="text-xs text-muted-foreground">{isActive ? "Live" : "Offline"}</span>
        </div>
      </div>

      <div className="space-y-4">
        <LiveChart title="CPU Usage" color="rgb(34, 211, 238)" isActive={isActive} maxValue={100} />
        <LiveChart title="Memory Usage" color="rgb(251, 191, 36)" isActive={isActive} maxValue={100} />
        <LiveChart title="Analysis Throughput" color="rgb(16, 185, 129)" isActive={isActive} maxValue={2000} />
      </div>
    </Card>
  )
}

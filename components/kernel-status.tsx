"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, HardDrive, Activity, Thermometer } from "lucide-react"

interface KernelMetrics {
  timestamp: number
  cpu: { usage: number; cores: number; temperature?: number }
  memory: { used: number; total: number; percentage: number }
  disk: { read: number; write: number }
  network: { bytesIn: number; bytesOut: number }
  health: "healthy" | "warning" | "critical"
}

interface KernelStatusProps {
  metrics: KernelMetrics
  healthPrediction?: { prediction: string; confidence: number }
}

export function KernelStatus({ metrics, healthPrediction }: KernelStatusProps) {
  const healthColor = metrics.health === "healthy" ? "green" : metrics.health === "warning" ? "yellow" : "red"

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">System Health</h3>
        <Badge
          variant="outline"
          className={`bg-${healthColor}-500/10 text-${healthColor}-400 border-${healthColor}-500/20`}
        >
          {metrics.health.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cpu className="h-4 w-4" />
            <span>CPU Usage</span>
          </div>
          <div className="text-2xl font-bold">{metrics.cpu.usage.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">{metrics.cpu.cores} cores</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Memory</span>
          </div>
          <div className="text-2xl font-bold">{metrics.memory.percentage.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">
            {(metrics.memory.used / 1024).toFixed(1)} / {(metrics.memory.total / 1024).toFixed(1)} GB
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            <span>Disk I/O</span>
          </div>
          <div className="text-sm font-medium">R: {metrics.disk.read.toFixed(0)} MB/s</div>
          <div className="text-sm font-medium">W: {metrics.disk.write.toFixed(0)} MB/s</div>
        </div>

        {metrics.cpu.temperature && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Thermometer className="h-4 w-4" />
              <span>Temperature</span>
            </div>
            <div className="text-2xl font-bold">{metrics.cpu.temperature.toFixed(1)}°C</div>
          </div>
        )}
      </div>

      {healthPrediction && (
        <div className="mt-4 p-3 bg-background/50 rounded-lg border">
          <div className="text-xs font-medium text-muted-foreground mb-1">Health Prediction</div>
          <div className="text-sm">{healthPrediction.prediction}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Confidence: {Math.round(healthPrediction.confidence * 100)}%
          </div>
        </div>
      )}
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KernelStatus } from "@/components/kernel-status"
import { Activity, Zap, TrendingUp, Database } from "lucide-react"

interface TelemetryData {
  kernelMetrics: any
  healthPrediction: any
  analysisHistory: Array<{
    timestamp: number
    filesAnalyzed: number
    issuesFound: number
    autoFixesApplied: number
  }>
}

export function TelemetryDashboard() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const response = await fetch("/api/telemetry")
        const data = await response.json()
        setTelemetry(data)
      } catch (error) {
        console.error("[v0] Telemetry fetch error:", error)
      }
    }

    fetchTelemetry()

    // Update every 5 seconds if live
    const interval = isLive ? setInterval(fetchTelemetry, 5000) : null

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLive])

  if (!telemetry) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-2">
          <Activity className="h-8 w-8 animate-pulse mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading telemetry data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={isLive ? "default" : "outline"} className="gap-1">
            <span className={`h-2 w-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
            {isLive ? "Live" : "Paused"}
          </Badge>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLive ? "Pause" : "Resume"}
          </button>
        </div>
        <div className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KernelStatus metrics={telemetry.kernelMetrics} healthPrediction={telemetry.healthPrediction} />

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>Total Analyses</span>
              </div>
              <div className="text-2xl font-bold">{telemetry.analysisHistory.length}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Issues Found</span>
              </div>
              <div className="text-2xl font-bold">
                {telemetry.analysisHistory.reduce((sum, a) => sum + a.issuesFound, 0)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Auto-Fixes</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {telemetry.analysisHistory.reduce((sum, a) => sum + a.autoFixesApplied, 0)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Files Analyzed</span>
              </div>
              <div className="text-2xl font-bold">
                {telemetry.analysisHistory.reduce((sum, a) => sum + a.filesAnalyzed, 0)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Analysis History</h3>
        <div className="space-y-2">
          {telemetry.analysisHistory.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">No analysis history yet</div>
          ) : (
            telemetry.analysisHistory
              .slice(-10)
              .reverse()
              .map((analysis, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="text-xs text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm">{analysis.filesAnalyzed} files analyzed</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs">
                      {analysis.issuesFound} issues
                    </Badge>
                    {analysis.autoFixesApplied > 0 && (
                      <Badge variant="outline" className="text-xs text-green-400 border-green-500/20">
                        {analysis.autoFixesApplied} auto-fixed
                      </Badge>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  )
}

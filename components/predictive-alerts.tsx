"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Zap } from "lucide-react"

interface Prediction {
  type: string
  confidence: number
  timeToImpact: string
  severity: "critical" | "warning" | "info"
  message: string
  recommendation: string
}

interface PredictiveAlertsProps {
  predictions: Prediction[]
}

export function PredictiveAlerts({ predictions }: PredictiveAlertsProps) {
  if (!predictions || predictions.length === 0) {
    return (
      <Card className="p-4 border-green-500/20 bg-green-500/5">
        <div className="flex items-center gap-2 text-green-400">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">No predicted issues</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {predictions.map((pred, idx) => (
        <Card
          key={idx}
          className={`p-4 border-${
            pred.severity === "critical" ? "red" : pred.severity === "warning" ? "yellow" : "blue"
          }-500/20 bg-${pred.severity === "critical" ? "red" : pred.severity === "warning" ? "yellow" : "blue"}-500/5`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={`h-5 w-5 mt-0.5 ${
                pred.severity === "critical"
                  ? "text-red-400"
                  : pred.severity === "warning"
                    ? "text-yellow-400"
                    : "text-blue-400"
              }`}
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{pred.message}</span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(pred.confidence * 100)}% confidence
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Impact: {pred.timeToImpact}
              </div>
              <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded">💡 {pred.recommendation}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

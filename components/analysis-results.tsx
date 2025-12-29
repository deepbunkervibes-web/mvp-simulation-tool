import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Info, XCircle, Zap } from "lucide-react"
import { PredictiveAlerts } from "@/components/predictive-alerts"
import { AutoFixPanel } from "@/components/auto-fix-panel"

interface AnalysisResultsProps {
  results: {
    security: Array<{ severity: string; message: string; line?: number }>
    performance: Array<{ severity: string; message: string; line?: number }>
    quality: Array<{ severity: string; message: string; line?: number }>
    summary: {
      critical: number
      warning: number
      info: number
    }
    predictions?: Array<{
      type: string
      confidence: number
      timeToImpact: string
      severity: string
      message: string
      recommendation: string
    }>
    autoFixes?: Array<{
      type: string
      confidence: number
      original: string
      fixed: string
      applied: boolean
    }>
  }
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-chart-4" />
      case "info":
        return <Info className="h-4 w-4 text-chart-2" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-chart-2" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      {results.autoFixes && results.autoFixes.length > 0 && <AutoFixPanel fixes={results.autoFixes} />}

      <div className="grid grid-cols-3 gap-4">
        <Card className="relative overflow-hidden p-4 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent animate-pulse" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-400" />
              <div className="text-2xl font-bold text-red-400 tabular-nums">{results.summary.critical}</div>
            </div>
            <div className="text-sm text-muted-foreground">Critical Issues</div>
          </div>
        </Card>
        <Card className="relative overflow-hidden p-4 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent animate-pulse" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <div className="text-2xl font-bold text-yellow-400 tabular-nums">{results.summary.warning}</div>
            </div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
        </Card>
        <Card className="relative overflow-hidden p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent animate-pulse" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Info className="h-4 w-4 text-blue-400" />
              <div className="text-2xl font-bold text-blue-400 tabular-nums">{results.summary.info}</div>
            </div>
            <div className="text-sm text-muted-foreground">Info</div>
          </div>
        </Card>
      </div>

      {results.predictions && results.predictions.length > 0 && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-sm" />
          <div className="relative bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="gradient-text">Predictive Intelligence</span>
              <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-400 border-purple-500/20">
                AI-Powered
              </Badge>
            </h3>
            <PredictiveAlerts predictions={results.predictions} />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Security Analysis
            <Badge variant="outline" className="ml-auto text-xs">
              {results.security.length} {results.security.length === 1 ? "issue" : "issues"}
            </Badge>
          </h3>
          <div className="space-y-2">
            {results.security.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-400 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-4 w-4" />
                No security issues found
              </div>
            ) : (
              results.security.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-all"
                >
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <p className="text-sm">{issue.message}</p>
                    {issue.line && <p className="text-xs text-muted-foreground mt-1">Line {issue.line}</p>}
                  </div>
                  <Badge variant={getSeverityColor(issue.severity) as any}>{issue.severity}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Performance Analysis
            <Badge variant="outline" className="ml-auto text-xs">
              {results.performance.length} {results.performance.length === 1 ? "issue" : "issues"}
            </Badge>
          </h3>
          <div className="space-y-2">
            {results.performance.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-400 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-4 w-4" />
                No performance issues found
              </div>
            ) : (
              results.performance.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-all"
                >
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <p className="text-sm">{issue.message}</p>
                    {issue.line && <p className="text-xs text-muted-foreground mt-1">Line {issue.line}</p>}
                  </div>
                  <Badge variant={getSeverityColor(issue.severity) as any}>{issue.severity}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Code Quality Analysis
            <Badge variant="outline" className="ml-auto text-xs">
              {results.quality.length} {results.quality.length === 1 ? "issue" : "issues"}
            </Badge>
          </h3>
          <div className="space-y-2">
            {results.quality.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-400 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-4 w-4" />
                No quality issues found
              </div>
            ) : (
              results.quality.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/30 transition-all"
                >
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <p className="text-sm">{issue.message}</p>
                    {issue.line && <p className="text-xs text-muted-foreground mt-1">Line {issue.line}</p>}
                  </div>
                  <Badge variant={getSeverityColor(issue.severity) as any}>{issue.severity}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

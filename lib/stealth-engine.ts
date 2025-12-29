// StealthEngine - Orchestrates all analyzers
import { UnifiedParser } from "./parsers/unified-parser"
import { SecurityAnalyzer } from "./analyzers/security-analyzer"
import { PerformanceAnalyzer } from "./analyzers/performance-analyzer"
import { QualityAnalyzer } from "./analyzers/quality-analyzer"
import { PredictiveMonitor, type Prediction } from "./stealth/predictive-monitor"
import { AutoRemediator, type AutoFix } from "./stealth/auto-remediator"
import { KernelMonitor, type KernelMetrics } from "./stealth/kernel-monitor"

export interface AnalysisResult {
  security: Array<{ severity: string; message: string; line?: number }>
  performance: Array<{ severity: string; message: string; line?: number }>
  quality: Array<{ severity: string; message: string; line?: number }>
  summary: {
    critical: number
    warning: number
    info: number
  }
  predictions?: Prediction[]
  autoFixes?: AutoFix[]
  kernelMetrics?: KernelMetrics
  healthPrediction?: { prediction: string; confidence: number }
}

export class StealthEngine {
  /**
   * Analyze code and return comprehensive results with predictions
   */
  static async analyze(code: string, language: "typescript" | "javascript" | "python"): Promise<AnalysisResult> {
    const kernelMetrics = KernelMonitor.collectMetrics()

    // Parse the code
    const parseResult = UnifiedParser.parse(code, language)

    if (parseResult.errors.length > 0) {
      return {
        security: parseResult.errors.map((e) => ({
          severity: "critical",
          message: e.message,
          line: e.line,
        })),
        performance: [],
        quality: [],
        summary: {
          critical: parseResult.errors.length,
          warning: 0,
          info: 0,
        },
        kernelMetrics,
      }
    }

    // Run all analyzers
    const securityAnalyzer = new SecurityAnalyzer()
    const performanceAnalyzer = new PerformanceAnalyzer()
    const qualityAnalyzer = new QualityAnalyzer()

    const security = securityAnalyzer.analyze(parseResult.ast, code)
    const performance = performanceAnalyzer.analyze(parseResult.ast, code)
    const quality = qualityAnalyzer.analyze(parseResult.ast, code)

    // Calculate summary
    const allIssues = [...security, ...performance, ...quality]
    const summary = {
      critical: allIssues.filter((i) => i.severity === "critical").length,
      warning: allIssues.filter((i) => i.severity === "warning").length,
      info: allIssues.filter((i) => i.severity === "info").length,
    }

    const predictions = PredictiveMonitor.predictIssues(code, parseResult.ast)

    const { code: fixedCode, fixes: autoFixes } = AutoRemediator.autoFix(code, allIssues)

    const healthPrediction = KernelMonitor.predictHealth()

    return {
      security,
      performance,
      quality,
      summary,
      predictions,
      autoFixes,
      kernelMetrics,
      healthPrediction,
    }
  }
}

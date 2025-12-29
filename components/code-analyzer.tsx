"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisResults } from "@/components/analysis-results"
import { KernelStatus } from "@/components/kernel-status"
import { RealTimeMetrics } from "@/components/real-time-metrics"
import { LiveChart } from "@/components/live-chart"
import { SystemArchitecture } from "@/components/system-architecture"
import { ParticleField } from "@/components/particle-field"
import { Play, Loader2, Sparkles } from "lucide-react"

export function CodeAnalyzer() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<"typescript" | "javascript" | "python">("typescript")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })
      const data = await response.json()
      console.log("[v0] Analysis complete:", data)
      setResults(data)
    } catch (error) {
      console.error("[v0] Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        <RealTimeMetrics isAnalyzing={isAnalyzing} />
      </div>

      {isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <LiveChart title="CPU Usage" color="rgb(168, 85, 247)" isActive={isAnalyzing} maxValue={100} />
          <LiveChart title="Analysis Throughput" color="rgb(34, 197, 94)" isActive={isAnalyzing} maxValue={2000} />
        </div>
      )}

      {(isAnalyzing || results) && (
        <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
          <SystemArchitecture isActive={isAnalyzing} />
        </div>
      )}

      {results?.kernelMetrics && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <KernelStatus metrics={results.kernelMetrics} healthPrediction={results.healthPrediction} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="relative p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all overflow-hidden">
          <ParticleField isActive={isAnalyzing} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Code Input</h2>
              <Tabs value={language} onValueChange={(v) => setLanguage(v as any)} className="w-auto">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger
                    value="typescript"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    TypeScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="javascript"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger
                    value="python"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Python
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for instant analysis..."
              className="min-h-[450px] font-mono text-sm bg-background/50 border-border/50 focus:border-primary/50 transition-colors resize-none"
            />
            <Button
              onClick={handleAnalyze}
              disabled={!code || isAnalyzing}
              className="w-full mt-6 h-12 text-base font-semibold bg-primary hover:bg-primary/90 glow-primary hover:glow-primary-strong transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
          <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
          {results ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <AnalysisResults results={results} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[450px] text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">Run analysis to see results</p>
              <p className="text-sm text-muted-foreground/70 mt-2">Powered by invisible AI</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

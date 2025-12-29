"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Loader2, AlertTriangle, TrendingUp } from "lucide-react"

interface GitDiff {
  file: string
  additions: number
  deletions: number
  changes: string[]
  impactScore: number
  isSecurityCritical: boolean
}

export function GitDiffAnalyzer() {
  const [diff, setDiff] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<GitDiff[] | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/git-diff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff }),
      })
      const data = await response.json()
      console.log("[v0] Git diff analysis complete:", data)
      setResults(data.files)
    } catch (error) {
      console.error("[v0] Git diff analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getImpactColor = (score: number) => {
    if (score >= 0.7) return "text-red-400 bg-red-500/10 border-red-500/20"
    if (score >= 0.4) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    return "text-green-400 bg-green-500/10 border-green-500/20"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Git Diff Input</h2>
          <GitBranch className="h-5 w-5 text-muted-foreground" />
        </div>
        <Textarea
          value={diff}
          onChange={(e) => setDiff(e.target.value)}
          placeholder="Paste your git diff here..."
          className="min-h-[400px] font-mono text-sm"
        />
        <Button onClick={handleAnalyze} disabled={!diff || isAnalyzing} className="w-full mt-4">
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <GitBranch className="mr-2 h-4 w-4" />
              Analyze Diff
            </>
          )}
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">High-Impact Changes</h2>
        {results ? (
          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                No high-impact changes detected
              </div>
            ) : (
              results.map((file, idx) => (
                <Card key={idx} className={`p-4 border ${getImpactColor(file.impactScore)}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-mono text-sm font-medium">{file.file}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="text-green-400">+{file.additions}</span>
                          <span className="text-red-400">-{file.deletions}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {Math.round(file.impactScore * 100)}% impact
                        </Badge>
                        {file.isSecurityCritical && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Security Critical
                          </Badge>
                        )}
                      </div>
                    </div>
                    {file.changes.length > 0 && (
                      <div className="mt-2 p-2 bg-background/50 rounded text-xs font-mono">
                        <div className="text-muted-foreground mb-1">Key changes:</div>
                        {file.changes.slice(0, 3).map((change, i) => (
                          <div key={i} className="text-green-400">
                            + {change}
                          </div>
                        ))}
                        {file.changes.length > 3 && (
                          <div className="text-muted-foreground mt-1">... and {file.changes.length - 3} more</div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            Paste a git diff to analyze
          </div>
        )}
      </Card>
    </div>
  )
}

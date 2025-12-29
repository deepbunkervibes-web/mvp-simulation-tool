"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Info } from "lucide-react"
import { useEffect, useState } from "react"

export function SecurityScore() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        if (prev >= 92) {
          clearInterval(interval)
          return 92
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-6 border-red-500/20 bg-card/50 backdrop-blur-sm glow-primary">
      <h3 className="text-lg font-semibold mb-4">Security Analysis</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-green-500/20 flex items-center justify-center bg-green-500/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{score}</div>
              <div className="text-xs text-muted-foreground">/100</div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1">
            <Shield className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-sm font-medium">Critical</span>
          </div>
          <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
            2
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Warning</span>
          </div>
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            1
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">Info</span>
          </div>
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            0
          </Badge>
        </div>
      </div>
    </Card>
  )
}

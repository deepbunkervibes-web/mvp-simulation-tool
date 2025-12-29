"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Wrench } from "lucide-react"

interface AutoFix {
  type: string
  confidence: number
  original: string
  fixed: string
  applied: boolean
}

interface AutoFixPanelProps {
  fixes: AutoFix[]
}

export function AutoFixPanel({ fixes }: AutoFixPanelProps) {
  if (!fixes || fixes.length === 0) {
    return null
  }

  return (
    <Card className="p-4 border-green-500/20 bg-green-500/5">
      <div className="flex items-center gap-2 mb-3">
        <Wrench className="h-4 w-4 text-green-400" />
        <span className="text-sm font-semibold text-green-400">Auto-Fixed Issues</span>
        <Badge variant="outline" className="ml-auto">
          {fixes.length} fixes applied
        </Badge>
      </div>
      <div className="space-y-2">
        {fixes.map((fix, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs">
            <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium">{fix.type.replace(/-/g, " ")}</div>
              <div className="text-muted-foreground">
                {fix.original} → {fix.fixed}
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {Math.round(fix.confidence * 100)}%
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

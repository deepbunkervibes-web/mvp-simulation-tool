"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Cpu, Database, Zap, Shield, TrendingUp, GitBranch } from "lucide-react"

interface SystemArchitectureProps {
  isActive: boolean
}

export function SystemArchitecture({ isActive }: SystemArchitectureProps) {
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isActive) {
      setActiveNodes(new Set())
      return
    }

    const nodes = ["parser", "security", "performance", "quality", "stealth", "predictor"]
    let currentIndex = 0

    const interval = setInterval(() => {
      setActiveNodes((prev) => {
        const next = new Set(prev)
        next.add(nodes[currentIndex])
        currentIndex = (currentIndex + 1) % nodes.length
        return next
      })
    }, 300)

    return () => clearInterval(interval)
  }, [isActive])

  const Node = ({ id, icon: Icon, label, color }: { id: string; icon: any; label: string; color: string }) => {
    const isActive = activeNodes.has(id)
    return (
      <div className="relative">
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            isActive ? `border-${color}-500 bg-${color}-500/10 shadow-lg shadow-${color}-500/20` : "border-border/50"
          }`}
        >
          <Icon className={`h-6 w-6 mx-auto mb-2 ${isActive ? `text-${color}-400` : "text-muted-foreground"}`} />
          <div className="text-xs text-center font-medium">{label}</div>
          {isActive && (
            <div className="absolute -top-1 -right-1">
              <div className={`h-3 w-3 rounded-full bg-${color}-400 animate-ping`} />
              <div className={`h-3 w-3 rounded-full bg-${color}-400 absolute top-0 right-0`} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">System Architecture</h3>
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
            {isActive ? "ACTIVE" : "IDLE"}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Node id="parser" icon={GitBranch} label="Parser" color="blue" />
          <Node id="security" icon={Shield} label="Security" color="red" />
          <Node id="performance" icon={TrendingUp} label="Performance" color="green" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Node id="quality" icon={Database} label="Quality" color="yellow" />
          <Node id="stealth" icon={Zap} label="Stealth AI" color="purple" />
          <Node id="predictor" icon={Cpu} label="Predictor" color="cyan" />
        </div>

        {isActive && (
          <div className="mt-6 p-3 bg-background/50 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-purple-400 font-medium">Multi-threaded analysis in progress...</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

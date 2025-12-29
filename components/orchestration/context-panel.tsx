"use client"

import type React from "react"

import { X, Activity, Server, Clock, Zap, RefreshCw, Shield, BarChart3, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QUICK_ACTIONS, type SystemStatus, type ExecutionEvent } from "./types"

interface ContextPanelProps {
  systemStatus: SystemStatus
  executionEvents: ExecutionEvent[]
  onQuickAction: (template: string) => void
  isOpen: boolean
  onClose: () => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  activity: Activity,
  shield: Shield,
  refresh: RefreshCw,
  chart: BarChart3,
}

export function ContextPanel({ systemStatus, executionEvents, onQuickAction, isOpen, onClose }: ContextPanelProps) {
  const getEventColor = (level: string) => {
    switch (level) {
      case "success":
        return "bg-success"
      case "warning":
        return "bg-warning"
      case "error":
        return "bg-destructive"
      case "executing":
        return "bg-primary animate-pulse"
      default:
        return "bg-primary"
    }
  }

  const getEventTextColor = (level: string) => {
    switch (level) {
      case "success":
        return "text-success"
      case "warning":
        return "text-warning"
      case "error":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed right-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-80 border-l border-border bg-card/95 backdrop-blur-md transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="flex items-center justify-between border-b border-border p-4 lg:hidden">
            <h2 className="font-semibold text-foreground">Live Environment</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop header */}
          <div className="hidden items-center justify-between border-b border-border p-4 lg:flex">
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <h2 className="text-sm font-semibold text-foreground">Live Environment</h2>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">{systemStatus.environment}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <Card className="border-border bg-secondary/20 overflow-hidden">
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Server className="h-3 w-3" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Cluster</span>
                  <span className="text-xs font-medium text-foreground">{systemStatus.cluster}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Region</span>
                  <span className="text-xs font-mono text-foreground">{systemStatus.region}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Load</span>
                    <span
                      className={cn(
                        "text-xs font-mono font-medium",
                        systemStatus.load > 70 ? "text-warning" : "text-foreground",
                      )}
                    >
                      {Math.round(systemStatus.load)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        systemStatus.load > 70 ? "bg-warning" : "bg-primary",
                      )}
                      style={{ width: `${systemStatus.load}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Services</span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      systemStatus.services.available === systemStatus.services.total ? "text-success" : "text-warning",
                    )}
                  >
                    {systemStatus.services.available}/{systemStatus.services.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Uptime</span>
                  <span className="text-xs font-medium text-success">{systemStatus.uptime}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <Zap className="h-3 w-3" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = iconMap[action.icon] || Zap
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="h-auto flex-col items-start gap-1 p-3 border-border bg-secondary/30 text-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-all"
                      onClick={() => onQuickAction(action.template)}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-medium">{action.label}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">{action.description}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <Card className="border-border bg-secondary/20 overflow-hidden">
              <CardHeader className="p-3 pb-2 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Clock className="h-3 w-3" />
                  Execution Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div role="log" aria-live="polite" className="max-h-60 overflow-y-auto divide-y divide-border/50">
                  {executionEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-2.5 p-3 hover:bg-secondary/30 transition-colors"
                    >
                      <div className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", getEventColor(event.level))} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs leading-relaxed", getEventTextColor(event.level))}>{event.message}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          {event.timestamp.toLocaleTimeString("en-US", { hour12: false })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>
    </>
  )
}

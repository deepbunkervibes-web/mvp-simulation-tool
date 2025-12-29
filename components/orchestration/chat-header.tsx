"use client"

import { Terminal, PanelRightOpen, PanelRightClose, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SystemStatus } from "./types"

interface ChatHeaderProps {
  systemStatus: SystemStatus
  onToggleContext: () => void
  isMobileContextOpen: boolean
}

export function ChatHeader({ systemStatus, onToggleContext, isMobileContextOpen }: ChatHeaderProps) {
  const allServicesUp = systemStatus.services.available === systemStatus.services.total

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4">
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">Orchestration Command</h1>
          <p className="text-[10px] text-muted-foreground font-mono">SlavkoKernel v2.1 | {systemStatus.region}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-1.5 text-xs">
            <Circle className={`h-2 w-2 fill-current ${allServicesUp ? "text-success" : "text-warning"}`} />
            <span className="text-muted-foreground font-medium">
              {systemStatus.services.available}/{systemStatus.services.total} Services
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground">Load:</span>
            <span className={`font-mono font-medium ${systemStatus.load > 70 ? "text-warning" : "text-foreground"}`}>
              {Math.round(systemStatus.load)}%
            </span>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleContext}>
          {isMobileContextOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}

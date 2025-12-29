"use client"

import type React from "react"

import { useState } from "react"
import {
  Check,
  AlertTriangle,
  Loader2,
  Info,
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCheck,
  Zap,
  User,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Message, ContentBlock, StatusLevel } from "./types"

interface ChatMessageProps {
  message: Message
  onAction?: (actionId: string) => void
}

export function ChatMessage({ message, onAction }: ChatMessageProps) {
  const [expandedJson, setExpandedJson] = useState<Record<string, boolean>>({})
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getStatusIcon = (level: StatusLevel) => {
    const iconClass = "h-3.5 w-3.5"
    switch (level) {
      case "success":
        return <Check className={cn(iconClass, "text-success")} />
      case "warning":
        return <AlertTriangle className={cn(iconClass, "text-warning")} />
      case "error":
        return <AlertTriangle className={cn(iconClass, "text-destructive")} />
      case "executing":
        return <Loader2 className={cn(iconClass, "animate-spin text-primary")} />
      default:
        return <Info className={cn(iconClass, "text-primary")} />
    }
  }

  const getStatusBadgeStyles = (level: StatusLevel) => {
    switch (level) {
      case "success":
        return "bg-success/10 text-success border-success/20"
      case "warning":
        return "bg-warning/10 text-warning border-warning/20"
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "executing":
        return "bg-primary/10 text-primary border-primary/20 animate-pulse"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="flex items-start gap-2 max-w-[85%]">
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground shadow-sm">
            {message.content.map((block, i) =>
              block.type === "text" ? (
                <p key={i} className="text-sm leading-relaxed">
                  {block.text}
                </p>
              ) : null,
            )}
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 animate-fade-in">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
          isSystem ? "bg-muted border-border" : "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20",
          message.content.some((b) => b.type === "status" && b.level === "executing") && "animate-ai-pulse",
        )}
      >
        <Bot className={cn("h-4 w-4", isSystem ? "text-muted-foreground" : "text-primary")} />
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        {message.content.map((block, index) => (
          <ContentBlockRenderer
            key={index}
            block={block}
            blockIndex={index}
            getStatusIcon={getStatusIcon}
            getStatusBadgeStyles={getStatusBadgeStyles}
            copyCode={copyCode}
            copiedCode={copiedCode}
            expandedJson={expandedJson}
            setExpandedJson={setExpandedJson}
            onAction={onAction}
          />
        ))}

        <time className="text-[10px] text-muted-foreground font-mono">
          {message.timestamp.toLocaleTimeString("en-US", { hour12: false })}
        </time>
      </div>
    </div>
  )
}

function ContentBlockRenderer({
  block,
  blockIndex,
  getStatusIcon,
  getStatusBadgeStyles,
  copyCode,
  copiedCode,
  expandedJson,
  setExpandedJson,
  onAction,
}: {
  block: ContentBlock
  blockIndex: number
  getStatusIcon: (level: StatusLevel) => React.ReactNode
  getStatusBadgeStyles: (level: StatusLevel) => string
  copyCode: (code: string, id: string) => void
  copiedCode: string | null
  expandedJson: Record<string, boolean>
  setExpandedJson: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  onAction?: (actionId: string) => void
}) {
  switch (block.type) {
    case "text":
      return <p className="text-sm text-foreground leading-relaxed">{block.text}</p>

    case "status":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider",
            getStatusBadgeStyles(block.level),
          )}
        >
          {getStatusIcon(block.level)}[{block.level}] {block.text}
        </span>
      )

    case "code":
      const codeId = `code-${blockIndex}`
      return (
        <div className="overflow-hidden rounded-lg border border-border bg-[oklch(0.07_0.015_240)]">
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-3 py-1.5">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              {block.language || "shell"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => copyCode(block.code, codeId)}
            >
              {copiedCode === codeId ? (
                <>
                  <CheckCheck className="h-3 w-3 mr-1 text-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="overflow-x-auto p-3">
            <code className="font-mono text-xs text-foreground">{block.code}</code>
          </pre>
        </div>
      )

    case "step":
      return (
        <div className="space-y-1.5 rounded-lg border border-border bg-secondary/20 p-3">
          {block.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              {getStatusIcon(step.status)}
              <span className="text-sm text-foreground">{step.label}</span>
            </div>
          ))}
        </div>
      )

    case "report":
      return (
        <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Zap className="h-3 w-3 text-primary" />
            <span>[STATUS REPORT]</span>
            <span className="text-foreground/60">Generated at {block.data.generatedAt}</span>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cluster</span>
              <span className="font-medium text-foreground">
                {block.data.cluster} | Load: {block.data.load}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Services</span>
              <span className="font-medium text-success">{block.data.services}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Incident</span>
              <span className="font-medium text-foreground">{block.data.lastIncident}</span>
            </div>
          </div>
        </div>
      )

    case "analysis":
      return (
        <div className="space-y-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-mono text-warning font-semibold">[ANALYZING]</span>{" "}
              <span className="text-muted-foreground">Correlating metrics from {block.sources}.</span>
            </p>
            <p className="text-sm">
              <span className="font-mono text-warning font-semibold">[IDENTIFIED]</span>{" "}
              <span className="text-foreground">{block.cause}</span>
            </p>
            <p className="text-sm">
              <span className="font-mono text-primary font-semibold">[RECOMMENDATION]</span>{" "}
              <span className="text-foreground">{block.recommendation}.</span>
              {block.requiresConfirmation && <span className="ml-1 text-muted-foreground">Execute?</span>}
            </p>
          </div>
          {block.requiresConfirmation && (
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={() => onAction?.("confirm-scale")}>
                Confirm
              </Button>
              <Button size="sm" variant="outline" onClick={() => onAction?.("cancel")}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )

    case "action":
      return (
        <Button size="sm" variant={block.confirm ? "default" : "outline"} onClick={() => onAction?.(block.actionId)}>
          {block.label}
        </Button>
      )

    case "json":
      const jsonId = `json-${blockIndex}`
      const isExpanded = expandedJson[jsonId]
      return (
        <div className="rounded-lg border border-border bg-[oklch(0.07_0.015_240)]">
          <button
            onClick={() => setExpandedJson((prev) => ({ ...prev, [jsonId]: !isExpanded }))}
            className="flex w-full items-center gap-2 p-2.5 text-left hover:bg-secondary/30 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
            <span className="font-mono text-xs text-muted-foreground">Response Data</span>
          </button>
          {isExpanded && (
            <pre className="overflow-x-auto border-t border-border p-3">
              <code className="font-mono text-xs text-foreground">{JSON.stringify(block.data, null, 2)}</code>
            </pre>
          )}
        </div>
      )

    default:
      return null
  }
}

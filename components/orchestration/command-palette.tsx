"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Command, Search, Rocket, Activity, Shield, RefreshCw, BarChart3, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuickAction } from "./types"

interface CommandPaletteProps {
  quickActions: QuickAction[]
  pastCommands: string[]
  onSelect: (item: { type: "action" | "command"; label: string; template?: string }) => void
}

function fuzzyMatch(query: string, items: Array<{ label: string; [key: string]: unknown }>) {
  const q = query.toLowerCase()
  return items.filter((item) => {
    const label = item.label.toLowerCase()
    let i = 0
    for (const char of q) {
      i = label.indexOf(char, i)
      if (i === -1) return false
      i++
    }
    return true
  })
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  activity: Activity,
  shield: Shield,
  refresh: RefreshCw,
  chart: BarChart3,
}

export function CommandPalette({ quickActions, pastCommands, onSelect }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allItems = useMemo(
    () => [
      ...quickActions.map((a) => ({
        type: "action" as const,
        id: a.id,
        label: a.label,
        template: a.template,
        icon: a.icon,
        description: a.description,
      })),
      ...pastCommands
        .slice(0, 5)
        .map((c, i) => ({ type: "command" as const, id: `cmd-${i}`, label: c, icon: "clock" })),
    ],
    [quickActions, pastCommands],
  )

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems
    return fuzzyMatch(query, allItems)
  }, [query, allItems])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((open) => !open)
        setQuery("")
        setSelectedIndex(0)
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = filteredItems[selectedIndex]
      if (item) {
        onSelect({ type: item.type, label: item.template || item.label, template: item.template })
        setIsOpen(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
          <button onClick={() => setIsOpen(false)} className="sm:hidden p-1 hover:bg-secondary rounded">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No results found for "{query}"</div>
          ) : (
            <>
              {/* Quick Actions section */}
              {filteredItems.some((item) => item.type === "action") && (
                <div className="px-3 py-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Actions
                  </span>
                </div>
              )}
              {filteredItems
                .filter((item) => item.type === "action")
                .map((item, index) => {
                  const actualIndex = filteredItems.findIndex((i) => i.id === item.id)
                  const Icon = iconMap[item.icon || ""] || Command
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        actualIndex === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50",
                      )}
                      onClick={() => {
                        onSelect({ type: item.type, label: item.template || item.label, template: item.template })
                        setIsOpen(false)
                      }}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          actualIndex === selectedIndex ? "text-primary-foreground" : "text-primary",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{item.label}</div>
                        {"description" in item && (
                          <div
                            className={cn(
                              "text-xs truncate",
                              actualIndex === selectedIndex ? "text-primary-foreground/70" : "text-muted-foreground",
                            )}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}

              {/* Recent Commands section */}
              {filteredItems.some((item) => item.type === "command") && (
                <div className="px-3 py-1.5 mt-2 border-t border-border pt-3">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Commands
                  </span>
                </div>
              )}
              {filteredItems
                .filter((item) => item.type === "command")
                .map((item) => {
                  const actualIndex = filteredItems.findIndex((i) => i.id === item.id)
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        actualIndex === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50",
                      )}
                      onClick={() => {
                        onSelect({ type: item.type, label: item.label })
                        setIsOpen(false)
                      }}
                    >
                      <Clock
                        className={cn(
                          "h-4 w-4 shrink-0",
                          actualIndex === selectedIndex ? "text-primary-foreground" : "text-muted-foreground",
                        )}
                      />
                      <span className="text-sm truncate">{item.label}</span>
                    </button>
                  )
                })}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono">↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono">↵</kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono">⌘K</kbd>
            <span>Toggle</span>
          </div>
        </div>
      </div>
    </div>
  )
}

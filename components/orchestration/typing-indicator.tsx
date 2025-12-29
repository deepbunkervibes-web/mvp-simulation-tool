import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 animate-ai-pulse">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 px-4 py-3 border border-border/50">
        <span className="h-2 w-2 rounded-full bg-primary typing-dot-1" />
        <span className="h-2 w-2 rounded-full bg-primary typing-dot-2" />
        <span className="h-2 w-2 rounded-full bg-primary typing-dot-3" />
        <span className="ml-2 text-xs text-muted-foreground">Processing...</span>
      </div>
    </div>
  )
}

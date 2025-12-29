"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "./chat-message"
import { TypingIndicator } from "./typing-indicator"
import type { Message } from "./types"

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  onInlineAction: (actionId: string) => void
  isProcessing: boolean
}

export function ChatPanel({ messages, onSendMessage, onInlineAction, isProcessing }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isProcessing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-4 p-4 pb-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onAction={onInlineAction} />
          ))}
          {isProcessing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative flex items-center gap-2 rounded-lg border border-border bg-input/50 px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <Command className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Issue a command or query system status..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isProcessing}
            />
            <div className="flex items-center gap-1.5">
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                Enter
              </kbd>
              <Button type="submit" disabled={!input.trim() || isProcessing} size="sm" className="h-7 w-7 p-0">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

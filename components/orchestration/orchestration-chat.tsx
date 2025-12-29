"use client"

import { useState, useCallback, useEffect } from "react"
import { ChatPanel } from "./chat-panel"
import { ContextPanel } from "./context-panel"
import { ChatHeader } from "./chat-header"
import { CommandPalette } from "./command-palette"
import { sendCommand } from "@/lib/orchestrate-client"
import { QUICK_ACTIONS, type Message, type SystemStatus, type ExecutionEvent, type StatusLevel } from "./types"

const initialMessages: Message[] = [
  {
    id: "1",
    role: "system",
    timestamp: new Date(),
    content: [
      { type: "status", level: "success", text: "System initialized" },
      { type: "text", text: "Orchestration engine online. Systems nominal. Awaiting command." },
    ],
  },
]

const initialStatus: SystemStatus = {
  cluster: "Staging",
  environment: "staging",
  load: 42,
  services: { available: 12, total: 12 },
  lastIncident: null,
  uptime: "99.97%",
  region: "eu-west-1",
}

const initialEvents: ExecutionEvent[] = [
  { id: "1", timestamp: new Date(Date.now() - 300000), level: "success", message: "Health check completed" },
  { id: "2", timestamp: new Date(Date.now() - 180000), level: "success", message: "Metrics sync from Prometheus" },
  { id: "3", timestamp: new Date(Date.now() - 60000), level: "info", message: "Certificate renewal scheduled" },
]

export function OrchestrationChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(initialStatus)
  const [executionEvents, setExecutionEvents] = useState<ExecutionEvent[]>(initialEvents)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobileContextOpen, setIsMobileContextOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        load: Math.max(20, Math.min(80, prev.load + (Math.random() - 0.5) * 10)),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const addExecutionEvent = useCallback((level: StatusLevel, message: string) => {
    const event: ExecutionEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
    }
    setExecutionEvents((prev) => [event, ...prev.slice(0, 19)])
  }, [])

  const handleSendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        timestamp: new Date(),
        content: [{ type: "text", text: content }],
      }
      setMessages((prev) => [...prev, userMessage])
      setIsProcessing(true)

      try {
        // Use streaming API
        await sendCommand(content, (chunk) => {
          // Update messages in real-time as they stream in
          if (chunk.messages.length > 0) {
            setMessages((prev) => {
              // Get user messages and system init
              const baseMessages = prev.filter((m) => m.role === "user" || (m.role === "system" && m.id === "1"))
              // Add new streamed messages
              return [...baseMessages, ...chunk.messages]
            })
          }

          // Update events in real-time
          if (chunk.events.length > 0) {
            setExecutionEvents((prev) => {
              const newEvents = chunk.events.filter((e) => !prev.some((existing) => existing.id === e.id))
              return [...newEvents, ...prev].slice(0, 20)
            })
          }

          // Update system status if received
          if (chunk.status) {
            setSystemStatus((prev) => ({
              ...prev,
              ...chunk.status,
              services: chunk.status.servicesUp
                ? { available: chunk.status.servicesUp, total: chunk.status.servicesTotal || prev.services.total }
                : prev.services,
            }))
          }
        })
      } catch (error) {
        // Fallback to mock response on error
        addExecutionEvent(
          "error",
          `Failed to execute command: ${error instanceof Error ? error.message : "Unknown error"}`,
        )
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          timestamp: new Date(),
          content: [
            { type: "status", level: "error", text: "Failed to process command." },
            { type: "text", text: "Please try again or check system connectivity." },
          ],
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsProcessing(false)
      }
    },
    [addExecutionEvent],
  )

  const handleQuickAction = useCallback(
    (template: string) => {
      handleSendMessage(template)
    },
    [handleSendMessage],
  )

  const handleInlineAction = useCallback(
    (actionId: string) => {
      if (actionId === "confirm-scale") {
        handleSendMessage("Confirm: Scale eu-west-1 frontend pods by +2")
      } else if (actionId === "cancel") {
        const cancelMessage: Message = {
          id: Date.now().toString(),
          role: "system",
          timestamp: new Date(),
          content: [{ type: "status", level: "info", text: "Action cancelled by user." }],
        }
        setMessages((prev) => [...prev, cancelMessage])
        addExecutionEvent("info", "Action cancelled")
      }
    },
    [handleSendMessage, addExecutionEvent],
  )

  const handleCommandPaletteSelect = useCallback(
    (item: { type: "action" | "command"; label: string; template?: string }) => {
      handleSendMessage(item.template || item.label)
    },
    [handleSendMessage],
  )

  // Get past commands for command palette
  const pastCommands = messages
    .filter((m) => m.role === "user")
    .map((m) => {
      const textBlock = m.content.find((b) => b.type === "text")
      return textBlock && "text" in textBlock ? textBlock.text : ""
    })
    .filter(Boolean)

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChatHeader
        systemStatus={systemStatus}
        onToggleContext={() => setIsMobileContextOpen(!isMobileContextOpen)}
        isMobileContextOpen={isMobileContextOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onInlineAction={handleInlineAction}
          isProcessing={isProcessing}
        />
        <ContextPanel
          systemStatus={systemStatus}
          executionEvents={executionEvents}
          onQuickAction={handleQuickAction}
          isOpen={isMobileContextOpen}
          onClose={() => setIsMobileContextOpen(false)}
        />
      </div>
      <CommandPalette quickActions={QUICK_ACTIONS} pastCommands={pastCommands} onSelect={handleCommandPaletteSelect} />
    </div>
  )
}

function generateAIResponse(input: string): Message {
  const lowerInput = input.toLowerCase()
  const timestamp = new Date()

  if (lowerInput.includes("deploy")) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      timestamp,
      content: [
        { type: "status", level: "executing", text: "Deployment command received." },
        {
          type: "code",
          language: "bash",
          code: "kubectl set image deployment/staging-frontend frontend=registry.io/app:v2.1.5",
        },
        { type: "status", level: "success", text: "Deployment initiated. Tracking rollout status..." },
        {
          type: "step",
          steps: [
            { label: "Image updated", status: "success" },
            { label: "Pods cycling", status: "success" },
            { label: "Rollout complete. All pods healthy.", status: "success" },
          ],
        },
      ],
    }
  }

  if (lowerInput.includes("status") || lowerInput.includes("report")) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      timestamp,
      content: [
        { type: "status", level: "success", text: "Status report generated." },
        {
          type: "report",
          data: {
            generatedAt: timestamp.toLocaleTimeString("en-US", { hour12: false }) + " UTC",
            cluster: "Staging",
            load: 45,
            services: "12/12 available",
            lastIncident: "None in last 24h",
          },
        },
        { type: "text", text: "Proceed with confidence." },
      ],
    }
  }

  if (lowerInput.includes("diagnose") || lowerInput.includes("analyze") || lowerInput.includes("latency")) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      timestamp,
      content: [
        {
          type: "status",
          level: "executing",
          text: "Correlating metrics from Prometheus and logs from Loki (last 30m).",
        },
        {
          type: "analysis",
          sources: "Prometheus and Loki (last 30m)",
          cause: "CPU throttling on eu-west-1 pods due to noisy neighbor (92% correlation)",
          recommendation: "Scale eu-west-1 frontend pods by +2",
          requiresConfirmation: true,
        },
      ],
    }
  }

  if (lowerInput.includes("rollback")) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      timestamp,
      content: [
        { type: "status", level: "warning", text: "Rollback in progress. Manual verification required." },
        {
          type: "step",
          steps: [
            { label: "Rollback initiated", status: "success" },
            { label: "Previous version restored", status: "success" },
            { label: "Manual verification at /health endpoint", status: "warning" },
          ],
        },
        {
          type: "action",
          label: "Verify Health",
          actionId: "verify-health",
          confirm: false,
        },
      ],
    }
  }

  if (lowerInput.includes("validate")) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      timestamp,
      content: [
        { type: "status", level: "executing", text: "Running validation checks..." },
        {
          type: "step",
          steps: [
            { label: "Configuration syntax validated", status: "success" },
            { label: "Resource limits within bounds", status: "success" },
            { label: "Network policies verified", status: "success" },
            { label: "All validation checks passed", status: "success" },
          ],
        },
        { type: "status", level: "success", text: "Validation complete. No issues detected." },
      ],
    }
  }

  if (lowerInput.includes("confirm") && lowerInput.includes("scale")) {
    return {
      id: Date.now().toString(),
      role: "assistant",
      timestamp,
      content: [
        { type: "status", level: "executing", text: "Scaling operation initiated." },
        {
          type: "code",
          language: "bash",
          code: "kubectl scale deployment/frontend --replicas=4 -n eu-west-1",
        },
        {
          type: "step",
          steps: [
            { label: "Scale command executed", status: "success" },
            { label: "New pods scheduled", status: "success" },
            { label: "Pods running and healthy", status: "success" },
          ],
        },
        { type: "status", level: "success", text: "Scaling complete. eu-west-1 now has 4 replicas." },
      ],
    }
  }

  return {
    id: Date.now().toString(),
    role: "assistant",
    timestamp,
    content: [
      { type: "status", level: "info", text: "Command acknowledged." },
      { type: "text", text: "Specify action: deploy, diagnose, validate, rollback, or status report." },
    ],
  }
}

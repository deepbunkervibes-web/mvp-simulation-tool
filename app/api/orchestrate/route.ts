import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { command } = await req.json()

  if (!command) {
    return new Response(JSON.stringify({ error: "Command required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const encoder = new TextEncoder()
  const mockResponses = generateMockResponse(command)

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of mockResponses) {
        // Simulate network latency for realistic streaming
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

function generateMockResponse(command: string) {
  const chunks: Array<{
    type: "message" | "event" | "status" | "end"
    data?: unknown
  }> = []

  const timestamp = new Date().toISOString()
  const lowerCommand = command.toLowerCase()

  // Initial executing status
  chunks.push({
    type: "message",
    data: {
      id: crypto.randomUUID(),
      role: "assistant",
      timestamp,
      content: [{ type: "status", level: "executing", text: `Processing: ${command.slice(0, 50)}...` }],
    },
  })

  // Add execution event
  chunks.push({
    type: "event",
    data: {
      id: crypto.randomUUID(),
      time: timestamp,
      level: "info",
      message: `Command received: ${command.slice(0, 40)}`,
    },
  })

  if (lowerCommand.includes("deploy")) {
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "executing",
        message: "Deployment initiated",
      },
    })
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: [
          {
            type: "code",
            language: "bash",
            code: "kubectl set image deployment/staging-frontend frontend=registry.io/app:v2.1.5",
          },
        ],
      },
    })
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: [
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
      },
    })
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "success",
        message: "Deployment completed successfully",
      },
    })
    chunks.push({ type: "status", data: { cluster: "staging", servicesUp: 12, servicesTotal: 12, load: 45 } })
  } else if (lowerCommand.includes("status") || lowerCommand.includes("report")) {
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: [
          { type: "status", level: "success", text: "Status report generated." },
          {
            type: "report",
            data: {
              generatedAt: new Date().toLocaleTimeString("en-US", { hour12: false }) + " UTC",
              cluster: "Staging",
              load: 42,
              services: "12/12 available",
              lastIncident: "None in last 24h",
            },
          },
          { type: "text", text: "Proceed with confidence." },
        ],
      },
    })
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "success",
        message: "Status report generated",
      },
    })
  } else if (
    lowerCommand.includes("diagnose") ||
    lowerCommand.includes("analyze") ||
    lowerCommand.includes("latency")
  ) {
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "info",
        message: "Correlating metrics from Prometheus and Loki",
      },
    })
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: [
          {
            type: "status",
            level: "executing",
            text: "Correlating metrics from Prometheus and logs from Loki (last 30m).",
          },
        ],
      },
    })
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: [
          {
            type: "analysis",
            sources: "Prometheus and Loki (last 30m)",
            cause: "CPU throttling on eu-west-1 pods due to noisy neighbor (92% correlation)",
            recommendation: "Scale eu-west-1 frontend pods by +2",
            requiresConfirmation: true,
          },
        ],
      },
    })
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "warning",
        message: "Analysis complete - action recommended",
      },
    })
  } else if (lowerCommand.includes("rollback")) {
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "warning",
        message: "Rollback initiated",
      },
    })
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
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
          { type: "action", label: "Verify Health", actionId: "verify-health", confirm: false },
        ],
      },
    })
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "success",
        message: "Rollback completed - verification pending",
      },
    })
  } else if (lowerCommand.includes("validate")) {
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "info",
        message: "Running validation checks",
      },
    })
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
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
      },
    })
    chunks.push({
      type: "event",
      data: { id: crypto.randomUUID(), time: new Date().toISOString(), level: "success", message: "Validation passed" },
    })
  } else if (lowerCommand.includes("confirm") && lowerCommand.includes("scale")) {
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: [
          { type: "status", level: "executing", text: "Scaling operation initiated." },
          { type: "code", language: "bash", code: "kubectl scale deployment/frontend --replicas=4 -n eu-west-1" },
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
      },
    })
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "success",
        message: "Scaling operation completed",
      },
    })
  } else {
    chunks.push({
      type: "message",
      data: {
        id: crypto.randomUUID(),
        role: "assistant",
        timestamp: new Date().toISOString(),
        content: [
          { type: "status", level: "info", text: "Command acknowledged." },
          { type: "text", text: "Specify action: deploy, diagnose, validate, rollback, or status report." },
        ],
      },
    })
    chunks.push({
      type: "event",
      data: {
        id: crypto.randomUUID(),
        time: new Date().toISOString(),
        level: "info",
        message: "Awaiting valid command",
      },
    })
  }

  chunks.push({ type: "end" })
  return chunks
}

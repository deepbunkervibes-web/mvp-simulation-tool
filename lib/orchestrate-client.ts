import type { Message, ExecutionEvent, SystemStatus } from "@/components/orchestration/types"

export interface StreamAccumulator {
  messages: Message[]
  events: ExecutionEvent[]
  status: Partial<SystemStatus> | null
}

export async function sendCommand(
  command: string,
  onChunk: (chunk: StreamAccumulator) => void,
): Promise<StreamAccumulator> {
  const accumulated: StreamAccumulator = { messages: [], events: [], status: null }

  const response = await fetch("/api/orchestrate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error("No response body")

  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6))

          if (data.type === "message" && data.data) {
            // Convert timestamp string to Date object
            const message: Message = {
              ...data.data,
              timestamp: new Date(data.data.timestamp),
            }
            accumulated.messages.push(message)
          }

          if (data.type === "event" && data.data) {
            const event: ExecutionEvent = {
              ...data.data,
              timestamp: new Date(data.data.time),
            }
            accumulated.events.push(event)
          }

          if (data.type === "status" && data.data) {
            accumulated.status = data.data
          }

          // Call onChunk with accumulated data for real-time updates
          onChunk({ ...accumulated })
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }

  return accumulated
}

export type MessageRole = "user" | "assistant" | "system"
export type StatusLevel = "executing" | "success" | "warning" | "error" | "info"

export interface TextBlock {
  type: "text"
  text: string
}

export interface CodeBlock {
  type: "code"
  language?: string
  code: string
}

export interface StatusBlock {
  type: "status"
  level: StatusLevel
  text: string
}

export interface ActionBlock {
  type: "action"
  label: string
  actionId: string
  confirm?: boolean
}

export interface StepBlock {
  type: "step"
  steps: Array<{ label: string; status: StatusLevel }>
}

export interface ReportBlock {
  type: "report"
  data: {
    generatedAt: string
    cluster: string
    load: number
    services: string
    lastIncident: string
  }
}

export interface AnalysisBlock {
  type: "analysis"
  sources: string
  cause: string
  recommendation: string
  requiresConfirmation: boolean
}

export interface JsonBlock {
  type: "json"
  data: Record<string, unknown>
}

export type ContentBlock =
  | TextBlock
  | CodeBlock
  | StatusBlock
  | ActionBlock
  | StepBlock
  | ReportBlock
  | AnalysisBlock
  | JsonBlock

export interface Message {
  id: string
  role: MessageRole
  timestamp: Date
  content: ContentBlock[]
}

export interface SystemStatus {
  cluster: string
  environment: "production" | "staging" | "development"
  load: number
  services: { available: number; total: number }
  lastIncident: string | null
  uptime: string
  region: string
}

export interface ExecutionEvent {
  id: string
  timestamp: Date
  level: StatusLevel
  message: string
  meta?: Record<string, unknown>
}

export interface QuickAction {
  id: "deploy" | "diagnose" | "validate" | "rollback" | "status"
  label: string
  icon: string
  template: string
  description: string
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "deploy",
    label: "Deploy",
    icon: "rocket",
    template: "Deploy frontend v2.1.5 to staging",
    description: "Deploy application to environment",
  },
  {
    id: "diagnose",
    label: "Diagnose",
    icon: "activity",
    template: "Diagnose latency spike on eu-west-1 last 30m",
    description: "Analyze system performance issues",
  },
  {
    id: "validate",
    label: "Validate",
    icon: "shield",
    template: "Validate API schema drift vs contract v1.4",
    description: "Verify configuration and schemas",
  },
  {
    id: "rollback",
    label: "Rollback",
    icon: "refresh",
    template: "Rollback last release on staging",
    description: "Revert to previous deployment",
  },
  {
    id: "status",
    label: "Status Report",
    icon: "chart",
    template: "Status report: staging cluster",
    description: "Generate environment status",
  },
]

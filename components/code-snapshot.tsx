"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Sparkles } from "lucide-react"

export function CodeSnapshot() {
  const issues = [
    {
      severity: "critical",
      title: "SQL Injection vulnerability",
      file: "api/users.ts",
      line: 45,
      code: `const query = \`SELECT * FROM users WHERE id = \${userId}\`;`,
      suggestion: "Use parameterized queries",
    },
    {
      severity: "warning",
      title: "Unused variable detected",
      file: "components/Header.tsx",
      line: 12,
      code: `const unusedVar = 'test';`,
      suggestion: "Remove unused variable",
    },
    {
      severity: "info",
      title: "Consider using async/await",
      file: "utils/api.ts",
      line: 23,
      code: `return fetch(url).then(res => res.json());`,
      suggestion: "Modern async/await syntax is more readable",
    },
  ]

  const IssueCard = ({ issue }: { issue: (typeof issues)[0] }) => {
    const severityColors = {
      critical: "border-red-500/30 bg-red-500/5",
      warning: "border-yellow-500/30 bg-yellow-500/5",
      info: "border-blue-500/30 bg-blue-500/5",
    }

    const severityBadgeColors = {
      critical: "bg-red-500/20 text-red-400 border-red-500/30",
      warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    }

    return (
      <div className={`p-4 rounded-lg border ${severityColors[issue.severity as keyof typeof severityColors]} mb-3`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="font-medium text-sm">{issue.title}</span>
          </div>
          <Badge variant="outline" className={severityBadgeColors[issue.severity as keyof typeof severityBadgeColors]}>
            {issue.severity.toUpperCase()}
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          {issue.file} (line {issue.line})
        </div>

        <div className="bg-background/80 rounded p-3 mb-3 font-mono text-xs">
          <div className="text-muted-foreground mb-1">43 |</div>
          <div className="text-red-400 bg-red-500/10 px-2 py-1 rounded">44 | {issue.code}</div>
          <div className="text-muted-foreground mt-1">45 |</div>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground mb-3">
          <Sparkles className="h-3 w-3 mt-0.5 text-purple-400" />
          <span>{issue.suggestion}</span>
        </div>

        <Button size="sm" className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Auto-Fix
        </Button>
      </div>
    )
  }

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Code Analysis</h3>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="fixed">Fixed</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="max-h-[600px] overflow-y-auto">
          {issues.map((issue, idx) => (
            <IssueCard key={idx} issue={issue} />
          ))}
        </TabsContent>

        <TabsContent value="fixed" className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No auto-fixed issues yet</p>
        </TabsContent>

        <TabsContent value="predictions" className="text-center py-8">
          <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">AI predictions will appear here</p>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

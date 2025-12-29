// PerformanceAnalyzer - Detects performance issues
import type { ParsedNode } from "../parsers/unified-parser"
import { UnifiedParser } from "../parsers/unified-parser"

export interface PerformanceIssue {
  severity: "critical" | "warning" | "info"
  message: string
  line?: number
}

export class PerformanceAnalyzer {
  private issues: PerformanceIssue[] = []

  analyze(ast: ParsedNode | null, code: string): PerformanceIssue[] {
    this.issues = []

    if (!ast) return this.issues

    // Check for common performance issues
    this.checkNestedLoops(ast)
    this.checkLargeArrayOperations(ast)
    this.checkMemoryLeaks(code)
    this.checkIneffientDOM(code)

    return this.issues
  }

  private checkNestedLoops(ast: ParsedNode): void {
    let loopDepth = 0

    const checkLoop = (node: ParsedNode) => {
      loopDepth++
      if (loopDepth > 2) {
        this.issues.push({
          severity: "warning",
          message: `Nested loops detected (depth: ${loopDepth}) - consider optimization`,
          line: node.loc?.start.line,
        })
      }

      UnifiedParser.walk(node, {
        ForStatement: checkLoop,
        WhileStatement: checkLoop,
        DoWhileStatement: checkLoop,
        ForInStatement: checkLoop,
        ForOfStatement: checkLoop,
      })

      loopDepth--
    }

    UnifiedParser.walk(ast, {
      ForStatement: checkLoop,
      WhileStatement: checkLoop,
      DoWhileStatement: checkLoop,
      ForInStatement: checkLoop,
      ForOfStatement: checkLoop,
    })
  }

  private checkLargeArrayOperations(ast: ParsedNode): void {
    UnifiedParser.walk(ast, {
      CallExpression: (node: ParsedNode) => {
        const methodName = node.callee?.property?.name
        if (["map", "filter", "reduce", "forEach"].includes(methodName)) {
          // Check if chained
          if (node.callee?.object?.callee?.property?.name) {
            this.issues.push({
              severity: "info",
              message: "Chained array operations detected - consider combining for better performance",
              line: node.loc?.start.line,
            })
          }
        }
      },
    })
  }

  private checkMemoryLeaks(code: string): void {
    // Check for potential memory leaks
    const lines = code.split("\n")

    lines.forEach((line, index) => {
      // Check for event listeners without cleanup
      if (line.includes("addEventListener") && !code.includes("removeEventListener")) {
        this.issues.push({
          severity: "warning",
          message: "Event listener added without cleanup - potential memory leak",
          line: index + 1,
        })
      }

      // Check for setInterval without clearInterval
      if (line.includes("setInterval") && !code.includes("clearInterval")) {
        this.issues.push({
          severity: "warning",
          message: "setInterval used without clearInterval - potential memory leak",
          line: index + 1,
        })
      }
    })
  }

  private checkIneffientDOM(code: string): void {
    const lines = code.split("\n")

    lines.forEach((line, index) => {
      // Check for DOM manipulation in loops
      if (line.includes("appendChild") || line.includes("innerHTML")) {
        this.issues.push({
          severity: "info",
          message: "DOM manipulation detected - batch updates for better performance",
          line: index + 1,
        })
      }
    })
  }
}

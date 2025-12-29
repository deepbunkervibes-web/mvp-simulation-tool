// SecurityAnalyzer - Detects security vulnerabilities
import type { ParsedNode } from "../parsers/unified-parser"
import { UnifiedParser } from "../parsers/unified-parser"

export interface SecurityIssue {
  severity: "critical" | "warning" | "info"
  message: string
  line?: number
}

export class SecurityAnalyzer {
  private issues: SecurityIssue[] = []

  analyze(ast: ParsedNode | null, code: string): SecurityIssue[] {
    this.issues = []

    if (!ast) return this.issues

    // Check for common security issues
    this.checkEvalUsage(ast)
    this.checkDangerousHTML(ast, code)
    this.checkSQLInjection(code)
    this.checkXSS(code)
    this.checkHardcodedSecrets(code)

    return this.issues
  }

  private checkEvalUsage(ast: ParsedNode): void {
    UnifiedParser.walk(ast, {
      CallExpression: (node: ParsedNode) => {
        if (node.callee?.name === "eval" || node.callee?.property?.name === "eval") {
          this.issues.push({
            severity: "critical",
            message: "Use of eval() detected - potential code injection vulnerability",
            line: node.loc?.start.line,
          })
        }
      },
    })
  }

  private checkDangerousHTML(ast: ParsedNode, code: string): void {
    // Check for dangerouslySetInnerHTML in React
    if (code.includes("dangerouslySetInnerHTML")) {
      const lines = code.split("\n")
      lines.forEach((line, index) => {
        if (line.includes("dangerouslySetInnerHTML")) {
          this.issues.push({
            severity: "warning",
            message: "dangerouslySetInnerHTML usage detected - ensure content is sanitized",
            line: index + 1,
          })
        }
      })
    }
  }

  private checkSQLInjection(code: string): void {
    // Check for potential SQL injection patterns
    const sqlPatterns = [/query\s*\(\s*[`'"].*\$\{/, /execute\s*\(\s*[`'"].*\$\{/, /sql\s*=\s*[`'"].*\+/]

    const lines = code.split("\n")
    lines.forEach((line, index) => {
      sqlPatterns.forEach((pattern) => {
        if (pattern.test(line)) {
          this.issues.push({
            severity: "critical",
            message: "Potential SQL injection vulnerability - use parameterized queries",
            line: index + 1,
          })
        }
      })
    })
  }

  private checkXSS(code: string): void {
    // Check for potential XSS vulnerabilities
    const xssPatterns = [/innerHTML\s*=/, /document\.write\s*\(/, /\.html\s*\(/]

    const lines = code.split("\n")
    lines.forEach((line, index) => {
      xssPatterns.forEach((pattern) => {
        if (pattern.test(line)) {
          this.issues.push({
            severity: "warning",
            message: "Potential XSS vulnerability - sanitize user input before rendering",
            line: index + 1,
          })
        }
      })
    })
  }

  private checkHardcodedSecrets(code: string): void {
    // Check for hardcoded secrets
    const secretPatterns = [
      { pattern: /api[_-]?key\s*=\s*['"]\w+['"]/, message: "Hardcoded API key detected" },
      { pattern: /password\s*=\s*['"]\w+['"]/, message: "Hardcoded password detected" },
      { pattern: /secret\s*=\s*['"]\w+['"]/, message: "Hardcoded secret detected" },
      { pattern: /token\s*=\s*['"]\w+['"]/, message: "Hardcoded token detected" },
    ]

    const lines = code.split("\n")
    lines.forEach((line, index) => {
      secretPatterns.forEach(({ pattern, message }) => {
        if (pattern.test(line.toLowerCase())) {
          this.issues.push({
            severity: "critical",
            message,
            line: index + 1,
          })
        }
      })
    })
  }
}

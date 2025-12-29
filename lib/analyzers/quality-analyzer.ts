// QualityAnalyzer - Checks code quality and best practices
import type { ParsedNode } from "../parsers/unified-parser"
import { UnifiedParser } from "../parsers/unified-parser"

export interface QualityIssue {
  severity: "critical" | "warning" | "info"
  message: string
  line?: number
}

export class QualityAnalyzer {
  private issues: QualityIssue[] = []

  analyze(ast: ParsedNode | null, code: string): QualityIssue[] {
    this.issues = []

    if (!ast) return this.issues

    // Check for code quality issues
    this.checkFunctionComplexity(ast)
    this.checkCodeDuplication(code)
    this.checkNamingConventions(ast)
    this.checkComments(code)
    this.checkErrorHandling(ast)

    return this.issues
  }

  private checkFunctionComplexity(ast: ParsedNode): void {
    UnifiedParser.walk(ast, {
      FunctionDeclaration: (node: ParsedNode) => {
        const complexity = this.calculateComplexity(node)
        if (complexity > 10) {
          this.issues.push({
            severity: "warning",
            message: `High cyclomatic complexity (${complexity}) - consider refactoring`,
            line: node.loc?.start.line,
          })
        }
      },
      FunctionExpression: (node: ParsedNode) => {
        const complexity = this.calculateComplexity(node)
        if (complexity > 10) {
          this.issues.push({
            severity: "warning",
            message: `High cyclomatic complexity (${complexity}) - consider refactoring`,
            line: node.loc?.start.line,
          })
        }
      },
      ArrowFunctionExpression: (node: ParsedNode) => {
        const complexity = this.calculateComplexity(node)
        if (complexity > 10) {
          this.issues.push({
            severity: "warning",
            message: `High cyclomatic complexity (${complexity}) - consider refactoring`,
            line: node.loc?.start.line,
          })
        }
      },
    })
  }

  private calculateComplexity(node: ParsedNode): number {
    let complexity = 1

    UnifiedParser.walk(node, {
      IfStatement: () => complexity++,
      ForStatement: () => complexity++,
      WhileStatement: () => complexity++,
      DoWhileStatement: () => complexity++,
      SwitchCase: () => complexity++,
      LogicalExpression: (n: ParsedNode) => {
        if (n.operator === "&&" || n.operator === "||") complexity++
      },
      ConditionalExpression: () => complexity++,
    })

    return complexity
  }

  private checkCodeDuplication(code: string): void {
    const lines = code.split("\n").filter((line) => line.trim().length > 10)
    const duplicates = new Map<string, number[]>()

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (!duplicates.has(trimmed)) {
        duplicates.set(trimmed, [])
      }
      duplicates.get(trimmed)!.push(index + 1)
    })

    duplicates.forEach((lineNumbers, line) => {
      if (lineNumbers.length > 2) {
        this.issues.push({
          severity: "info",
          message: `Duplicate code detected (${lineNumbers.length} occurrences) - consider extracting to function`,
          line: lineNumbers[0],
        })
      }
    })
  }

  private checkNamingConventions(ast: ParsedNode): void {
    UnifiedParser.walk(ast, {
      VariableDeclarator: (node: ParsedNode) => {
        const name = node.id?.name
        if (name && name.length === 1 && !["i", "j", "k", "x", "y", "z"].includes(name)) {
          this.issues.push({
            severity: "info",
            message: `Single letter variable name '${name}' - use descriptive names`,
            line: node.loc?.start.line,
          })
        }
      },
      FunctionDeclaration: (node: ParsedNode) => {
        const name = node.id?.name
        if (name && name[0] === name[0].toUpperCase() && !name.startsWith("_")) {
          this.issues.push({
            severity: "info",
            message: `Function '${name}' starts with uppercase - use camelCase for functions`,
            line: node.loc?.start.line,
          })
        }
      },
    })
  }

  private checkComments(code: string): void {
    const lines = code.split("\n")
    const codeLines = lines.filter(
      (line) => line.trim() && !line.trim().startsWith("//") && !line.trim().startsWith("/*"),
    )
    const commentLines = lines.filter((line) => line.trim().startsWith("//") || line.trim().startsWith("/*"))

    const ratio = commentLines.length / Math.max(codeLines.length, 1)

    if (ratio < 0.05 && codeLines.length > 20) {
      this.issues.push({
        severity: "info",
        message: "Low comment ratio - consider adding more documentation",
      })
    }
  }

  private checkErrorHandling(ast: ParsedNode): void {
    let hasTryCatch = false

    UnifiedParser.walk(ast, {
      TryStatement: () => {
        hasTryCatch = true
      },
    })

    // Check for async functions without error handling
    UnifiedParser.walk(ast, {
      FunctionDeclaration: (node: ParsedNode) => {
        if (node.async && !hasTryCatch) {
          this.issues.push({
            severity: "warning",
            message: "Async function without try-catch - add error handling",
            line: node.loc?.start.line,
          })
        }
      },
    })
  }
}

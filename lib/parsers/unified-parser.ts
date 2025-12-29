// UnifiedParser - Handles parsing of different file types into AST
import * as acorn from "acorn"

export interface ParsedNode {
  type: string
  start: number
  end: number
  loc?: {
    start: { line: number; column: number }
    end: { line: number; column: number }
  }
  [key: string]: any
}

export interface ParseResult {
  ast: ParsedNode | null
  errors: Array<{ message: string; line?: number }>
  language: string
}

export class UnifiedParser {
  /**
   * Parse code into an AST based on language
   */
  static parse(code: string, language: "typescript" | "javascript" | "python"): ParseResult {
    try {
      if (language === "typescript" || language === "javascript") {
        return this.parseJavaScript(code, language)
      } else if (language === "python") {
        return this.parsePython(code)
      }

      return {
        ast: null,
        errors: [{ message: `Unsupported language: ${language}` }],
        language,
      }
    } catch (error) {
      return {
        ast: null,
        errors: [{ message: error instanceof Error ? error.message : "Parse error" }],
        language,
      }
    }
  }

  /**
   * Parse JavaScript/TypeScript using Acorn
   */
  private static parseJavaScript(code: string, language: string): ParseResult {
    try {
      const ast = acorn.parse(code, {
        ecmaVersion: "latest",
        sourceType: "module",
        locations: true,
      }) as ParsedNode

      return {
        ast,
        errors: [],
        language,
      }
    } catch (error: any) {
      return {
        ast: null,
        errors: [
          {
            message: error.message || "JavaScript parse error",
            line: error.loc?.line,
          },
        ],
        language,
      }
    }
  }

  /**
   * Parse Python (simplified - pattern matching based)
   */
  private static parsePython(code: string): ParseResult {
    // For Python, we'll use pattern matching since we can't run Python parser in browser
    // This is a simplified approach for demonstration
    const lines = code.split("\n")
    const ast: ParsedNode = {
      type: "Program",
      start: 0,
      end: code.length,
      body: [],
    }

    // Simple pattern detection for Python
    lines.forEach((line, index) => {
      if (line.trim().startsWith("def ")) {
        ast.body.push({
          type: "FunctionDeclaration",
          start: 0,
          end: line.length,
          loc: { start: { line: index + 1, column: 0 }, end: { line: index + 1, column: line.length } },
        })
      } else if (line.trim().startsWith("class ")) {
        ast.body.push({
          type: "ClassDeclaration",
          start: 0,
          end: line.length,
          loc: { start: { line: index + 1, column: 0 }, end: { line: index + 1, column: line.length } },
        })
      }
    })

    return {
      ast,
      errors: [],
      language: "python",
    }
  }

  /**
   * Walk through AST nodes
   */
  static walk(ast: ParsedNode, visitors: Record<string, (node: ParsedNode) => void>): void {
    if (!ast) return

    const visit = (node: ParsedNode) => {
      if (visitors[node.type]) {
        visitors[node.type](node)
      }

      // Recursively visit child nodes
      for (const key in node) {
        const value = node[key]
        if (Array.isArray(value)) {
          value.forEach((child) => {
            if (child && typeof child === "object" && child.type) {
              visit(child)
            }
          })
        } else if (value && typeof value === "object" && value.type) {
          visit(value)
        }
      }
    }

    visit(ast)
  }
}

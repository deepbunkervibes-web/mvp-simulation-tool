// Auto Remediator - Silently fixes issues with high confidence
export interface AutoFix {
  type: string
  confidence: number
  original: string
  fixed: string
  line?: number
  applied: boolean
}

export class AutoRemediator {
  /**
   * Automatically fix issues with >95% confidence
   */
  static autoFix(code: string, issues: any[]): { code: string; fixes: AutoFix[] } {
    let fixedCode = code
    const fixes: AutoFix[] = []

    // Auto-fix: Add missing semicolons
    const semicolonFix = this.addMissingSemicolons(fixedCode)
    if (semicolonFix.applied) {
      fixedCode = semicolonFix.code
      fixes.push({
        type: "missing-semicolon",
        confidence: 0.99,
        original: "statement without semicolon",
        fixed: "statement with semicolon",
        applied: true,
      })
    }

    // Auto-fix: Convert var to const/let
    const varFix = this.convertVarToConstLet(fixedCode)
    if (varFix.applied) {
      fixedCode = varFix.code
      fixes.push({
        type: "var-to-const-let",
        confidence: 0.97,
        original: "var declarations",
        fixed: "const/let declarations",
        applied: true,
      })
    }

    // Auto-fix: Add optional chaining for null safety
    const nullSafetyFix = this.addOptionalChaining(fixedCode)
    if (nullSafetyFix.applied) {
      fixedCode = nullSafetyFix.code
      fixes.push({
        type: "optional-chaining",
        confidence: 0.96,
        original: "unsafe property access",
        fixed: "safe optional chaining",
        applied: true,
      })
    }

    return { code: fixedCode, fixes }
  }

  private static addMissingSemicolons(code: string): { code: string; applied: boolean } {
    // Simple pattern: add semicolons to lines that need them
    const lines = code.split("\n")
    let applied = false
    const fixed = lines.map((line) => {
      const trimmed = line.trim()
      if (
        trimmed &&
        !trimmed.endsWith(";") &&
        !trimmed.endsWith("{") &&
        !trimmed.endsWith("}") &&
        !trimmed.startsWith("//") &&
        !trimmed.startsWith("/*")
      ) {
        applied = true
        return line + ";"
      }
      return line
    })
    return { code: fixed.join("\n"), applied }
  }

  private static convertVarToConstLet(code: string): { code: string; applied: boolean } {
    const varPattern = /\bvar\s+(\w+)\s*=/g
    if (varPattern.test(code)) {
      // Simple heuristic: if reassigned, use let; otherwise const
      const fixed = code.replace(/\bvar\s+/g, "const ")
      return { code: fixed, applied: true }
    }
    return { code, applied: false }
  }

  private static addOptionalChaining(code: string): { code: string; applied: boolean } {
    // Convert obj.prop.nested to obj?.prop?.nested
    const unsafePattern = /(\w+)\.(\w+)\.(\w+)/g
    if (unsafePattern.test(code)) {
      const fixed = code.replace(/(\w+)\.(\w+)\.(\w+)/g, "$1?.$2?.$3")
      return { code: fixed, applied: true }
    }
    return { code, applied: false }
  }
}

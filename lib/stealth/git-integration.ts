// Git Integration - Analyze git diffs and PRs
export interface GitDiff {
  file: string
  additions: number
  deletions: number
  changes: string[]
  impactScore: number
  isSecurityCritical: boolean
}

export class GitIntegration {
  /**
   * Analyze git diff for high-impact changes
   */
  static analyzeDiff(diff: string): GitDiff[] {
    const files: GitDiff[] = []

    // Parse diff (simplified)
    const fileBlocks = diff.split("diff --git")

    for (const block of fileBlocks) {
      if (!block.trim()) continue

      const fileMatch = block.match(/a\/(.*?)\s+b\//)
      if (!fileMatch) continue

      const file = fileMatch[1]
      const additions = (block.match(/^\+[^+]/gm) || []).length
      const deletions = (block.match(/^-[^-]/gm) || []).length
      const changes = this.extractChanges(block)

      files.push({
        file,
        additions,
        deletions,
        changes,
        impactScore: this.calculateImpactScore(file, additions, deletions, changes),
        isSecurityCritical: this.isSecurityCritical(file, changes),
      })
    }

    return files.sort((a, b) => b.impactScore - a.impactScore)
  }

  /**
   * Get high-impact changes only
   */
  static getHighImpactChanges(diffs: GitDiff[]): GitDiff[] {
    return diffs.filter((d) => d.impactScore > 0.7 || d.isSecurityCritical)
  }

  private static extractChanges(block: string): string[] {
    const changes: string[] = []
    const lines = block.split("\n")

    for (const line of lines) {
      if (line.startsWith("+") && !line.startsWith("+++")) {
        changes.push(line.substring(1).trim())
      }
    }

    return changes
  }

  private static calculateImpactScore(file: string, additions: number, deletions: number, changes: string[]): number {
    let score = 0

    // File type impact
    if (file.includes("auth") || file.includes("security")) score += 0.4
    if (file.includes("api") || file.includes("route")) score += 0.3
    if (file.includes("database") || file.includes("db")) score += 0.3

    // Change volume impact
    const totalChanges = additions + deletions
    if (totalChanges > 100) score += 0.3
    else if (totalChanges > 50) score += 0.2
    else if (totalChanges > 20) score += 0.1

    // Content impact
    const criticalPatterns = ["password", "token", "secret", "api_key", "private"]
    if (changes.some((c) => criticalPatterns.some((p) => c.toLowerCase().includes(p)))) {
      score += 0.4
    }

    return Math.min(score, 1.0)
  }

  private static isSecurityCritical(file: string, changes: string[]): boolean {
    const securityFiles = ["auth", "security", "crypto", "password", "token"]
    const securityPatterns = ["password", "token", "secret", "api_key", "private", "auth"]

    const isCriticalFile = securityFiles.some((sf) => file.toLowerCase().includes(sf))
    const hasCriticalChange = changes.some((c) => securityPatterns.some((p) => c.toLowerCase().includes(p)))

    return isCriticalFile || hasCriticalChange
  }
}

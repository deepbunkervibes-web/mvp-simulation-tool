"use client"

import { Activity, GitBranch, BarChart3, BookOpen, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
              <Zap className="h-7 w-7 text-primary relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-2xl font-bold gradient-text">SlavkosCore</span>
              <div className="text-[10px] text-muted-foreground tracking-wider uppercase">Quantum-Ready Analysis</div>
            </div>
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm flex items-center gap-2 transition-all hover:scale-105 ${
                isActive("/") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="h-4 w-4" />
              Analysis
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm flex items-center gap-2 transition-all hover:scale-105 ${
                isActive("/dashboard") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/git-diff"
              className={`text-sm flex items-center gap-2 transition-all hover:scale-105 ${
                isActive("/git-diff") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitBranch className="h-4 w-4" />
              Git Diff
            </Link>
            <Link
              href="/telemetry"
              className={`text-sm flex items-center gap-2 transition-all hover:scale-105 ${
                isActive("/telemetry") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Telemetry
            </Link>
            <Link
              href="/examples"
              className={`text-sm flex items-center gap-2 transition-all hover:scale-105 ${
                isActive("/examples") ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Examples
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

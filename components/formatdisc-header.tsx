"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket, Github } from "lucide-react"

export function FormatdiscHeader() {
  const scrollToSimulator = () => {
    const element = document.querySelector("[data-simulator]")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-all" />
            <Rocket className="h-8 w-8 text-primary relative z-10 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              FORMATDISC
            </span>
            <span className="text-xs text-muted-foreground block -mt-1">MVP Simulation Tool</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={scrollToSimulator}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Simulator
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
            <a href="https://github.com/mladengertner" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button
            onClick={scrollToSimulator}
            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20"
          >
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">Try Now</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

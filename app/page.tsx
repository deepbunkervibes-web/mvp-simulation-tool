"use client"

import { useState, useRef } from "react"
import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { StatsSection } from "@/components/landing/StatsSection"
import { SimulationForm } from "@/components/simulation-form"
import { SimulationChamber } from "@/components/simulation-chamber"
import { VerdictCard } from "@/components/verdict-card"
import { SummaryMetrics } from "@/components/summary-metrics"
import { RevenueChart } from "@/components/revenue-chart"
import { CustomerGrowthChart } from "@/components/customer-growth-chart"
import { MRRChart } from "@/components/mrr-chart"
import { ConfidenceGauge } from "@/components/confidence-gauge"
import { runSimulation, type SimulationInputs, type SimulationResult } from "@/lib/simulation-engine"
import { analytics } from "@/lib/analytics"
import { generatePDF } from "@/components/pdf-export"
import {
  Rocket,
  Zap,
  Shield,
  Target,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [inputs, setInputs] = useState<SimulationInputs | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChamberEntered, setIsChamberEntered] = useState(false)
  const simulatorRef = useRef<HTMLDivElement>(null)

  const handleSimulate = async (newInputs: SimulationInputs) => {
    setIsLoading(true)
    setInputs(newInputs)
    analytics.capture("simulation_started", {
      ...newInputs,
    })
    await new Promise((resolve) => setTimeout(resolve, 1200))
    const simulationResult = runSimulation(newInputs)
    setResult(simulationResult)
    analytics.capture("simulation_completed", {
      verdict: simulationResult.verdict,
      confidence: simulationResult.confidence.score,
      rating: simulationResult.confidence.rating,
    })
    setIsLoading(false)
  }

  const handleExportPDF = () => {
    if (inputs && result) {
      generatePDF(inputs, result)
    }
  }

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Navbar />

      {/* Hero Section */}
      <HeroSection scrollToSimulator={scrollToSimulator} />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section id="features" className="py-24 relative scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Validate
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From initial concept to investor pitch, our platform guides you through every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Market Validation",
                description: "Analyze TAM, SAM, SOM with real-time market data and competitive intelligence.",
                color: "text-red-400",
                gradient: "from-red-500/20 to-orange-500/20",
              },
              {
                icon: BarChart3,
                title: "Financial Projections",
                description: "12-month revenue forecasts with MRR, ARR, LTV/CAC ratios automatically calculated.",
                color: "text-blue-400",
                gradient: "from-blue-500/20 to-cyan-500/20",
              },
              {
                icon: Users,
                title: "Customer Growth",
                description: "Model acquisition channels, churn rates, and growth velocity scenarios.",
                color: "text-green-400",
                gradient: "from-green-500/20 to-emerald-500/20",
              },
              {
                icon: Shield,
                title: "Risk Analysis",
                description: "AI-powered confidence scoring identifies potential pitfalls before they happen.",
                color: "text-yellow-400",
                gradient: "from-yellow-500/20 to-amber-500/20",
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Get comprehensive analysis in under 60 seconds with our optimized engine.",
                color: "text-purple-400",
                gradient: "from-purple-500/20 to-pink-500/20",
              },
              {
                icon: Rocket,
                title: "Investor Ready",
                description: "Export professional PDF reports designed to impress angel investors and VCs.",
                color: "text-primary",
                gradient: "from-primary/20 to-purple-500/20",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={cn(
                  "group relative p-6 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm",
                  "hover:border-primary/30 hover:bg-card/50 transition-all duration-300 hover:-translate-y-1",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                    feature.gradient,
                  )}
                />
                <div className="relative">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-xl bg-background/50 flex items-center justify-center mb-4",
                      feature.color,
                    )}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/20 border-y border-border/30 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground">Three simple steps to validate your business model</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Input Parameters", desc: "Enter your pricing, costs, and growth assumptions" },
              { step: "02", title: "Run Simulation", desc: "Our AI engine calculates projections and risks" },
              { step: "03", title: "Get Verdict", desc: "Receive GO/NO-GO recommendation with full report" },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="text-8xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute top-1/4 -right-4 h-8 w-8 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Simulator Section */}

            <section ref={simulatorRef} data-simulator className="py-24 scroll-mt-20">

              <div className="container mx-auto px-6">

                {!isChamberEntered ? (

                  <SimulationChamber onEnter={() => setIsChamberEntered(true)} />

                ) : (

                  <>

                    <div className="text-center mb-12">

                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6 text-sm text-green-400 font-medium">

                        <CheckCircle2 className="h-4 w-4" />

                        Live Simulator - No Sign Up Required

                      </div>

                      <h2 className="text-3xl md:text-5xl font-bold mb-4">

                        Try It{" "}

                        <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">

                          Now

                        </span>

                      </h2>

                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">

                        Configure your business parameters and see real-time projections instantly.

                      </p>

                    </div>

      

                    <div className="grid lg:grid-cols-[420px_1fr] gap-8 max-w-7xl mx-auto">

                      {/* Form */}

                      <div className="lg:sticky lg:top-24 lg:self-start">

                        <SimulationForm onSubmit={handleSimulate} isLoading={isLoading} />

                      </div>

      

                      {/* Results */}

                      <div className="space-y-6">

                        {result ? (

                          <>

                            <VerdictCard result={result} onExportPDF={handleExportPDF} />

                            <SummaryMetrics result={result} />

                            <div className="grid md:grid-cols-2 gap-6">

                              <RevenueChart projections={result.projections} />

                              <CustomerGrowthChart projections={result.projections} />

                            </div>

                            <div className="grid md:grid-cols-2 gap-6">

                              <MRRChart projections={result.projections} breakEvenMonth={result.summary.breakEvenMonth} />

                              <ConfidenceGauge score={result.confidence.score} factors={result.confidence.factors} />

                            </div>

                          </>

                        ) : (

                          <div className="flex items-center justify-center min-h-[600px] rounded-2xl border border-dashed border-border/50 bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-sm">

                            <div className="text-center p-8 max-w-md">

                              <div className="relative mx-auto mb-6 w-24 h-24">

                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 animate-pulse" />

                                <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">

                                  <Rocket className="h-10 w-10 text-muted-foreground/50" />

                                </div>

                              </div>

                              <h3 className="text-2xl font-semibold mb-3">Ready to Launch</h3>

                              <p className="text-muted-foreground leading-relaxed">

                                Configure your business parameters on the left panel and click

                                <span className="text-primary font-medium"> Run Simulation </span>

                                to generate comprehensive projections and insights.

                              </p>

                            </div>

                          </div>

                        )}

                      </div>

                    </div>

                  </>

                )}

              </div>

            </section>

      {/* Testimonials */}
      <section className="py-24 bg-card/20 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Founders
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote:
                  "FORMATDISC helped us validate our SaaS idea in 2 hours. We raised 500k EUR based on their projections.",
                author: "Ana K.",
                role: "CEO, TechStart Zagreb",
              },
              {
                quote:
                  "The confidence scoring feature saved us from pursuing a flawed business model. Invaluable tool.",
                author: "Marko P.",
                role: "Founder, DataFlow",
              },
              {
                quote: "Professional PDF reports impressed our angel investors. Clean, data-driven, and credible.",
                author: "Ivana M.",
                role: "Co-founder, EcoTech",
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm">
                <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="relative max-w-4xl mx-auto text-center p-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Validate Your Idea?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of entrepreneurs who made data-driven decisions with FORMATDISC.
              </p>
              <Button
                size="lg"
                onClick={scrollToSimulator}
                className="h-14 px-10 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
              >
                Start Free Simulation
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  FORMATDISC
                </span>
              </div>
              <p className="text-muted-foreground max-w-md">
                AI-powered MVP simulation tool for entrepreneurs. Validate ideas, project growth, and make data-driven
                decisions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button onClick={scrollToSimulator} className="hover:text-foreground transition-colors">
                    Simulator
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="mailto:info@formatdisc.hr" className="hover:text-foreground transition-colors">
                    info@formatdisc.hr
                  </a>
                </li>
                <li>
                  <a href="tel:+385915421014" className="hover:text-foreground transition-colors">
                    +385 91 542 1014
                  </a>
                </li>
                <li>Zagreb, Croatia</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 FORMATDISC, vl. Mladen Gertner. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

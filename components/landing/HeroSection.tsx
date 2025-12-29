"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroSection({ scrollToSimulator }: { scrollToSimulator: () => void }) {
    return (
        <section className="relative pt-32 pb-24 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-institutional mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000 mix-blend-screen" />
            </div>

            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Presidential Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 mb-8 backdrop-blur-md animate-fade-in-orchestrated">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-mono text-gray-300">
                            SlavkoKernel™ v7 Online
                        </span>
                        <div className="h-4 w-[1px] bg-white/10 mx-2" />
                        <span className="text-xs text-purple-400 font-medium">
                            Institutional Grade Verification
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[1.1] animate-fade-in-orchestrated" style={{ animationDelay: '0.1s' }}>
                        <span className="block text-white">Summon the Kernel.</span>
                        <span className="block mt-2 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] bg-clip-text text-transparent pb-4">
                            Validate your myth.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-orchestrated" style={{ animationDelay: '0.2s' }}>
                        Transform uncertainty into confidence. The FormatDisc Simulation Chamber projects growth,
                        analyzes risks, and delivers investor-ready reports with <span className="text-white font-medium">deterministic precision</span>.
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-orchestrated" style={{ animationDelay: '0.3s' }}>
                        <Button
                            size="lg"
                            onClick={scrollToSimulator}
                            className="h-16 px-10 text-lg rounded-full bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white hover:opacity-90 transition-all shadow-xl shadow-purple-900/30 hover:scale-[1.02] border border-white/10 group"
                        >
                            Enter the Simulation Chamber
                            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="h-16 px-10 text-lg rounded-full border-white/10 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white transition-all hover:border-white/20"
                        >
                            Read the Manifesto
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    )
}

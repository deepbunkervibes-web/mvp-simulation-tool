"use client"

import { useState, useEffect, useRef } from "react"

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true)
            },
            { threshold: 0.1 },
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return
        let startTime: number
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [isVisible, end, duration])

    return (
        <span ref={ref}>
            {count.toLocaleString()}
            {suffix}
        </span>
    )
}

export function StatsSection() {
    const stats = [
        { value: 2847, suffix: "+", label: "Startups Validated" },
        { value: 94, suffix: "%", label: "Accuracy Rate" },
        { value: 48, suffix: "h", label: "Average Time Saved" },
        { value: 12, suffix: "M€", label: "Investment Raised" },
    ]

    return (
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center group p-6 rounded-2xl bg-transparent hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5">
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-500">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-sm font-mono uppercase tracking-widest text-gray-500 group-hover:text-purple-400 transition-colors">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

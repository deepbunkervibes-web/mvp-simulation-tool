// PostHog Analytics Configuration
// Production-ready setup for MVP Simulation Tool

export interface PostHogEvent {
    simulation_started: {
        timestamp: string
        sessionId: string
    }
    simulation_completed: {
        verdict: "GO" | "MAYBE" | "NO_GO"
        creditRating: string
        score: number
        revenue: number
        timestamp: string
        sessionId: string
        simulationId: string
    }
    simulation_verdict_viewed: {
        verdict: "GO" | "MAYBE" | "NO_GO"
        creditRating: string
        score: number
        revenue: number
        timestamp: string
        sessionId: string
        simulationId: string
    }
    pdf_export_requested: {
        verdict: "GO" | "MAYBE" | "NO_GO"
        creditRating: string
        timestamp: string
        sessionId: string
    }
}

class Analytics {
    private enabled: boolean
    private posthogKey: string | undefined
    private posthogHost: string | undefined

    constructor() {
        this.enabled = typeof window !== "undefined"
        this.posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
        this.posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"
    }

    capture<T extends keyof PostHogEvent>(
        event: T,
        properties: PostHogEvent[T]
    ): void {
        if (!this.enabled) {
            console.log("[Analytics] Not in browser environment")
            return
        }

        if (!this.posthogKey) {
            console.log(`[Analytics] Event captured (dev mode): ${event}`, properties)
            return
        }

        // PostHog integration when key is available
        if (typeof window !== "undefined" && (window as any).posthog) {
            (window as any).posthog.capture(event, properties)
            console.log(`[Analytics] Event sent to PostHog: ${event}`)
        } else {
            console.warn("[Analytics] PostHog not initialized")
        }
    }

    identify(userId: string, properties?: Record<string, any>): void {
        if (!this.enabled || !this.posthogKey) {
            console.log("[Analytics] Identify called (dev mode):", userId, properties)
            return
        }

        if (typeof window !== "undefined" && (window as any).posthog) {
            (window as any).posthog.identify(userId, properties)
        }
    }

    reset(): void {
        if (!this.enabled || !this.posthogKey) return

        if (typeof window !== "undefined" && (window as any).posthog) {
            (window as any).posthog.reset()
        }
    }
}

export const analytics = new Analytics()

// Production Setup Instructions:
// 1. Sign up for PostHog: https://posthog.com
// 2. Get your Project API Key
// 3. Add to Vercel environment variables:
//    - NEXT_PUBLIC_POSTHOG_KEY=<your-key>
//    - NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
// 4. Add PostHog script to app/layout.tsx:
//    <Script src="https://app.posthog.com/static/array.js" />
// 5. Initialize in useEffect:
//    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, { api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST })

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-mono font-bold tracking-tight">
                        <span className="text-white">FormatDisc</span>
                        <span className="text-gray-500">_SimulationCommand</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-primary transition-colors">Kernel Features</Link>
                    <Link href="#metrics" className="hover:text-primary transition-colors">Institutional Metrics</Link>
                    <Link href="#audit" className="hover:text-primary transition-colors">Audit Trail</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="hidden sm:flex text-muted-foreground hover:text-white">
                        Access Documentation
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all">
                        Deploy Simulation
                    </Button>
                </div>
            </div>
        </header>
    )
}

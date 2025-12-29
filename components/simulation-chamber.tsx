"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SimulationChamberProps {
  onEnter: () => void
}

export function SimulationChamber({ onEnter }: SimulationChamberProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto my-8 border-purple-600/20 bg-purple-950/10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-400">
          Simulation Chamber
        </CardTitle>
        <CardDescription className="text-gray-400">
          Ceremonial Entrypoint for Institutional Simulation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 p-8">
        <p className="text-center text-gray-300">
          You are about to enter a deterministic simulation environment governed by the
          SlavkoKernel v7 protocol. All outputs are institutional-grade verdicts.
        </p>
        <Button
          onClick={onEnter}
          className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Initiate Simulation
        </Button>
      </CardContent>
    </Card>
  )
}

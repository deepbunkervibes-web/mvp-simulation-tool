"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Percent, DollarSign, TrendingDown, Target, Calendar, Sparkles, RotateCcw, Activity, Layers, BarChart } from "lucide-react"
import type { SimulationInputs } from "@/lib/simulation-engine"

interface SimulationFormProps {
  onSubmit: (inputs: SimulationInputs) => void
  isLoading?: boolean
}

const defaultInputs: SimulationInputs = {
  monthlyLeads: 1000,
  conversionRate: 5,
  price: 49,
  churnRate: 5,
  cac: 150,
  validationScore: 65,
  horizonMonths: 24,
}

export function SimulationForm({ onSubmit, isLoading }: SimulationFormProps) {
  const [inputs, setInputs] = useState<SimulationInputs>(defaultInputs)
  const [activeTab, setActiveTab] = useState("market")

  const handleChange = (field: keyof SimulationInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setInputs(defaultInputs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(inputs)
  }

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
      <CardHeader className="pb-0 border-b border-white/5 bg-white/5">
        <CardTitle className="flex items-center gap-2 text-xl font-mono tracking-tight text-white">
          <Activity className="h-5 w-5 text-purple-400" />
          Simulation Parameters
        </CardTitle>
        <CardDescription className="text-gray-400">Configure the kernel inputs for each engine.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none bg-transparent border-b border-white/5 h-14 p-0">
              <TabsTrigger
                value="market"
                className="rounded-none h-full data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 border-b-2 border-transparent transition-all"
              >
                <div className="flex flex-col items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span className="text-xs">Market</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="financial"
                className="rounded-none h-full data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 border-b-2 border-transparent transition-all"
              >
                <div className="flex flex-col items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs">Financial</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="growth"
                className="rounded-none h-full data-[state=active]:bg-green-500/10 data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-500 border-b-2 border-transparent transition-all"
              >
                <div className="flex flex-col items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span className="text-xs">Growth</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="p-6 space-y-6 min-h-[400px]">
              <TabsContent value="market" className="space-y-8 mt-0 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* Validation Score */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium text-purple-300">
                      <Sparkles className="h-4 w-4" />
                      Validation Confidence
                    </Label>
                    <span className="text-sm font-mono text-white bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">{inputs.validationScore}/100</span>
                  </div>
                  <Slider
                    value={[inputs.validationScore]}
                    onValueChange={([value]) => handleChange("validationScore", value)}
                    min={0}
                    max={100}
                    step={5}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">How much proof (pre-orders, waitlist) do you currently have?</p>
                </div>

                {/* Monthly Leads */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Users className="h-4 w-4" />
                      Monthly Leads (Traffic)
                    </Label>
                    <span className="text-sm font-mono text-gray-300">{inputs.monthlyLeads.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[inputs.monthlyLeads]}
                    onValueChange={([value]) => handleChange("monthlyLeads", value)}
                    min={100}
                    max={10000}
                    step={100}
                    className="py-2"
                  />
                </div>

                {/* Conversion Rate */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Percent className="h-4 w-4" />
                      Conversion Rate
                    </Label>
                    <span className="text-sm font-mono text-gray-300">{inputs.conversionRate}%</span>
                  </div>
                  <Slider
                    value={[inputs.conversionRate]}
                    onValueChange={([value]) => handleChange("conversionRate", value)}
                    min={0.5}
                    max={20}
                    step={0.5}
                    className="py-2"
                  />
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-8 mt-0 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Price */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-medium text-blue-300">
                    <DollarSign className="h-4 w-4" />
                    Monthly Pricing Model
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      value={inputs.price}
                      onChange={(e) => handleChange("price", Number(e.target.value))}
                      className="pl-7 font-mono bg-black/20 border-white/10 focus-visible:ring-blue-500"
                      min={1}
                      max={10000}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Average Revenue Per User (ARPU) per month.</p>
                </div>

                {/* CAC */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-medium text-orange-300">
                    <Target className="h-4 w-4" />
                    Customer Acquisition Cost (CAC)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      value={inputs.cac}
                      onChange={(e) => handleChange("cac", Number(e.target.value))}
                      className="pl-7 font-mono bg-black/20 border-white/10 focus-visible:ring-orange-500"
                      min={1}
                      max={5000}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Total marketing spend / New customers acquired.</p>
                </div>
              </TabsContent>

              <TabsContent value="growth" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Churn Rate */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium text-red-300">
                      <TrendingDown className="h-4 w-4" />
                      Monthly Churn Rate
                    </Label>
                    <span className="text-sm font-mono text-white bg-red-500/10 px-2 py-1 rounded border border-red-500/20">{inputs.churnRate}%</span>
                  </div>
                  <Slider
                    value={[inputs.churnRate]}
                    onValueChange={([value]) => handleChange("churnRate", value)}
                    min={0.5}
                    max={20}
                    step={0.5}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">Percentage of customers canceling each month.</p>
                </div>

                {/* Horizon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium text-green-300">
                      <Calendar className="h-4 w-4" />
                      Simulation Horizon
                    </Label>
                    <span className="text-sm font-mono text-gray-300">{inputs.horizonMonths} months</span>
                  </div>
                  <Slider
                    value={[inputs.horizonMonths]}
                    onValueChange={([value]) => handleChange("horizonMonths", value)}
                    min={6}
                    max={60}
                    step={6}
                    className="py-2"
                  />
                </div>
              </TabsContent>
            </div>

            <CardFooter className="flex flex-col gap-3 p-6 border-t border-white/5 bg-white/[0.02]">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold tracking-wide shadow-lg shadow-purple-900/20 text-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    RUNNING KERNEL SIMULATION...
                  </>
                ) : (
                  <>
                    <Layers className="h-4 w-4 mr-2" />
                    ORCHESTRATE SIMULATION
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={handleReset} className="w-full text-xs text-muted-foreground hover:text-white">
                Reset to Factory Defaults
              </Button>
            </CardFooter>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  )
}

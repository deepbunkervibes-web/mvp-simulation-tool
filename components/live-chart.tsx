"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"

interface DataPoint {
  time: number
  value: number
}

interface LiveChartProps {
  title: string
  color: string
  isActive: boolean
  maxValue?: number
}

export function LiveChart({ title, color, isActive, maxValue = 100 }: LiveChartProps) {
  const [data, setData] = useState<DataPoint[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev, { time: Date.now(), value: Math.random() * maxValue }]
        return newData.slice(-50) // Keep last 50 points
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isActive, maxValue])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - (point.value / maxValue) * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color.replace("rgb", "rgba").replace(")", ", 0.3)"))
    gradient.addColorStop(1, color.replace("rgb", "rgba").replace(")", ", 0)"))

    ctx.fillStyle = gradient
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()
  }, [data, color, maxValue])

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          {isActive && <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />}
        </div>
        <canvas ref={canvasRef} width={400} height={120} className="w-full h-[120px]" />
        {data.length > 0 && (
          <div className="mt-2 text-2xl font-bold tabular-nums" style={{ color }}>
            {data[data.length - 1].value.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">{maxValue === 100 ? "%" : "ops/s"}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

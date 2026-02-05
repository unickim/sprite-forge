"use client"

import { useCanvas } from "@/lib/canvas-context"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"

const presetSizes = [
  { label: "16x16", width: 16, height: 16 },
  { label: "32x32", width: 32, height: 32 },
  { label: "64x64", width: 64, height: 64 },
  { label: "128x128", width: 128, height: 128 },
  { label: "256x256", width: 256, height: 256 },
]

export function CanvasSettings() {
  const { canvasWidth, canvasHeight, setCanvasSize, zoom, setZoom } = useCanvas()

  return (
    <div className="p-3 bg-card border-b border-border">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Canvas</span>
      </div>

      {/* Canvas size */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1">
            <span className="text-xs text-muted-foreground block mb-1">Width</span>
            <input
              type="number"
              value={canvasWidth}
              onChange={(e) => setCanvasSize(parseInt(e.target.value) || 1, canvasHeight)}
              className="w-full px-2 py-1.5 text-xs bg-input border border-border rounded text-foreground"
              min={1}
              max={512}
            />
          </div>
          <div className="flex-1">
            <span className="text-xs text-muted-foreground block mb-1">Height</span>
            <input
              type="number"
              value={canvasHeight}
              onChange={(e) => setCanvasSize(canvasWidth, parseInt(e.target.value) || 1)}
              className="w-full px-2 py-1.5 text-xs bg-input border border-border rounded text-foreground"
              min={1}
              max={512}
            />
          </div>
        </div>

        {/* Preset sizes */}
        <div className="flex flex-wrap gap-1">
          {presetSizes.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setCanvasSize(preset.width, preset.height)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                canvasWidth === preset.width && canvasHeight === preset.height
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zoom */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Zoom</span>
          <span className="text-xs font-mono text-foreground">{zoom * 100}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(1, zoom - 1))}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={1}
            max={16}
            step={1}
            className="flex-1"
          />
          <button
            onClick={() => setZoom(Math.min(16, zoom + 1))}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

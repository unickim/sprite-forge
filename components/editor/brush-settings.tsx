"use client"

import { useCanvas } from "@/lib/canvas-context"
import { Slider } from "@/components/ui/slider"

export function BrushSettings() {
  const { brushSettings, setBrushSettings, currentTool } = useCanvas()

  const showBrushSettings = currentTool === "brush" || currentTool === "eraser"

  if (!showBrushSettings) return null

  return (
    <div className="p-3 bg-card border-b border-border">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {currentTool === "brush" ? "Brush" : "Eraser"} Settings
        </span>
      </div>

      {/* Size */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Size</span>
          <span className="text-xs font-mono text-foreground">{brushSettings.size}px</span>
        </div>
        <Slider
          value={[brushSettings.size]}
          onValueChange={([value]) =>
            setBrushSettings({ ...brushSettings, size: value })
          }
          min={1}
          max={32}
          step={1}
          className="w-full"
        />
      </div>

      {/* Opacity */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Opacity</span>
          <span className="text-xs font-mono text-foreground">{brushSettings.opacity}%</span>
        </div>
        <Slider
          value={[brushSettings.opacity]}
          onValueChange={([value]) =>
            setBrushSettings({ ...brushSettings, opacity: value })
          }
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center p-4 bg-muted rounded">
        <div
          className="rounded-full bg-primary"
          style={{
            width: Math.min(brushSettings.size * 4, 64),
            height: Math.min(brushSettings.size * 4, 64),
            opacity: brushSettings.opacity / 100,
          }}
        />
      </div>
    </div>
  )
}

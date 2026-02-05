"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Brush } from "lucide-react"

interface BrushSettingsProps {
  brushSize: number
  onBrushSizeChange: (size: number) => void
}

export function BrushSettings({
  brushSize,
  onBrushSizeChange,
}: BrushSettingsProps) {
  return (
    <div className="p-3 border-b border-border">
      <div className="flex items-center gap-2 mb-3">
        <Brush className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Brush</span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Size</Label>
            <span className="text-xs text-muted-foreground">{brushSize}px</span>
          </div>
          <Slider
            value={[brushSize]}
            onValueChange={([value]) => onBrushSizeChange(value)}
            min={1}
            max={32}
            step={1}
          />
        </div>

        {/* Brush preview */}
        <div className="flex items-center justify-center p-3 bg-muted/30 rounded-md">
          <div
            className="bg-foreground rounded-sm transition-all"
            style={{
              width: Math.min(brushSize * 4, 64),
              height: Math.min(brushSize * 4, 64),
            }}
          />
        </div>
      </div>
    </div>
  )
}

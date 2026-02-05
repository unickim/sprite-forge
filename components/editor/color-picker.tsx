"use client"

import { useCanvas } from "@/lib/canvas-context"
import { cn } from "@/lib/utils"
import { useState } from "react"

const presetColors = [
  "#000000", "#1a1a2e", "#16213e", "#0f3460",
  "#ffffff", "#e7e7e7", "#c4c4c4", "#8b8b8b",
  "#ff0000", "#ff4444", "#ff8888", "#ffcccc",
  "#ff8800", "#ffaa44", "#ffcc88", "#ffeedd",
  "#ffff00", "#ffff44", "#ffff88", "#ffffcc",
  "#00ff00", "#44ff44", "#88ff88", "#ccffcc",
  "#00ffff", "#44ffff", "#88ffff", "#ccffff",
  "#0088ff", "#44aaff", "#88ccff", "#cceeff",
  "#0000ff", "#4444ff", "#8888ff", "#ccccff",
  "#ff00ff", "#ff44ff", "#ff88ff", "#ffccff",
  "#4ade80", "#22c55e", "#16a34a", "#15803d",
]

export function ColorPicker() {
  const { primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor } = useCanvas()
  const [activeColor, setActiveColor] = useState<"primary" | "secondary">("primary")

  const handleColorChange = (color: string) => {
    if (activeColor === "primary") {
      setPrimaryColor(color)
    } else {
      setSecondaryColor(color)
    }
  }

  return (
    <div className="p-3 bg-card border-b border-border">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Colors</span>
      </div>

      {/* Active colors */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative w-12 h-12">
          {/* Secondary (back) */}
          <button
            onClick={() => setActiveColor("secondary")}
            className={cn(
              "absolute bottom-0 right-0 w-8 h-8 rounded border-2 transition-all",
              activeColor === "secondary" ? "border-primary z-10" : "border-border"
            )}
            style={{ backgroundColor: secondaryColor }}
          />
          {/* Primary (front) */}
          <button
            onClick={() => setActiveColor("primary")}
            className={cn(
              "absolute top-0 left-0 w-8 h-8 rounded border-2 transition-all",
              activeColor === "primary" ? "border-primary z-10" : "border-border"
            )}
            style={{ backgroundColor: primaryColor }}
          />
        </div>

        {/* Swap button */}
        <button
          onClick={() => {
            const temp = primaryColor
            setPrimaryColor(secondaryColor)
            setSecondaryColor(temp)
          }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Swap
        </button>
      </div>

      {/* Color input */}
      <div className="flex gap-2 mb-3">
        <input
          type="color"
          value={activeColor === "primary" ? primaryColor : secondaryColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={activeColor === "primary" ? primaryColor : secondaryColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="flex-1 px-2 py-1 text-xs bg-input border border-border rounded font-mono text-foreground"
        />
      </div>

      {/* Preset colors */}
      <div className="grid grid-cols-8 gap-1">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => handleColorChange(color)}
            className={cn(
              "w-5 h-5 rounded-sm border transition-all hover:scale-110",
              (activeColor === "primary" ? primaryColor : secondaryColor) === color
                ? "border-primary"
                : "border-transparent"
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}

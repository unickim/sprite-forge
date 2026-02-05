"use client"

import { useCanvas } from "@/lib/canvas-context"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function LayersPanel() {
  const {
    layers,
    currentLayerId,
    setCurrentLayerId,
    addLayer,
    deleteLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    reorderLayers,
    setLayers,
  } = useCanvas()

  const currentLayer = layers.find((l) => l.id === currentLayerId)

  return (
    <div className="flex flex-col bg-card border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Layers</span>
        <div className="flex gap-1">
          <button
            onClick={addLayer}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => currentLayerId && deleteLayer(currentLayerId)}
            disabled={layers.length <= 1}
            className={cn(
              "p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground",
              layers.length <= 1 && "opacity-50 cursor-not-allowed"
            )}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto max-h-48">
        {[...layers].reverse().map((layer, reversedIndex) => {
          const index = layers.length - 1 - reversedIndex
          return (
            <div
              key={layer.id}
              onClick={() => setCurrentLayerId(layer.id)}
              className={cn(
                "flex items-center gap-2 p-2 cursor-pointer border-b border-border/50 transition-colors",
                currentLayerId === layer.id
                  ? "bg-secondary"
                  : "hover:bg-secondary/50"
              )}
            >
              {/* Visibility toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLayerVisibility(layer.id)
                }}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                {layer.visible ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Lock toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLayerLock(layer.id)
                }}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                {layer.locked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Layer name */}
              <span className="flex-1 text-sm truncate text-foreground">{layer.name}</span>

              {/* Reorder buttons */}
              <div className="flex flex-col">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (index < layers.length - 1) {
                      reorderLayers(index, index + 1)
                    }
                  }}
                  disabled={index === layers.length - 1}
                  className={cn(
                    "p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground",
                    index === layers.length - 1 && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (index > 0) {
                      reorderLayers(index, index - 1)
                    }
                  }}
                  disabled={index === 0}
                  className={cn(
                    "p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground",
                    index === 0 && "opacity-30 cursor-not-allowed"
                  )}
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Layer opacity */}
      {currentLayer && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Opacity</span>
            <span className="text-xs font-mono text-foreground">{currentLayer.opacity}%</span>
          </div>
          <Slider
            value={[currentLayer.opacity]}
            onValueChange={([value]) => {
              setLayers((prev) =>
                prev.map((l) =>
                  l.id === currentLayerId ? { ...l, opacity: value } : l
                )
              )
            }}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layers,
} from "lucide-react"

interface Layer {
  id: string
  name: string
  visible: boolean
  opacity: number
  locked: boolean
  imageData: ImageData | null
}

interface LayersPanelProps {
  layers: Layer[]
  activeLayerId: string
  onLayerSelect: (id: string) => void
  onLayerAdd: () => void
  onLayerDelete: (id: string) => void
  onLayerDuplicate: (id: string) => void
  onLayerToggleVisibility: (id: string) => void
  onLayerToggleLock: (id: string) => void
  onLayerRename: (id: string, name: string) => void
  onLayerOpacityChange: (id: string, opacity: number) => void
  onLayerMoveUp: (id: string) => void
  onLayerMoveDown: (id: string) => void
}

export function LayersPanel({
  layers,
  activeLayerId,
  onLayerSelect,
  onLayerAdd,
  onLayerDelete,
  onLayerDuplicate,
  onLayerToggleVisibility,
  onLayerToggleLock,
  onLayerRename,
  onLayerOpacityChange,
  onLayerMoveUp,
  onLayerMoveDown,
}: LayersPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Layers</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onLayerAdd}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`group flex flex-col gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                activeLayerId === layer.id
                  ? "bg-accent"
                  : "hover:bg-muted"
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onLayerToggleVisibility(layer.id)
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {layer.visible ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onLayerToggleLock(layer.id)
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {layer.locked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                </button>

                <Input
                  value={layer.name}
                  onChange={(e) => onLayerRename(layer.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-6 text-xs bg-transparent border-none px-1 focus-visible:ring-1"
                />

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onLayerMoveUp(layer.id)
                    }}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onLayerMoveDown(layer.id)
                    }}
                    disabled={index === layers.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onLayerDuplicate(layer.id)
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onLayerDelete(layer.id)
                    }}
                    disabled={layers.length <= 1}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {activeLayerId === layer.id && (
                <div className="flex items-center gap-2 pl-7">
                  <span className="text-xs text-muted-foreground w-12">
                    Opacity
                  </span>
                  <Slider
                    value={[layer.opacity]}
                    onValueChange={([value]) =>
                      onLayerOpacityChange(layer.id, value)
                    }
                    max={100}
                    step={1}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {layer.opacity}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

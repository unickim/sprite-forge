"use client"

import React from "react"

import { useCanvas } from "@/lib/canvas-context"
import type { Tool } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Brush,
  Eraser,
  PaintBucket,
  Pipette,
  Minus,
  Square,
  Circle,
  BoxSelect,
  Move,
  Undo2,
  Redo2,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const tools: { id: Tool; icon: React.ElementType; label: string; shortcut: string }[] = [
  { id: "brush", icon: Brush, label: "Brush", shortcut: "B" },
  { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
  { id: "fill", icon: PaintBucket, label: "Fill", shortcut: "G" },
  { id: "picker", icon: Pipette, label: "Color Picker", shortcut: "I" },
  { id: "line", icon: Minus, label: "Line", shortcut: "L" },
  { id: "rect", icon: Square, label: "Rectangle", shortcut: "R" },
  { id: "ellipse", icon: Circle, label: "Ellipse", shortcut: "O" },
  { id: "select", icon: BoxSelect, label: "Selection", shortcut: "M" },
  { id: "move", icon: Move, label: "Move", shortcut: "V" },
]

export function Toolbar() {
  const { currentTool, setCurrentTool, undo, redo, canUndo, canRedo } = useCanvas()

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col gap-1 p-2 bg-card border-r border-border">
        {/* Drawing Tools */}
        <div className="flex flex-col gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCurrentTool(tool.id)}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      currentTool === tool.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{tool.label} <span className="text-muted-foreground">({tool.shortcut})</span></p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        <div className="h-px bg-border my-2" />

        {/* History */}
        <div className="flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={undo}
                disabled={!canUndo}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  "hover:bg-secondary text-muted-foreground hover:text-foreground",
                  !canUndo && "opacity-50 cursor-not-allowed"
                )}
              >
                <Undo2 className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Undo <span className="text-muted-foreground">(Ctrl+Z)</span></p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  "hover:bg-secondary text-muted-foreground hover:text-foreground",
                  !canRedo && "opacity-50 cursor-not-allowed"
                )}
              >
                <Redo2 className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Redo <span className="text-muted-foreground">(Ctrl+Y)</span></p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

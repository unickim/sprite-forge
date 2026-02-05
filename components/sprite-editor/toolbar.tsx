"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  Pencil,
  Eraser,
  PaintBucket,
  Square,
  Circle,
  Minus,
  Move,
  MousePointer2,
  Pipette,
  Sparkles,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  FlipHorizontal,
  FlipVertical,
  RotateCcw,
  RotateCw,
} from "lucide-react"

interface ToolbarProps {
  currentTool: string
  onToolChange: (tool: string) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  zoom: number
  onZoomChange: (zoom: number) => void
  showGrid: boolean
  onToggleGrid: () => void
}

const tools = [
  { id: "select", icon: MousePointer2, label: "Select (V)" },
  { id: "move", icon: Move, label: "Move (M)" },
  { id: "pencil", icon: Pencil, label: "Pencil (B)" },
  { id: "eraser", icon: Eraser, label: "Eraser (E)" },
  { id: "bucket", icon: PaintBucket, label: "Fill (G)" },
  { id: "eyedropper", icon: Pipette, label: "Eyedropper (I)" },
  { id: "line", icon: Minus, label: "Line (L)" },
  { id: "rectangle", icon: Square, label: "Rectangle (R)" },
  { id: "ellipse", icon: Circle, label: "Ellipse (O)" },
  { id: "magic", icon: Sparkles, label: "Magic Wand (W)" },
]

export function Toolbar({
  currentTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  onZoomChange,
  showGrid,
  onToggleGrid,
}: ToolbarProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col items-center gap-1 p-2 bg-card border-r border-border w-12">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={currentTool === tool.id ? "secondary" : "ghost"}
                size="icon"
                className="w-8 h-8"
                onClick={() => onToolChange(tool.id)}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{tool.label}</TooltipContent>
          </Tooltip>
        ))}

        <Separator className="my-2 w-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>

        <Separator className="my-2 w-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => onZoomChange(Math.min(zoom * 2, 32))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Zoom In</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => onZoomChange(Math.max(zoom / 2, 1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Zoom Out</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showGrid ? "secondary" : "ghost"}
              size="icon"
              className="w-8 h-8"
              onClick={onToggleGrid}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Toggle Grid</TooltipContent>
        </Tooltip>

        <Separator className="my-2 w-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <FlipHorizontal className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Flip Horizontal</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <FlipVertical className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Flip Vertical</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Rotate Left</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <RotateCw className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Rotate Right</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Plus,
  Trash2,
  Copy,
  Clock,
  Film,
} from "lucide-react"

interface Frame {
  id: string
  duration: number
  layerData: Map<string, ImageData | null>
}

interface TimelineProps {
  frames: Frame[]
  currentFrameIndex: number
  isPlaying: boolean
  fps: number
  onFrameSelect: (index: number) => void
  onFrameAdd: () => void
  onFrameDelete: (index: number) => void
  onFrameDuplicate: (index: number) => void
  onFrameDurationChange: (index: number, duration: number) => void
  onPlay: () => void
  onPause: () => void
  onFpsChange: (fps: number) => void
  onPrevFrame: () => void
  onNextFrame: () => void
}

export function Timeline({
  frames,
  currentFrameIndex,
  isPlaying,
  fps,
  onFrameSelect,
  onFrameAdd,
  onFrameDelete,
  onFrameDuplicate,
  onFrameDurationChange,
  onPlay,
  onPause,
  onFpsChange,
  onPrevFrame,
  onNextFrame,
}: TimelineProps) {
  return (
    <div className="border-t border-border bg-card">
      {/* Timeline header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Animation Timeline</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="number"
              value={fps}
              onChange={(e) => onFpsChange(parseInt(e.target.value) || 12)}
              className="w-14 h-7 text-xs text-center"
              min={1}
              max={60}
            />
            <span className="text-xs text-muted-foreground">FPS</span>
          </div>

          <div className="flex items-center border-l border-border pl-2 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7"
              onClick={onPrevFrame}
            >
              <SkipBack className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7"
              onClick={isPlaying ? onPause : onPlay}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7"
              onClick={onNextFrame}
            >
              <SkipForward className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={onFrameAdd}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Frames */}
      <ScrollArea className="w-full">
        <div className="flex items-start gap-1 p-3">
          {frames.map((frame, index) => (
            <div
              key={frame.id}
              className={`group relative flex flex-col items-center gap-1 p-1 rounded cursor-pointer transition-colors ${
                currentFrameIndex === index
                  ? "bg-accent"
                  : "hover:bg-muted"
              }`}
              onClick={() => onFrameSelect(index)}
            >
              {/* Frame thumbnail */}
              <div
                className={`w-16 h-16 bg-muted/50 rounded border-2 transition-colors ${
                  currentFrameIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
                    linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
                    linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
                  `,
                  backgroundSize: "8px 8px",
                  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                  backgroundColor: "#2a2a2a",
                }}
              />

              {/* Frame number */}
              <span className="text-xs text-muted-foreground">
                {index + 1}
              </span>

              {/* Duration indicator */}
              <div className="flex items-center gap-0.5">
                <Input
                  type="number"
                  value={frame.duration}
                  onChange={(e) =>
                    onFrameDurationChange(index, parseInt(e.target.value) || 100)
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="w-10 h-5 text-[10px] text-center px-1"
                  min={10}
                  max={10000}
                />
                <span className="text-[10px] text-muted-foreground">ms</span>
              </div>

              {/* Frame actions */}
              <div className="absolute -top-1 -right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-card rounded shadow-sm border border-border">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFrameDuplicate(index)
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFrameDelete(index)
                  }}
                  disabled={frames.length <= 1}
                  className="p-1 text-muted-foreground hover:text-destructive disabled:opacity-30"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

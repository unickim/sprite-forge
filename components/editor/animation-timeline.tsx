"use client"

import { useCanvas } from "@/lib/canvas-context"
import { cn } from "@/lib/utils"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Plus,
  Copy,
  Trash2,
} from "lucide-react"
import { useEffect, useRef } from "react"

export function AnimationTimeline() {
  const {
    frames,
    currentFrameId,
    setCurrentFrameId,
    addFrame,
    deleteFrame,
    duplicateFrame,
    isPlaying,
    setIsPlaying,
    fps,
    setFps,
  } = useCanvas()

  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Animation playback
  useEffect(() => {
    if (isPlaying) {
      const currentIndex = frames.findIndex((f) => f.id === currentFrameId)
      playIntervalRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % frames.length
        setCurrentFrameId(frames[nextIndex].id)
      }, 1000 / fps)
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [isPlaying, currentFrameId, frames, fps, setCurrentFrameId])

  const goToFirstFrame = () => {
    if (frames.length > 0) {
      setCurrentFrameId(frames[0].id)
    }
  }

  const goToLastFrame = () => {
    if (frames.length > 0) {
      setCurrentFrameId(frames[frames.length - 1].id)
    }
  }

  const currentIndex = frames.findIndex((f) => f.id === currentFrameId)

  return (
    <div className="bg-card border-t border-border">
      {/* Controls */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={goToFirstFrame}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "p-1.5 rounded transition-colors",
              isPlaying
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={goToLastFrame}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* FPS control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">FPS</span>
          <input
            type="number"
            value={fps}
            onChange={(e) => setFps(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
            className="w-12 px-2 py-1 text-xs bg-input border border-border rounded text-foreground"
            min={1}
            max={60}
          />
        </div>

        {/* Frame info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Frame</span>
          <span className="font-mono text-foreground">{currentIndex + 1}</span>
          <span>/</span>
          <span className="font-mono text-foreground">{frames.length}</span>
        </div>

        {/* Frame actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={addFrame}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
            title="Add Frame"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => duplicateFrame(currentFrameId)}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
            title="Duplicate Frame"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteFrame(currentFrameId)}
            disabled={frames.length <= 1}
            className={cn(
              "p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground",
              frames.length <= 1 && "opacity-50 cursor-not-allowed"
            )}
            title="Delete Frame"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex gap-2 p-3 overflow-x-auto">
        {frames.map((frame, index) => (
          <button
            key={frame.id}
            onClick={() => setCurrentFrameId(frame.id)}
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded border-2 transition-all flex items-center justify-center",
              currentFrameId === frame.id
                ? "border-primary bg-secondary"
                : "border-border bg-muted hover:border-muted-foreground"
            )}
          >
            <span className="text-xs font-mono text-muted-foreground">{index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

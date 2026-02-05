"use client"

import React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { useCanvas } from "@/lib/canvas-context"

export function DrawingCanvas() {
  const {
    canvasWidth,
    canvasHeight,
    zoom,
    currentTool,
    primaryColor,
    secondaryColor,
    brushSettings,
    layers,
    currentLayerId,
  } = useCanvas()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null)
  const pixelDataRef = useRef<Map<string, string>>(new Map())

  const getPixelPos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / zoom)
      const y = Math.floor((e.clientY - rect.top) / zoom)
      if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) return null
      return { x, y }
    },
    [zoom, canvasWidth, canvasHeight]
  )

  const drawPixel = useCallback(
    (x: number, y: number, color: string) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!ctx) return

      if (currentTool === "eraser") {
        ctx.clearRect(x * zoom, y * zoom, zoom, zoom)
        pixelDataRef.current.delete(`${x},${y}`)
      } else {
        ctx.fillStyle = color
        ctx.fillRect(x * zoom, y * zoom, zoom, zoom)
        pixelDataRef.current.set(`${x},${y}`, color)
      }
    },
    [zoom, currentTool]
  )

  const drawLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number, color: string) => {
      const dx = Math.abs(x1 - x0)
      const dy = Math.abs(y1 - y0)
      const sx = x0 < x1 ? 1 : -1
      const sy = y0 < y1 ? 1 : -1
      let err = dx - dy

      while (true) {
        drawPixel(x0, y0, color)
        if (x0 === x1 && y0 === y1) break
        const e2 = 2 * err
        if (e2 > -dy) {
          err -= dy
          x0 += sx
        }
        if (e2 < dx) {
          err += dx
          y0 += sy
        }
      }
    },
    [drawPixel]
  )

  const floodFill = useCallback(
    (startX: number, startY: number, fillColor: string) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!ctx) return

      const targetColor = pixelDataRef.current.get(`${startX},${startY}`) || "transparent"
      if (targetColor === fillColor) return

      const stack: [number, number][] = [[startX, startY]]
      const visited = new Set<string>()

      while (stack.length > 0) {
        const [x, y] = stack.pop()!
        const key = `${x},${y}`

        if (visited.has(key)) continue
        if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) continue

        const currentColor = pixelDataRef.current.get(key) || "transparent"
        if (currentColor !== targetColor) continue

        visited.add(key)
        drawPixel(x, y, fillColor)

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
      }
    },
    [canvasWidth, canvasHeight, drawPixel]
  )

  const drawRect = useCallback(
    (x0: number, y0: number, x1: number, y1: number, color: string, preview = false) => {
      const canvas = preview ? previewRef.current : canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!ctx) return

      if (preview) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      }

      const minX = Math.min(x0, x1)
      const maxX = Math.max(x0, x1)
      const minY = Math.min(y0, y1)
      const maxY = Math.max(y0, y1)

      ctx.fillStyle = color
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          if (x === minX || x === maxX || y === minY || y === maxY) {
            ctx.fillRect(x * zoom, y * zoom, zoom, zoom)
            if (!preview) pixelDataRef.current.set(`${x},${y}`, color)
          }
        }
      }
    },
    [zoom]
  )

  const drawEllipse = useCallback(
    (x0: number, y0: number, x1: number, y1: number, color: string, preview = false) => {
      const canvas = preview ? previewRef.current : canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!ctx) return

      if (preview) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      }

      const centerX = (x0 + x1) / 2
      const centerY = (y0 + y1) / 2
      const radiusX = Math.abs(x1 - x0) / 2
      const radiusY = Math.abs(y1 - y0) / 2

      ctx.fillStyle = color
      for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) {
        for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
          const dx = (x - centerX) / (radiusX || 1)
          const dy = (y - centerY) / (radiusY || 1)
          if (dx * dx + dy * dy <= 1) {
            ctx.fillRect(x * zoom, y * zoom, zoom, zoom)
            if (!preview) pixelDataRef.current.set(`${x},${y}`, color)
          }
        }
      }
    },
    [zoom]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getPixelPos(e)
      if (!pos) return

      const currentLayer = layers.find((l) => l.id === currentLayerId)
      if (currentLayer?.locked) return

      setIsDrawing(true)
      setLastPos(pos)

      const color = e.button === 2 ? secondaryColor : primaryColor

      if (currentTool === "brush" || currentTool === "eraser") {
        drawPixel(pos.x, pos.y, color)
      } else if (currentTool === "fill") {
        floodFill(pos.x, pos.y, color)
      } else if (currentTool === "picker") {
        const pickedColor = pixelDataRef.current.get(`${pos.x},${pos.y}`)
        if (pickedColor) {
          // Would need to update context here
        }
      }
    },
    [
      getPixelPos,
      currentTool,
      primaryColor,
      secondaryColor,
      drawPixel,
      floodFill,
      layers,
      currentLayerId,
    ]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return
      const pos = getPixelPos(e)
      if (!pos || !lastPos) return

      const color = e.buttons === 2 ? secondaryColor : primaryColor

      if (currentTool === "brush" || currentTool === "eraser") {
        drawLine(lastPos.x, lastPos.y, pos.x, pos.y, color)
      } else if (currentTool === "line") {
        // Preview line
        const preview = previewRef.current
        const ctx = preview?.getContext("2d")
        if (ctx && preview) {
          ctx.clearRect(0, 0, preview.width, preview.height)
          ctx.fillStyle = color
          let x0 = lastPos.x,
            y0 = lastPos.y,
            x1 = pos.x,
            y1 = pos.y
          const dx = Math.abs(x1 - x0)
          const dy = Math.abs(y1 - y0)
          const sx = x0 < x1 ? 1 : -1
          const sy = y0 < y1 ? 1 : -1
          let err = dx - dy
          while (true) {
            ctx.fillRect(x0 * zoom, y0 * zoom, zoom, zoom)
            if (x0 === x1 && y0 === y1) break
            const e2 = 2 * err
            if (e2 > -dy) {
              err -= dy
              x0 += sx
            }
            if (e2 < dx) {
              err += dx
              y0 += sy
            }
          }
        }
      } else if (currentTool === "rect") {
        drawRect(lastPos.x, lastPos.y, pos.x, pos.y, color, true)
      } else if (currentTool === "ellipse") {
        drawEllipse(lastPos.x, lastPos.y, pos.x, pos.y, color, true)
      }

      if (currentTool === "brush" || currentTool === "eraser") {
        setLastPos(pos)
      }
    },
    [
      isDrawing,
      getPixelPos,
      lastPos,
      currentTool,
      primaryColor,
      secondaryColor,
      drawLine,
      drawRect,
      drawEllipse,
      zoom,
    ]
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return
      const pos = getPixelPos(e)
      const color = e.button === 2 ? secondaryColor : primaryColor

      if (pos && lastPos) {
        if (currentTool === "line") {
          drawLine(lastPos.x, lastPos.y, pos.x, pos.y, color)
        } else if (currentTool === "rect") {
          drawRect(lastPos.x, lastPos.y, pos.x, pos.y, color)
        } else if (currentTool === "ellipse") {
          drawEllipse(lastPos.x, lastPos.y, pos.x, pos.y, color)
        }
      }

      // Clear preview
      const preview = previewRef.current
      const ctx = preview?.getContext("2d")
      if (ctx && preview) {
        ctx.clearRect(0, 0, preview.width, preview.height)
      }

      setIsDrawing(false)
      setLastPos(null)
    },
    [
      isDrawing,
      getPixelPos,
      lastPos,
      currentTool,
      primaryColor,
      secondaryColor,
      drawLine,
      drawRect,
      drawEllipse,
    ]
  )

  // Draw grid
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    // Draw checkered background for transparency
    const checkSize = zoom / 2
    for (let y = 0; y < canvasHeight * zoom; y += checkSize) {
      for (let x = 0; x < canvasWidth * zoom; x += checkSize) {
        const isEven = ((x / checkSize) + (y / checkSize)) % 2 === 0
        ctx.fillStyle = isEven ? "#2a2a3a" : "#1e1e2e"
        ctx.fillRect(x, y, checkSize, checkSize)
      }
    }

    // Restore pixels
    pixelDataRef.current.forEach((color, key) => {
      const [x, y] = key.split(",").map(Number)
      ctx.fillStyle = color
      ctx.fillRect(x * zoom, y * zoom, zoom, zoom)
    })
  }, [canvasWidth, canvasHeight, zoom])

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-auto bg-background flex items-center justify-center p-8"
    >
      <div className="relative" style={{ width: canvasWidth * zoom, height: canvasHeight * zoom }}>
        {/* Grid overlay */}
        {zoom >= 4 && (
          <svg
            className="absolute inset-0 pointer-events-none z-10"
            width={canvasWidth * zoom}
            height={canvasHeight * zoom}
          >
            <defs>
              <pattern
                id="grid"
                width={zoom}
                height={zoom}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${zoom} 0 L 0 0 0 ${zoom}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        )}

        {/* Main canvas */}
        <canvas
          ref={canvasRef}
          width={canvasWidth * zoom}
          height={canvasHeight * zoom}
          className="border border-border rounded cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Preview canvas for shapes */}
        <canvas
          ref={previewRef}
          width={canvasWidth * zoom}
          height={canvasHeight * zoom}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
    </div>
  )
}

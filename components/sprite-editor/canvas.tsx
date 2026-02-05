"use client"

import React from "react"

import { useRef, useEffect, useState, useCallback } from "react"

interface CanvasProps {
  width: number
  height: number
  zoom: number
  showGrid: boolean
  currentTool: string
  currentColor: string
  brushSize: number
  layers: Layer[]
  activeLayerId: string
  onLayerUpdate: (layerId: string, imageData: ImageData) => void
  onHistoryPush: () => void
}

interface Layer {
  id: string
  name: string
  visible: boolean
  opacity: number
  locked: boolean
  imageData: ImageData | null
}

export function Canvas({
  width,
  height,
  zoom,
  showGrid,
  currentTool,
  currentColor,
  brushSize,
  layers,
  activeLayerId,
  onLayerUpdate,
  onHistoryPush,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const getPixelPosition = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / zoom)
      const y = Math.floor((e.clientY - rect.top) / zoom)
      return { x, y }
    },
    [zoom]
  )

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  const drawPixel = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, erase = false) => {
      const activeLayer = layers.find((l) => l.id === activeLayerId)
      if (!activeLayer || activeLayer.locked || !activeLayer.visible) return

      const halfSize = Math.floor(brushSize / 2)
      for (let i = -halfSize; i <= halfSize; i++) {
        for (let j = -halfSize; j <= halfSize; j++) {
          const px = x + i
          const py = y + j
          if (px >= 0 && px < width && py >= 0 && py < height) {
            if (erase) {
              ctx.clearRect(px, py, 1, 1)
            } else {
              ctx.fillStyle = currentColor
              ctx.fillRect(px, py, 1, 1)
            }
          }
        }
      }
    },
    [activeLayerId, brushSize, currentColor, height, layers, width]
  )

  const drawLine = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      erase = false
    ) => {
      const dx = Math.abs(x1 - x0)
      const dy = Math.abs(y1 - y0)
      const sx = x0 < x1 ? 1 : -1
      const sy = y0 < y1 ? 1 : -1
      let err = dx - dy

      while (true) {
        drawPixel(ctx, x0, y0, erase)
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
    (ctx: CanvasRenderingContext2D, startX: number, startY: number) => {
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      const targetColor = {
        r: data[(startY * width + startX) * 4],
        g: data[(startY * width + startX) * 4 + 1],
        b: data[(startY * width + startX) * 4 + 2],
        a: data[(startY * width + startX) * 4 + 3],
      }
      const fillColor = hexToRgb(currentColor)

      if (
        targetColor.r === fillColor.r &&
        targetColor.g === fillColor.g &&
        targetColor.b === fillColor.b &&
        targetColor.a === 255
      ) {
        return
      }

      const stack: [number, number][] = [[startX, startY]]
      const visited = new Set<string>()

      while (stack.length > 0) {
        const [x, y] = stack.pop()!
        const key = `${x},${y}`
        if (visited.has(key)) continue
        if (x < 0 || x >= width || y < 0 || y >= height) continue

        const idx = (y * width + x) * 4
        if (
          data[idx] !== targetColor.r ||
          data[idx + 1] !== targetColor.g ||
          data[idx + 2] !== targetColor.b ||
          data[idx + 3] !== targetColor.a
        ) {
          continue
        }

        visited.add(key)
        data[idx] = fillColor.r
        data[idx + 1] = fillColor.g
        data[idx + 2] = fillColor.b
        data[idx + 3] = 255

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
      }

      ctx.putImageData(imageData, 0, 0)
    },
    [currentColor, height, width]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        setIsPanning(true)
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
        return
      }

      const pos = getPixelPosition(e)
      if (!pos) return

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      onHistoryPush()
      setIsDrawing(true)
      setLastPos(pos)

      if (currentTool === "pencil") {
        drawPixel(ctx, pos.x, pos.y)
      } else if (currentTool === "eraser") {
        drawPixel(ctx, pos.x, pos.y, true)
      } else if (currentTool === "bucket") {
        floodFill(ctx, pos.x, pos.y)
        const imageData = ctx.getImageData(0, 0, width, height)
        onLayerUpdate(activeLayerId, imageData)
      }
    },
    [
      activeLayerId,
      currentTool,
      drawPixel,
      floodFill,
      getPixelPosition,
      height,
      onHistoryPush,
      onLayerUpdate,
      pan,
      width,
    ]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isPanning) {
        setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y })
        return
      }

      const pos = getPixelPosition(e)
      if (!pos) return

      const overlay = overlayRef.current
      if (overlay) {
        const octx = overlay.getContext("2d")
        if (octx) {
          octx.clearRect(0, 0, width, height)
          octx.fillStyle = "rgba(255,255,255,0.3)"
          const halfSize = Math.floor(brushSize / 2)
          for (let i = -halfSize; i <= halfSize; i++) {
            for (let j = -halfSize; j <= halfSize; j++) {
              octx.fillRect(pos.x + i, pos.y + j, 1, 1)
            }
          }
        }
      }

      if (!isDrawing || !lastPos) return

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      if (currentTool === "pencil") {
        drawLine(ctx, lastPos.x, lastPos.y, pos.x, pos.y)
      } else if (currentTool === "eraser") {
        drawLine(ctx, lastPos.x, lastPos.y, pos.x, pos.y, true)
      }

      setLastPos(pos)
    },
    [
      brushSize,
      currentTool,
      drawLine,
      getPixelPosition,
      height,
      isDrawing,
      isPanning,
      lastPos,
      panStart,
      width,
    ]
  )

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false)
      return
    }

    if (isDrawing) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, width, height)
          onLayerUpdate(activeLayerId, imageData)
        }
      }
    }
    setIsDrawing(false)
    setLastPos(null)
  }, [activeLayerId, height, isDrawing, isPanning, onLayerUpdate, width])

  const handleMouseLeave = useCallback(() => {
    const overlay = overlayRef.current
    if (overlay) {
      const octx = overlay.getContext("2d")
      if (octx) {
        octx.clearRect(0, 0, width, height)
      }
    }
  }, [height, width])

  useEffect(() => {
    const activeLayer = layers.find((l) => l.id === activeLayerId)
    if (!activeLayer?.imageData) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    ctx.putImageData(activeLayer.imageData, 0, 0)
  }, [activeLayerId, height, layers, width])

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-muted/30 overflow-hidden flex items-center justify-center relative"
    >
      <div
        className="relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        {/* Checkerboard background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            width: width * zoom,
            height: height * zoom,
            backgroundImage: `
              linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
              linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
              linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
            `,
            backgroundSize: `${zoom * 2}px ${zoom * 2}px`,
            backgroundPosition: `0 0, 0 ${zoom}px, ${zoom}px ${-zoom}px, ${-zoom}px 0px`,
            backgroundColor: "#2a2a2a",
          }}
        />

        {/* Layer canvases */}
        {layers.map((layer) => (
          <canvas
            key={layer.id}
            ref={layer.id === activeLayerId ? canvasRef : undefined}
            width={width}
            height={height}
            className={`absolute top-0 left-0 ${
              layer.id === activeLayerId ? "z-10" : "z-0"
            }`}
            style={{
              width: width * zoom,
              height: height * zoom,
              imageRendering: "pixelated",
              opacity: layer.visible ? layer.opacity / 100 : 0,
              display: layer.visible ? "block" : "none",
            }}
            onMouseDown={layer.id === activeLayerId ? handleMouseDown : undefined}
            onMouseMove={layer.id === activeLayerId ? handleMouseMove : undefined}
            onMouseUp={layer.id === activeLayerId ? handleMouseUp : undefined}
            onMouseLeave={layer.id === activeLayerId ? handleMouseLeave : undefined}
          />
        ))}

        {/* Overlay for cursor preview */}
        <canvas
          ref={overlayRef}
          width={width}
          height={height}
          className="absolute top-0 left-0 z-20 pointer-events-none"
          style={{
            width: width * zoom,
            height: height * zoom,
            imageRendering: "pixelated",
          }}
        />

        {/* Grid overlay */}
        {showGrid && zoom >= 4 && (
          <div
            className="absolute top-0 left-0 z-30 pointer-events-none"
            style={{
              width: width * zoom,
              height: height * zoom,
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${zoom}px ${zoom}px`,
            }}
          />
        )}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur px-3 py-1.5 rounded-md text-sm text-muted-foreground">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}

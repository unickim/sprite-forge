"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Header } from "./header"
import { Toolbar } from "./toolbar"
import { Canvas } from "./canvas"
import { LayersPanel } from "./layers-panel"
import { ColorPicker } from "./color-picker"
import { BrushSettings } from "./brush-settings"
import { Timeline } from "./timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Layer {
  id: string
  name: string
  visible: boolean
  opacity: number
  locked: boolean
  imageData: ImageData | null
}

interface Frame {
  id: string
  duration: number
  layerData: Map<string, ImageData | null>
}

export function SpriteEditor() {
  const [canvasWidth, setCanvasWidth] = useState(64)
  const [canvasHeight, setCanvasHeight] = useState(64)
  const [zoom, setZoom] = useState(8)
  const [showGrid, setShowGrid] = useState(true)
  const [currentTool, setCurrentTool] = useState("pencil")
  const [currentColor, setCurrentColor] = useState("#ffffff")
  const [brushSize, setBrushSize] = useState(1)
  const [recentColors, setRecentColors] = useState<string[]>([])

  const [layers, setLayers] = useState<Layer[]>([
    {
      id: "layer-1",
      name: "Layer 1",
      visible: true,
      opacity: 100,
      locked: false,
      imageData: null,
    },
  ])
  const [activeLayerId, setActiveLayerId] = useState("layer-1")

  const [frames, setFrames] = useState<Frame[]>([
    {
      id: "frame-1",
      duration: 100,
      layerData: new Map(),
    },
  ])
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [fps, setFps] = useState(12)

  const [history, setHistory] = useState<Layer[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const animationRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef(0)

  // Initialize layers with ImageData
  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.createImageData(canvasWidth, canvasHeight)
    setLayers((prev) =>
      prev.map((layer) => ({
        ...layer,
        imageData: layer.imageData || imageData,
      }))
    )
  }, [canvasWidth, canvasHeight])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const animate = (time: number) => {
      const currentFrame = frames[currentFrameIndex]
      const frameDuration = currentFrame.duration

      if (time - lastFrameTimeRef.current >= frameDuration) {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length)
        lastFrameTimeRef.current = time
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, frames, currentFrameIndex])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      switch (e.key.toLowerCase()) {
        case "b":
          setCurrentTool("pencil")
          break
        case "e":
          setCurrentTool("eraser")
          break
        case "g":
          setCurrentTool("bucket")
          break
        case "v":
          setCurrentTool("select")
          break
        case "m":
          setCurrentTool("move")
          break
        case "i":
          setCurrentTool("eyedropper")
          break
        case "l":
          setCurrentTool("line")
          break
        case "r":
          setCurrentTool("rectangle")
          break
        case "o":
          setCurrentTool("ellipse")
          break
        case "w":
          setCurrentTool("magic")
          break
        case "z":
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              handleRedo()
            } else {
              handleUndo()
            }
          }
          break
        case "y":
          if (e.ctrlKey || e.metaKey) {
            handleRedo()
          }
          break
        case "[":
          setBrushSize((prev) => Math.max(1, prev - 1))
          break
        case "]":
          setBrushSize((prev) => Math.min(32, prev + 1))
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleHistoryPush = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(layers)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex, layers])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setLayers(JSON.parse(JSON.stringify(history[historyIndex - 1])))
    }
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setLayers(JSON.parse(JSON.stringify(history[historyIndex + 1])))
    }
  }, [history, historyIndex])

  const handleLayerUpdate = useCallback(
    (layerId: string, imageData: ImageData) => {
      setLayers((prev) =>
        prev.map((layer) =>
          layer.id === layerId ? { ...layer, imageData } : layer
        )
      )
    },
    []
  )

  const handleColorChange = useCallback((color: string) => {
    setCurrentColor(color)
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color)
      return [color, ...filtered].slice(0, 12)
    })
  }, [])

  const handleNewProject = useCallback((width: number, height: number) => {
    setCanvasWidth(width)
    setCanvasHeight(height)
    setLayers([
      {
        id: "layer-1",
        name: "Layer 1",
        visible: true,
        opacity: 100,
        locked: false,
        imageData: null,
      },
    ])
    setActiveLayerId("layer-1")
    setFrames([
      {
        id: "frame-1",
        duration: 100,
        layerData: new Map(),
      },
    ])
    setCurrentFrameIndex(0)
    setHistory([])
    setHistoryIndex(-1)
  }, [])

  const handleLayerAdd = useCallback(() => {
    const newId = `layer-${Date.now()}`
    const canvas = document.createElement("canvas")
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext("2d")
    const imageData = ctx?.createImageData(canvasWidth, canvasHeight) || null

    setLayers((prev) => [
      {
        id: newId,
        name: `Layer ${prev.length + 1}`,
        visible: true,
        opacity: 100,
        locked: false,
        imageData,
      },
      ...prev,
    ])
    setActiveLayerId(newId)
  }, [canvasWidth, canvasHeight])

  const handleLayerDelete = useCallback(
    (id: string) => {
      if (layers.length <= 1) return
      setLayers((prev) => prev.filter((l) => l.id !== id))
      if (activeLayerId === id) {
        setActiveLayerId(layers[0].id === id ? layers[1].id : layers[0].id)
      }
    },
    [activeLayerId, layers]
  )

  const handleLayerDuplicate = useCallback(
    (id: string) => {
      const layer = layers.find((l) => l.id === id)
      if (!layer) return

      const newId = `layer-${Date.now()}`
      const index = layers.findIndex((l) => l.id === id)

      const newImageData = layer.imageData
        ? new ImageData(
            new Uint8ClampedArray(layer.imageData.data),
            layer.imageData.width,
            layer.imageData.height
          )
        : null

      setLayers((prev) => {
        const newLayers = [...prev]
        newLayers.splice(index, 0, {
          ...layer,
          id: newId,
          name: `${layer.name} Copy`,
          imageData: newImageData,
        })
        return newLayers
      })
    },
    [layers]
  )

  const handleFrameAdd = useCallback(() => {
    const newId = `frame-${Date.now()}`
    setFrames((prev) => [
      ...prev,
      {
        id: newId,
        duration: 100,
        layerData: new Map(),
      },
    ])
  }, [])

  const handleFrameDelete = useCallback(
    (index: number) => {
      if (frames.length <= 1) return
      setFrames((prev) => prev.filter((_, i) => i !== index))
      if (currentFrameIndex >= index && currentFrameIndex > 0) {
        setCurrentFrameIndex(currentFrameIndex - 1)
      }
    },
    [currentFrameIndex, frames.length]
  )

  const handleFrameDuplicate = useCallback(
    (index: number) => {
      const frame = frames[index]
      const newId = `frame-${Date.now()}`
      setFrames((prev) => {
        const newFrames = [...prev]
        newFrames.splice(index + 1, 0, {
          ...frame,
          id: newId,
          layerData: new Map(frame.layerData),
        })
        return newFrames
      })
    },
    [frames]
  )

  const handleExportPng = useCallback(() => {
    const canvas = document.createElement("canvas")
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Render all visible layers
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i]
      if (!layer.visible || !layer.imageData) continue

      ctx.globalAlpha = layer.opacity / 100
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = canvasWidth
      tempCanvas.height = canvasHeight
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) continue

      tempCtx.putImageData(layer.imageData, 0, 0)
      ctx.drawImage(tempCanvas, 0, 0)
    }

    const link = document.createElement("a")
    link.download = "sprite.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [canvasWidth, canvasHeight, layers])

  const handleExportSpritesheet = useCallback(() => {
    const frameCount = frames.length
    const canvas = document.createElement("canvas")
    canvas.width = canvasWidth * frameCount
    canvas.height = canvasHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // For now, just export current frames as placeholder
    for (let f = 0; f < frameCount; f++) {
      ctx.fillStyle = `hsl(${(f * 360) / frameCount}, 50%, 50%)`
      ctx.fillRect(f * canvasWidth, 0, canvasWidth, canvasHeight)
    }

    const link = document.createElement("a")
    link.download = "spritesheet.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [canvasWidth, canvasHeight, frames.length])

  const handleExportUnityData = useCallback(() => {
    const data = {
      name: "sprite",
      width: canvasWidth,
      height: canvasHeight,
      frames: frames.map((f, i) => ({
        index: i,
        duration: f.duration,
      })),
      fps,
      totalDuration: frames.reduce((acc, f) => acc + f.duration, 0),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const link = document.createElement("a")
    link.download = "sprite_data.json"
    link.href = URL.createObjectURL(blob)
    link.click()
  }, [canvasWidth, canvasHeight, frames, fps])

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        onNewProject={handleNewProject}
        onExportPng={handleExportPng}
        onExportSpritesheet={handleExportSpritesheet}
        onExportUnityData={handleExportUnityData}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left toolbar */}
        <Toolbar
          currentTool={currentTool}
          onToolChange={setCurrentTool}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          zoom={zoom}
          onZoomChange={setZoom}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
        />

        {/* Main canvas area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Canvas
            width={canvasWidth}
            height={canvasHeight}
            zoom={zoom}
            showGrid={showGrid}
            currentTool={currentTool}
            currentColor={currentColor}
            brushSize={brushSize}
            layers={layers}
            activeLayerId={activeLayerId}
            onLayerUpdate={handleLayerUpdate}
            onHistoryPush={handleHistoryPush}
          />

          {/* Timeline */}
          <Timeline
            frames={frames}
            currentFrameIndex={currentFrameIndex}
            isPlaying={isPlaying}
            fps={fps}
            onFrameSelect={setCurrentFrameIndex}
            onFrameAdd={handleFrameAdd}
            onFrameDelete={handleFrameDelete}
            onFrameDuplicate={handleFrameDuplicate}
            onFrameDurationChange={(index, duration) =>
              setFrames((prev) =>
                prev.map((f, i) => (i === index ? { ...f, duration } : f))
              )
            }
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onFpsChange={setFps}
            onPrevFrame={() =>
              setCurrentFrameIndex(
                (prev) => (prev - 1 + frames.length) % frames.length
              )
            }
            onNextFrame={() =>
              setCurrentFrameIndex((prev) => (prev + 1) % frames.length)
            }
          />
        </div>

        {/* Right panel */}
        <div className="w-64 border-l border-border bg-card flex flex-col">
          <Tabs defaultValue="colors" className="flex flex-col flex-1">
            <TabsList className="w-full rounded-none border-b border-border justify-start h-9 bg-transparent p-0">
              <TabsTrigger
                value="colors"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Colors
              </TabsTrigger>
              <TabsTrigger
                value="layers"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Layers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <BrushSettings
                  brushSize={brushSize}
                  onBrushSizeChange={setBrushSize}
                />
                <ColorPicker
                  currentColor={currentColor}
                  onColorChange={handleColorChange}
                  recentColors={recentColors}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="layers" className="flex-1 m-0 overflow-hidden">
              <LayersPanel
                layers={layers}
                activeLayerId={activeLayerId}
                onLayerSelect={setActiveLayerId}
                onLayerAdd={handleLayerAdd}
                onLayerDelete={handleLayerDelete}
                onLayerDuplicate={handleLayerDuplicate}
                onLayerToggleVisibility={(id) =>
                  setLayers((prev) =>
                    prev.map((l) =>
                      l.id === id ? { ...l, visible: !l.visible } : l
                    )
                  )
                }
                onLayerToggleLock={(id) =>
                  setLayers((prev) =>
                    prev.map((l) =>
                      l.id === id ? { ...l, locked: !l.locked } : l
                    )
                  )
                }
                onLayerRename={(id, name) =>
                  setLayers((prev) =>
                    prev.map((l) => (l.id === id ? { ...l, name } : l))
                  )
                }
                onLayerOpacityChange={(id, opacity) =>
                  setLayers((prev) =>
                    prev.map((l) => (l.id === id ? { ...l, opacity } : l))
                  )
                }
                onLayerMoveUp={(id) => {
                  const index = layers.findIndex((l) => l.id === id)
                  if (index <= 0) return
                  setLayers((prev) => {
                    const newLayers = [...prev]
                    ;[newLayers[index - 1], newLayers[index]] = [
                      newLayers[index],
                      newLayers[index - 1],
                    ]
                    return newLayers
                  })
                }}
                onLayerMoveDown={(id) => {
                  const index = layers.findIndex((l) => l.id === id)
                  if (index >= layers.length - 1) return
                  setLayers((prev) => {
                    const newLayers = [...prev]
                    ;[newLayers[index], newLayers[index + 1]] = [
                      newLayers[index + 1],
                      newLayers[index],
                    ]
                    return newLayers
                  })
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

"use client"

import React from "react"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { Tool, Layer, AnimationFrame, BrushSettings } from "./types"

interface CanvasContextType {
  // Canvas settings
  canvasWidth: number
  canvasHeight: number
  setCanvasSize: (width: number, height: number) => void
  zoom: number
  setZoom: (zoom: number) => void

  // Tool state
  currentTool: Tool
  setCurrentTool: (tool: Tool) => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  secondaryColor: string
  setSecondaryColor: (color: string) => void
  brushSettings: BrushSettings
  setBrushSettings: (settings: BrushSettings) => void

  // Layers
  layers: Layer[]
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
  currentLayerId: string
  setCurrentLayerId: (id: string) => void
  addLayer: () => void
  deleteLayer: (id: string) => void
  toggleLayerVisibility: (id: string) => void
  toggleLayerLock: (id: string) => void
  reorderLayers: (fromIndex: number, toIndex: number) => void

  // Animation
  frames: AnimationFrame[]
  setFrames: React.Dispatch<React.SetStateAction<AnimationFrame[]>>
  currentFrameId: string
  setCurrentFrameId: (id: string) => void
  addFrame: () => void
  deleteFrame: (id: string) => void
  duplicateFrame: (id: string) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  fps: number
  setFps: (fps: number) => void

  // History
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const CanvasContext = createContext<CanvasContextType | null>(null)

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [canvasWidth, setCanvasWidth] = useState(64)
  const [canvasHeight, setCanvasHeight] = useState(64)
  const [zoom, setZoom] = useState(8)

  const [currentTool, setCurrentTool] = useState<Tool>("brush")
  const [primaryColor, setPrimaryColor] = useState("#4ade80")
  const [secondaryColor, setSecondaryColor] = useState("#1e1e2e")
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    size: 1,
    opacity: 100,
    hardness: 100,
  })

  const [layers, setLayers] = useState<Layer[]>([
    {
      id: "layer-1",
      name: "Layer 1",
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: "normal",
      pixels: null,
    },
  ])
  const [currentLayerId, setCurrentLayerId] = useState("layer-1")

  const [frames, setFrames] = useState<AnimationFrame[]>([
    {
      id: "frame-1",
      layerIds: ["layer-1"],
      duration: 100,
    },
  ])
  const [currentFrameId, setCurrentFrameId] = useState("frame-1")
  const [isPlaying, setIsPlaying] = useState(false)
  const [fps, setFps] = useState(12)

  const setCanvasSize = useCallback((width: number, height: number) => {
    setCanvasWidth(width)
    setCanvasHeight(height)
  }, [])

  const addLayer = useCallback(() => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: "normal",
      pixels: null,
    }
    setLayers((prev) => [...prev, newLayer])
    setCurrentLayerId(newLayer.id)
  }, [layers.length])

  const deleteLayer = useCallback(
    (id: string) => {
      if (layers.length <= 1) return
      setLayers((prev) => prev.filter((l) => l.id !== id))
      if (currentLayerId === id) {
        setCurrentLayerId(layers[0].id === id ? layers[1].id : layers[0].id)
      }
    },
    [layers, currentLayerId]
  )

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    )
  }, [])

  const toggleLayerLock = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l))
    )
  }, [])

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setLayers((prev) => {
      const result = [...prev]
      const [removed] = result.splice(fromIndex, 1)
      result.splice(toIndex, 0, removed)
      return result
    })
  }, [])

  const addFrame = useCallback(() => {
    const newFrame: AnimationFrame = {
      id: `frame-${Date.now()}`,
      layerIds: layers.map((l) => l.id),
      duration: 100,
    }
    setFrames((prev) => [...prev, newFrame])
    setCurrentFrameId(newFrame.id)
  }, [layers])

  const deleteFrame = useCallback(
    (id: string) => {
      if (frames.length <= 1) return
      setFrames((prev) => prev.filter((f) => f.id !== id))
      if (currentFrameId === id) {
        setCurrentFrameId(frames[0].id === id ? frames[1].id : frames[0].id)
      }
    },
    [frames, currentFrameId]
  )

  const duplicateFrame = useCallback(
    (id: string) => {
      const frame = frames.find((f) => f.id === id)
      if (!frame) return
      const newFrame: AnimationFrame = {
        ...frame,
        id: `frame-${Date.now()}`,
      }
      const index = frames.findIndex((f) => f.id === id)
      setFrames((prev) => [
        ...prev.slice(0, index + 1),
        newFrame,
        ...prev.slice(index + 1),
      ])
    },
    [frames]
  )

  // History (placeholder - would need proper implementation)
  const undo = useCallback(() => {}, [])
  const redo = useCallback(() => {}, [])

  return (
    <CanvasContext.Provider
      value={{
        canvasWidth,
        canvasHeight,
        setCanvasSize,
        zoom,
        setZoom,
        currentTool,
        setCurrentTool,
        primaryColor,
        setPrimaryColor,
        secondaryColor,
        setSecondaryColor,
        brushSettings,
        setBrushSettings,
        layers,
        setLayers,
        currentLayerId,
        setCurrentLayerId,
        addLayer,
        deleteLayer,
        toggleLayerVisibility,
        toggleLayerLock,
        reorderLayers,
        frames,
        setFrames,
        currentFrameId,
        setCurrentFrameId,
        addFrame,
        deleteFrame,
        duplicateFrame,
        isPlaying,
        setIsPlaying,
        fps,
        setFps,
        undo,
        redo,
        canUndo: false,
        canRedo: false,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider")
  }
  return context
}

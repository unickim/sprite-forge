export type Tool =
  | "brush"
  | "eraser"
  | "fill"
  | "picker"
  | "line"
  | "rect"
  | "ellipse"
  | "select"
  | "move"

export type BlendMode = "normal" | "multiply" | "screen" | "overlay"

export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  blendMode: BlendMode
  pixels: ImageData | null
}

export interface AnimationFrame {
  id: string
  layerIds: string[]
  duration: number
  thumbnail?: string
}

export interface SpriteProject {
  id: string
  name: string
  width: number
  height: number
  layers: Layer[]
  frames: AnimationFrame[]
  currentLayerId: string
  currentFrameId: string
}

export interface BrushSettings {
  size: number
  opacity: number
  hardness: number
}

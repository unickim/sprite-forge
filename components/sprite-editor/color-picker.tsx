"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Palette, Pipette } from "lucide-react"

interface ColorPickerProps {
  currentColor: string
  onColorChange: (color: string) => void
  recentColors: string[]
}

const presetColors = [
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00",
  "#ff00ff", "#00ffff", "#ff8000", "#8000ff", "#00ff80", "#ff0080",
  "#404040", "#808080", "#c0c0c0", "#800000", "#008000", "#000080",
  "#808000", "#800080", "#008080", "#ff8080", "#80ff80", "#8080ff",
]

export function ColorPicker({
  currentColor,
  onColorChange,
  recentColors,
}: ColorPickerProps) {
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)

  const hexToHsl = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return { h: 0, s: 100, l: 50 }

    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }, [])

  const hslToHex = useCallback((h: number, s: number, l: number) => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0")
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }, [])

  const handleHueChange = useCallback(
    (value: number[]) => {
      setHue(value[0])
      onColorChange(hslToHex(value[0], saturation, lightness))
    },
    [hslToHex, lightness, onColorChange, saturation]
  )

  const handleSaturationChange = useCallback(
    (value: number[]) => {
      setSaturation(value[0])
      onColorChange(hslToHex(hue, value[0], lightness))
    },
    [hslToHex, hue, lightness, onColorChange]
  )

  const handleLightnessChange = useCallback(
    (value: number[]) => {
      setLightness(value[0])
      onColorChange(hslToHex(hue, saturation, value[0]))
    },
    [hslToHex, hue, onColorChange, saturation]
  )

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        onColorChange(hex)
        const { h, s, l } = hexToHsl(hex)
        setHue(h)
        setSaturation(s)
        setLightness(l)
      }
    },
    [hexToHsl, onColorChange]
  )

  return (
    <div className="flex flex-col gap-4 p-3">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Colors</span>
      </div>

      {/* Current color preview */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border border-border shadow-sm"
          style={{ backgroundColor: currentColor }}
        />
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Hex</Label>
          <Input
            value={currentColor}
            onChange={handleHexInput}
            className="h-8 text-sm font-mono"
          />
        </div>
      </div>

      {/* HSL Sliders */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Hue</Label>
          <Slider
            value={[hue]}
            onValueChange={handleHueChange}
            max={360}
            step={1}
            className="h-3"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, 100%, 50%), 
                hsl(60, 100%, 50%), 
                hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), 
                hsl(240, 100%, 50%), 
                hsl(300, 100%, 50%), 
                hsl(360, 100%, 50%))`,
            }}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Saturation</Label>
          <Slider
            value={[saturation]}
            onValueChange={handleSaturationChange}
            max={100}
            step={1}
            className="h-3"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Lightness</Label>
          <Slider
            value={[lightness]}
            onValueChange={handleLightnessChange}
            max={100}
            step={1}
            className="h-3"
          />
        </div>
      </div>

      {/* Preset colors */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Preset Colors</Label>
        <div className="grid grid-cols-6 gap-1">
          {presetColors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded border transition-transform hover:scale-110 ${
                currentColor === color
                  ? "border-primary ring-1 ring-primary"
                  : "border-border"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorChange(color)
                const { h, s, l } = hexToHsl(color)
                setHue(h)
                setSaturation(s)
                setLightness(l)
              }}
            />
          ))}
        </div>
      </div>

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Recent</Label>
          <div className="flex flex-wrap gap-1">
            {recentColors.slice(0, 12).map((color, i) => (
              <button
                key={`${color}-${i}`}
                className={`w-6 h-6 rounded border transition-transform hover:scale-110 ${
                  currentColor === color
                    ? "border-primary ring-1 ring-primary"
                    : "border-border"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onColorChange(color)
                  const { h, s, l } = hexToHsl(color)
                  setHue(h)
                  setSaturation(s)
                  setLightness(l)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install          # Install dependencies (or pnpm install)
npm run dev          # Start development server on http://localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
```

## Project Overview

SpriteForge is a web-based pixel art and sprite editor for Unity game development. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.

## Architecture

### State Management Pattern
All state lives in `components/sprite-editor/sprite-editor.tsx` and is passed down via props. There is no external state library - only React hooks (useState, useCallback, useEffect). The `lib/canvas-context.tsx` provides optional React Context but is not fully utilized.

### Canvas Rendering System
The editor uses a multi-layer HTML5 Canvas architecture:
- **Main canvas**: Pixel-level drawing operations using ImageData (Uint8ClampedArray)
- **Composite canvas**: Layer composition with opacity blending (back-to-front)
- **Overlay canvas**: Grid and preview display

Canvas operations use `context.getImageData()` directly rather than maintaining separate pixel arrays.

### History/Undo System
Uses JSON.stringify/parse to clone the entire layer array on each action. History is stored as an array with an index pointer. This is simple but memory-intensive for large canvases.

### Drawing Algorithms
- **Line drawing**: Bresenham's algorithm in canvas.tsx
- **Flood fill**: Stack-based algorithm (not recursive)

### Two Editor Implementations
- `components/sprite-editor/` - **Active** main editor
- `components/editor/` - Alternative implementation (appears abandoned)

## Key Files

| File | Purpose |
|------|---------|
| `components/sprite-editor/sprite-editor.tsx` | Central state management, keyboard shortcuts, export logic |
| `components/sprite-editor/canvas.tsx` | All drawing tool implementations and mouse handlers |
| `components/sprite-editor/toolbar.tsx` | Tool palette with tool definitions |
| `lib/types.ts` | TypeScript type definitions (Tool, Layer, Frame, etc.) |

## Adding New Features

**New drawing tool:**
1. Add type to `lib/types.ts`
2. Add to tools array in `toolbar.tsx`
3. Add keyboard shortcut in `sprite-editor.tsx` handleKeyDown
4. Implement drawing logic in `canvas.tsx` mouse handlers

**Canvas size presets:** Edit `presets` array in `header.tsx`

**Color palette:** Modify `presetColors` array in `color-picker.tsx`

## Keyboard Shortcuts

Tool shortcuts: V (Select), M (Move), B (Pencil), E (Eraser), G (Fill), I (Eyedropper), L (Line), R (Rectangle), O (Ellipse), W (Magic Wand)

Other: Ctrl+Z (Undo), Ctrl+Y/Ctrl+Shift+Z (Redo), [ ] (Brush size)

## Export Formats

- **PNG**: Single frame
- **Spritesheet**: Horizontal strip (all frames left-to-right)
- **Unity JSON**: Metadata with frame indices, durations, FPS

## Notes

- Grid overlay only renders at 4x zoom or higher (performance optimization)
- Blend modes defined in types but only "normal" is implemented
- Build ignores TypeScript errors (see `next.config.mjs`)

# SpriteForge - Unity UI Sprite Editor Guide

## Project Overview

SpriteForge is a web-based pixel art and sprite editor built with Next.js 16, React 19, and TypeScript. It is specifically designed for creating sprites and UI elements for Unity game development.

## Tech Stack

- **Framework**: Next.js 16.0.10
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Language**: TypeScript 5.x

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main entry point
├── components/
│   ├── sprite-editor/       # Main sprite editor components
│   │   ├── sprite-editor.tsx    # Main editor container
│   │   ├── header.tsx           # Top menu bar
│   │   ├── toolbar.tsx          # Left tool palette
│   │   ├── canvas.tsx           # Drawing canvas
│   │   ├── layers-panel.tsx     # Layer management
│   │   ├── color-picker.tsx     # Color selection
│   │   ├── brush-settings.tsx   # Brush configuration
│   │   └── timeline.tsx         # Animation timeline
│   ├── editor/              # Alternative editor components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── canvas-context.tsx   # React context for canvas state
│   └── utils.ts             # Utility functions (cn helper)
└── public/                  # Static assets
```

## Core Features

### 1. Drawing Tools
| Tool | Shortcut | Description |
|------|----------|-------------|
| Select | V | Select regions on canvas |
| Move | M | Move selected content |
| Pencil | B | Pixel-by-pixel drawing |
| Eraser | E | Remove pixels |
| Fill | G | Flood fill tool |
| Eyedropper | I | Pick color from canvas |
| Line | L | Draw straight lines |
| Rectangle | R | Draw rectangles |
| Ellipse | O | Draw ellipses |
| Magic Wand | W | Select similar colors |

### 2. Canvas Features
- **Zoom**: 1x to 32x magnification
- **Grid Overlay**: Toggle pixel grid (visible at 4x+ zoom)
- **Checkerboard Background**: Transparent background visualization
- **Pan**: Middle-click or Alt+click to pan

### 3. Layer System
- Multiple layer support
- Layer visibility toggle
- Layer lock/unlock
- Layer opacity control (0-100%)
- Layer reordering (move up/down)
- Duplicate and delete layers

### 4. Animation Timeline
- Frame-by-frame animation
- Adjustable frame duration (ms)
- FPS control (1-60)
- Play/Pause/Step controls
- Frame duplication and deletion

### 5. Export Options
- **PNG Export**: Single frame export
- **Spritesheet Export**: All frames in horizontal strip
- **Unity Data Export**: JSON metadata for Unity integration

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y / Ctrl+Shift+Z | Redo |
| [ | Decrease brush size |
| ] | Increase brush size |
| B | Pencil tool |
| E | Eraser tool |
| G | Fill tool |
| V | Select tool |
| M | Move tool |
| I | Eyedropper |
| L | Line tool |
| R | Rectangle tool |
| O | Ellipse tool |
| W | Magic wand |

## Component Architecture

### SpriteEditor (Main Component)
The central state management component that handles:
- Canvas dimensions and zoom level
- Current tool and color selection
- Layer state management
- Animation frame management
- History (undo/redo) stack
- Export functionality

### Canvas Component
Handles all drawing operations using HTML5 Canvas API:
- Pixel-level drawing with Bresenham's line algorithm
- Flood fill using stack-based algorithm
- Multi-layer rendering with opacity support
- Grid overlay rendering

### State Management
Uses React hooks (useState, useCallback, useEffect) for local state. The `canvas-context.tsx` provides a React Context for shared state across components.

## Unity Integration

### Exported JSON Format
```json
{
  "name": "sprite",
  "width": 64,
  "height": 64,
  "frames": [
    { "index": 0, "duration": 100 },
    { "index": 1, "duration": 100 }
  ],
  "fps": 12,
  "totalDuration": 200
}
```

### Spritesheet Format
- Horizontal strip layout
- Each frame placed sequentially left-to-right
- Dimensions: (width * frameCount) x height

## Installation

### Using shadcn CLI (Recommended)
```bash
npx shadcn@latest init
# Then copy the project files
```

### Manual Installation
1. Clone or download the project
2. Install dependencies:
```bash
npm install
# or
pnpm install
```
3. Run development server:
```bash
npm run dev
```

## Dependencies

### Core
- next: ^16.0.10
- react: ^19.2.0
- react-dom: ^19.2.0
- typescript: ^5

### UI Components
- @radix-ui/* (various primitives)
- lucide-react: ^0.454.0
- class-variance-authority: ^0.7.1
- tailwind-merge: ^3.3.1
- clsx: ^2.1.1

### Styling
- tailwindcss: ^4.1.9
- @tailwindcss/postcss: ^4.1.9
- tw-animate-css: 1.3.3

## Customization

### Adding New Tools
1. Add tool definition in `toolbar.tsx` tools array
2. Add keyboard shortcut in `sprite-editor.tsx` handleKeyDown
3. Implement tool logic in `canvas.tsx` mouse handlers

### Modifying Canvas Size Presets
Edit the `presets` array in `header.tsx`:
```typescript
const presets = [
  { label: "16x16", width: 16, height: 16 },
  // Add custom presets here
]
```

### Custom Color Palettes
Modify `presetColors` array in `color-picker.tsx`.

## Best Practices

1. **Performance**: Use `useCallback` for event handlers to prevent unnecessary re-renders
2. **State Updates**: Batch related state updates to minimize renders
3. **Canvas Operations**: Always get fresh context with `getContext("2d")` before drawing
4. **Memory**: Clear ImageData references when layers are deleted

## Troubleshooting

### Canvas Not Rendering
- Ensure ImageData is initialized in useEffect
- Check layer visibility and opacity settings

### Performance Issues
- Reduce zoom level for large canvases
- Disable grid overlay at high zoom levels
- Limit brush size for smoother drawing

### Export Issues
- Verify all layers are visible before export
- Check canvas dimensions are valid

## License

This project is open source. Feel free to modify and use for your projects.

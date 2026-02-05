"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  File,
  FolderOpen,
  Save,
  Download,
  Settings,
  HelpCircle,
  Gamepad2,
  ChevronDown,
  ImageIcon,
  FileJson,
  FileCode,
} from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  canvasWidth: number
  canvasHeight: number
  onNewProject: (width: number, height: number) => void
  onExportPng: () => void
  onExportSpritesheet: () => void
  onExportUnityData: () => void
}

export function Header({
  canvasWidth,
  canvasHeight,
  onNewProject,
  onExportPng,
  onExportSpritesheet,
  onExportUnityData,
}: HeaderProps) {
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [newWidth, setNewWidth] = useState(64)
  const [newHeight, setNewHeight] = useState(64)

  const presets = [
    { label: "16x16", width: 16, height: 16 },
    { label: "32x32", width: 32, height: 32 },
    { label: "64x64", width: 64, height: 64 },
    { label: "128x128", width: 128, height: 128 },
    { label: "256x256", width: 256, height: 256 },
  ]

  const handleCreateProject = () => {
    onNewProject(newWidth, newHeight)
    setNewProjectOpen(false)
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">SpriteForge</span>
        </div>

        <nav className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <File className="w-4 h-4" />
                File
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <File className="w-4 h-4 mr-2" />
                    New Project
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Project</DialogTitle>
                    <DialogDescription>
                      Create a new sprite project with custom dimensions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={newWidth}
                          onChange={(e) =>
                            setNewWidth(parseInt(e.target.value) || 64)
                          }
                          min={1}
                          max={1024}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={newHeight}
                          onChange={(e) =>
                            setNewHeight(parseInt(e.target.value) || 64)
                          }
                          min={1}
                          max={1024}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Presets</Label>
                      <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                          <Button
                            key={preset.label}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewWidth(preset.width)
                              setNewHeight(preset.height)
                            }}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setNewProjectOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem>
                <FolderOpen className="w-4 h-4 mr-2" />
                Open...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Save className="w-4 h-4 mr-2" />
                Save
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Save className="w-4 h-4 mr-2" />
                Save As...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={onExportPng}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Export as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExportSpritesheet}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Export Spritesheet
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onExportUnityData}>
                    <FileJson className="w-4 h-4 mr-2" />
                    Export Unity Data
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCode className="w-4 h-4 mr-2" />
                    Export as C# Script
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                Settings
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                Help
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 mr-2" />
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Gamepad2 className="w-4 h-4 mr-2" />
                About SpriteForge
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-muted-foreground">
          Canvas: {canvasWidth} x {canvasHeight}px
        </div>
        <Button size="sm" className="gap-1.5" onClick={onExportPng}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </header>
  )
}

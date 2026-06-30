'use client'

import { useEffect, useState } from "react"

const GRID_OPTIONS = [
  { value: '80x60',   label: '80 × 60 (Loose Canvas)' },
  { value: '120x90',  label: '120 × 90 (Balanced Weave)' },
  { value: '160x120', label: '160 × 120 (Tight Stitch)' },
  { value: '160x90',  label: '160 × 90 (Widescreen Loom)' },
  { value: '240x135', label: '240 × 135 (High-Def Matrix)' },
  { value: '320x180', label: '320 × 180 (Terminal Overkill)' },
]

const COLOR_PRESETS = [
  { label: 'Terminal', hex: '#00ff41' },
  { label: 'Amber',    hex: '#ffb000' },
  { label: 'Cyan',     hex: '#00f5ff' },
  { label: 'Rose',     hex: '#e11d48' },
  { label: 'Violet',   hex: '#8b5cf6' },
  { label: 'Snow',     hex: '#f8fafc' },
]

interface ControlFormProps {
  image: File | null
  video: File | null
  gridSize: string
  color: string
  colorMode: 'tint' | 'original'
  isLoading: boolean
  error: string | null
  onImageChange: (file: File | null) => void
  onVideoChange: (file: File | null) => void
  onGridSizeChange: (size: string) => void
  onColorChange: (color: string) => void
  onColorModeChange: (mode: 'tint' | 'original') => void
  onSubmit: (e: React.FormEvent) => void
  inputRef: React.RefObject<HTMLInputElement | null>
}

export function ControlForm({
  image, video, gridSize, color, colorMode, isLoading, error,
  onImageChange, onVideoChange, onGridSizeChange, onColorChange,
  onColorModeChange, onSubmit, inputRef,
}: ControlFormProps) {

  const activeFile = image || video
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  useEffect(()=>{
    if(!image){setPreviewUrl(null);return}
    const url = URL.createObjectURL(image)
    setPreviewUrl(url)
    return ()=>URL.revokeObjectURL(url)
  },[image])
  return (
    <form onSubmit={onSubmit} className="lg:col-span-5 space-y-6 bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
      <div>
        <h2 className="text-xl font-serif font-black text-stone-900">Tweak Options</h2>
        <p className="text-xs text-stone-500 font-medium">Configure the machinery parameters below.</p>
      </div>

      <hr className="border-stone-200" />

      {/* File Upload */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold uppercase text-stone-600">
          Choose Source
        </label>
        <div className="relative group border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl transition-colors p-6 bg-[#faf7f2]/50 text-center cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            disabled={isLoading}
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              if (!file) {
                onImageChange(null)
                onVideoChange(null)
              } else if (file.type.startsWith('video/')) {
                onImageChange(null)
                onVideoChange(file)
              } else {
                onVideoChange(null)
                onImageChange(file)
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="space-y-1 pointer-events-none">
            <p className="text-sm font-bold text-stone-700">
              {image
                ? `📎 ${image.name}`
                : video
                ? `🎬 ${video.name}`
                : 'Click to look up an image or video'}
            </p>
            <p className="text-xs text-stone-400 font-medium">Standard grid sizes work best</p>
          </div>
        </div>

        {/* Preview */}
        {image && (
          <img
            src={previewUrl || ''}
            alt="Preview"
            className="w-full h-auto rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
          />
        )}
        {video && (
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-full h-auto rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
          />
        )}
      </div>

      {/* Grid Size */}
      <div className="space-y-2">
        <label htmlFor="gridSize" className="block text-xs font-mono font-bold uppercase text-stone-600">
          Density Setting
        </label>
        <div className="relative">
          <select
            id="gridSize"
            value={gridSize}
            onChange={(e) => onGridSizeChange(e.target.value)}
            className="block w-full appearance-none rounded-xl border-2 border-stone-900 bg-white px-4 py-3 text-sm font-medium text-stone-800 outline-none transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] focus:bg-amber-50/20 cursor-pointer"
          >
            {GRID_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-800">▼</div>
        </div>
      </div>

      {/* Color Mode Toggle */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold uppercase text-stone-600">Color Mode</label>
        <div className="flex rounded-xl border-2 border-stone-900 overflow-hidden shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
          {(['tint', 'original'] as const).map((mode, i) => (
            <button
              key={mode}
              type="button"
              onClick={() => onColorModeChange(mode)}
              className={`flex-1 py-2.5 text-xs font-mono font-bold transition-colors ${i > 0 ? 'border-l-2 border-stone-900' : ''} ${
                colorMode === mode
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              {mode === 'tint' ? '🎨 Tint' : '🖼️ Original Colors'}
            </button>
          ))}
        </div>
      </div>

      {/* Tint Controls */}
      {colorMode === 'tint' && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase text-stone-600">Base Filter Tint</label>
            <div
              className="flex items-center gap-4 border-2 border-stone-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]"
              style={{ backgroundColor: color + '22' }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-10 h-8 rounded cursor-pointer border-2 border-stone-900 bg-transparent"
              />
              <div className="text-xs font-mono font-bold text-stone-600 uppercase select-all">{color}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-bold uppercase text-stone-500">Quick Presets</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PRESETS.map(({ label, hex }) => (
                <button
                  key={hex}
                  type="button"
                  title={label}
                  onClick={() => onColorChange(hex)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 text-[10px] font-mono font-bold transition-all ${
                    color === hex
                      ? 'border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] -translate-x-px -translate-y-px'
                      : 'border-stone-300 hover:border-stone-900'
                  }`}
                  style={{ backgroundColor: hex + '33', color: '#1c1917' }}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-stone-900/30 inline-block"
                    style={{ backgroundColor: hex }}
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={(!image && !video) || isLoading}
        className="w-full px-4 py-3 bg-stone-900 text-white font-bold rounded-xl border-2 border-stone-900 transition-all shadow-[3px_3px_0px_0px_rgba(225,29,72,1)] disabled:bg-stone-100 disabled:text-stone-400 disabled:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(225,29,72,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(225,29,72,1)]"
      >
        {isLoading ? 'Weaving Grid Arrays...' : 'Run the Loom!'}
      </button>

      {error && (
        <div className="p-3 bg-rose-50 border-2 border-rose-900 rounded-xl text-rose-900 text-xs font-mono font-bold">
          {error}
        </div>
      )}
    </form>
  )
}
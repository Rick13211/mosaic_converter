'use client'
import { MosaicData } from '@/types/mosaic'
import { ControlForm } from '@/components/ControlForm'
import { CanvasOutput } from '@/components/CanvasOutput'

interface ConverterViewProps {
  image: File | null
  video: File | null
  gridSize: string
  color: string
  colorMode: 'tint' | 'original'
  isLoading: boolean
  error: string | null
  data: MosaicData | null
  copied: boolean
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  inputRef: React.RefObject<HTMLInputElement | null>
  onBack: () => void
  onImageChange: (file: File | null) => void
  onVideoChange: (file: File | null) => void
  onGridSizeChange: (size: string) => void
  onColorChange: (color: string) => void
  onColorModeChange: (mode: 'tint' | 'original') => void
  onSubmit: (e: React.FormEvent) => void
  onDownload: () => void
  onCopy: () => void
}

export function ConverterView({
  image, video, gridSize, color, colorMode, isLoading, error, data, copied,
  canvasRef, inputRef,
  onBack, onImageChange, onVideoChange, onGridSizeChange, onColorChange,
  onColorModeChange, onSubmit, onDownload, onCopy,
}: ConverterViewProps) {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col min-h-screen">

      <div className="flex items-center justify-between w-full border-b-2 border-stone-900 pb-6 mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono font-bold text-stone-600 hover:text-stone-900 transition-colors"
        >
          ← Back to Main Room
        </button>
        <div className="text-xs font-mono font-bold bg-white px-3 py-1 border-2 border-stone-900 rounded-md shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
          Workshop Bench #1
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <ControlForm
          image={image}
          video={video}
          gridSize={gridSize}
          color={color}
          colorMode={colorMode}
          isLoading={isLoading}
          error={error}
          onImageChange={onImageChange}
          onVideoChange={onVideoChange}
          onGridSizeChange={onGridSizeChange}
          onColorChange={onColorChange}
          onColorModeChange={onColorModeChange}
          onSubmit={onSubmit}
          inputRef={inputRef}
        />
        <CanvasOutput
          canvasRef={canvasRef}
          hasData={!!data}
          isLoading={isLoading}
          copied={copied}
          onDownload={onDownload}
          onCopy={onCopy}
        />
      </div>
    </div>
  )
}
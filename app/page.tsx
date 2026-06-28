'use client'
import { useRef, useState, useEffect } from 'react'
import { MosaicMouseTrail } from '@/components/ui/MosaicMouseTrail'
import { LandingView } from '@/components/LandingView'
import { ConverterView } from '@/components/ConverterView'
import { ASCII_LADDER, renderGrid, decodeBase64 } from '@/utils/renderGrid'
import { animateGif } from '@/utils/animateGif'
import { MosaicData } from '@/types/mosaic'

export default function Home() {
  const [view, setView] = useState<'landing' | 'converter'>('landing')
  const [image, setImage] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const [data, setData] = useState<MosaicData | null>(null)
  const [gridSize, setGridSize] = useState('80x60')
  const [color, setColor] = useState('#e11d48')
  const [colorMode, setColorMode] = useState<'tint' | 'original'>('tint')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const inputRef  = useRef<HTMLInputElement  | null>(null)
  const stopGifRef = useRef<(() => void) | null>(null)  // holds GIF stop fn

  // Re-render when color/mode changes
  useEffect(() => {
    if (!data || !canvasRef.current) return

    // Stop any running GIF first
    stopGifRef.current?.()
    stopGifRef.current = null

    if (data.type === 'gif' && data.frames) {
      stopGifRef.current = animateGif(
        data.frames, canvasRef.current,
        data.width, data.height,
        color, colorMode === 'original'
      )
    } else if (data.type === 'image' && data.brightness && data.colors) {
      renderGrid(data.brightness, data.colors, data.width, data.height, canvasRef.current, color, colorMode === 'original')
    }
  }, [color, colorMode, data])

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopGifRef.current?.() }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canvasRef.current) return
    if (!image && !video) return

    // Stop any existing GIF animation
    stopGifRef.current?.()
    stopGifRef.current = null

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('gridSize', gridSize)

      let type = ''
      if (image) {
        // Detect GIF by MIME type
        if (image.type === 'image/gif') {
          formData.append('gif', image)
          type = 'gif'
        } else {
          formData.append('image', image)
          type = 'image'
        }
      } else if (video) {
        formData.append('video', video)
        type = 'video'
      }

      const res = await fetch('/api/convert', { method: 'POST', body: formData })
      if (!res.ok) throw new Error(`Could not process this ${type}.`)

      const result: MosaicData = await res.json()
      setData(result)

      if (result.type === 'gif' && result.frames) {
        stopGifRef.current = animateGif(
          result.frames, canvasRef.current,
          result.width, result.height,
          color, colorMode === 'original'
        )
      } else if (result.type === 'image' && result.brightness && result.colors) {
        renderGrid(result.brightness, result.colors, result.width, result.height, canvasRef.current, color, colorMode === 'original')
      }

      if (inputRef.current) inputRef.current.value = ''
      setImage(null)
      setVideo(null)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went sideways.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    // For GIFs this captures the current frame
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'my-mosaic.png'
    link.click()
  }

  const handleCopy = () => {
    if (!data || data.type !== 'image' || !data.brightness) return
    const brightnessArr = decodeBase64(data.brightness)
    const rows: string[] = []

    for (let y = 0; y < data.height; y++) {
      let row = ''
      for (let x = 0; x < data.width; x++) {
        const raw = brightnessArr[y * data.width + x] / 255
        const gamma = Math.pow(raw, 1.4)
        const idx = gamma < 0.05 ? 0 : Math.floor(Math.max(0, Math.min(1, gamma)) * (ASCII_LADDER.length - 1))
        row += ASCII_LADDER[idx]
      }
      rows.push(row)
    }

    navigator.clipboard.writeText('```\n' + rows.join('\n') + '\n```')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans relative overflow-x-hidden selection:bg-amber-200">
      <MosaicMouseTrail />

      <style>{`
        @keyframes marquee-to-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-flow-right {
          display: flex;
          width: max-content;
          animation: marquee-to-right 20s linear infinite;
        }
        .bg-graph-paper {
          background-size: 24px 24px;
          background-image: radial-gradient(circle, #e5e5e0 1px, transparent 1px);
        }
      `}</style>

      <div className="absolute inset-0 bg-graph-paper pointer-events-none opacity-70" />

      {view === 'landing' && (
        <LandingView onEnter={() => setView('converter')} />
      )}

      {view === 'converter' && (
        <ConverterView
          image={image}
          video={video}
          gridSize={gridSize}
          color={color}
          colorMode={colorMode}
          isLoading={isLoading}
          error={error}
          data={data}
          copied={copied}
          canvasRef={canvasRef}
          inputRef={inputRef}
          onBack={() => setView('landing')}
          onImageChange={setImage}
          onVideoChange={setVideo}
          onGridSizeChange={setGridSize}
          onColorChange={setColor}
          onColorModeChange={setColorMode}
          onSubmit={handleSubmit}
          onDownload={handleDownload}
          onCopy={handleCopy}
        />
      )}
    </div>
  )
}
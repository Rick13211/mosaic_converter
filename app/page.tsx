'use client'
import { ASCII_LADDER, renderGrid } from '@/utils/renderGrid'
import { useRef, useState,useEffect } from "react"

interface MosaicData {
  grid: number[][]
  colors: number[][][]  // [row][col] = [r, g, b] in 0-255
}

export default function Home() {
  // Navigation State
  const [view, setView] = useState<'landing' | 'converter'>('landing')

  // Converter States
  const [image, setImage] = useState<File | null>(null)
  const refImage = useRef<HTMLInputElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [data, setData] = useState<MosaicData | null>(null)
  const [gridSize, setGridSize] = useState("80x60")
  const [color, setColor] = useState("#e11d48") // Cozy Tomato Red
  const [colorMode, setColorMode] = useState<'tint' | 'original'>('tint')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (data && canvasRef.current) {
      renderGrid(
        data.grid,
        canvasRef.current,
        color,
        colorMode === 'original' ? data.colors : undefined
      )
    }
  }, [color, colorMode, data])
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    if (!data) return
    const rows = data.grid.map(row =>
      row.map(b => ASCII_LADDER[Math.floor(b * (ASCII_LADDER.length - 1))]).join('')
    ).join('\n')
    // Wrap in triple backticks so WhatsApp (and Discord/Telegram) renders
    // the text in monospace — keeping all columns perfectly aligned.
    const text = '```\n' + rows + '\n```'
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'my-mosaic.png'
    link.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image || !canvasRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", image)
      formData.append("gridSize", gridSize) 

      const res = await fetch("/api/convert", { method: 'POST', body: formData })
      if (!res.ok) throw new Error("Could not process this image.")

      const result: MosaicData = await res.json()
      renderGrid(
        result.grid,
        canvasRef.current,
        color,
        colorMode === 'original' ? result.colors : undefined
      )
      setData(result)
      if (refImage.current) refImage.current.value = ""
      setImage(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went sideways.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans relative overflow-x-hidden selection:bg-amber-200">
      
      {/* Injecting smooth custom animations & retro grid */}
      <style>{`
        @keyframes marquee-to-right {
          0% { transform: translateX(-50%); }
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

      {/* Grid background backing */}
      <div className="absolute inset-0 bg-graph-paper pointer-events-none opacity-70" />

      {/* --- LANDING VIEW --- */}
      {view === 'landing' && (
        <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-16 px-4">
          
          {/* Indie Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-stone-900 bg-amber-100 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
            <span>✨</span> Built by Humans, Sorted by Pixels
          </div>

          {/* Hero Header */}
          <div className="text-center max-w-2xl my-auto space-y-6">
            <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-tight text-stone-900 leading-none">
              The Great <br />
              <span className="underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-4">Emoji Loom</span>
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-md mx-auto font-medium leading-relaxed">
              A quirky, small-batch utility that deconstructs your ordinary photos and weaves them into colorful terminal-style tapestries.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setView('converter')}
                className="px-8 py-3.5 bg-stone-900 text-[#faf7f2] font-bold rounded-xl border-2 border-stone-900 transition-all shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(245,158,11,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(245,158,11,1)]"
              >
                Open the Workshop →
              </button>
            </div>
          </div>

          {/* LEFT-TO-RIGHT CONVEYOR VISUAL */}
          <div className="w-full max-w-4xl border-2 border-stone-900 rounded-2xl bg-white p-1 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-stone-900 relative bg-[#faf7f2]/40">
              
              {/* Central Processing Crank */}
              <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center z-20">
                <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-stone-900 flex items-center justify-center font-bold text-lg shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] animate-bounce">
                  ⚙️
                </div>
              </div>

              {/* Left Side: Raw Stream moving Left to Right (Entering) */}
              <div className="overflow-hidden p-6 relative bg-white">
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                <div className="mb-3 text-xs font-mono font-bold text-stone-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-stone-400" /> input_pile/
                </div>
                
                <div className="animate-flow-right gap-3 py-1">
                  {[1, 2, 3, 4, 1, 2, 3, 4].map((item, idx) => (
                    <div key={idx} className="w-28 h-20 bg-[#faf7f2] rounded-xl border-2 border-stone-900 flex flex-col items-center justify-center p-2 text-center text-[10px] font-mono font-bold text-stone-600 gap-1">
                      <span className="text-lg">🖼️</span>
                      snap_0{item}.jpg
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Output Stream moving Left to Right (Exiting) */}
              <div className="overflow-hidden p-6 relative bg-amber-50/30">
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#faf7f2]/10 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#faf7f2]/10 to-transparent z-10 pointer-events-none" />
                <div className="mb-3 text-xs font-mono font-bold text-emerald-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> stitched_output/
                </div>

                <div className="animate-flow-right gap-3 py-1">
                  {[1, 2, 3, 4, 1, 2, 3, 4].map((item, idx) => (
                    <div key={idx} className="w-28 h-20 bg-white rounded-xl border-2 border-stone-900 flex flex-col items-center justify-center p-2 text-center text-[10px] font-mono font-bold text-emerald-800 gap-1 shadow-[2px_2px_0px_0px_rgba(28,25,23,0.08)]">
                      <span className="text-base">🧸 🌸 🥨</span>
                      mosaic_0{item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}


      {/* --- CONVERTER WORKSPACE VIEW --- */}
      {view === 'converter' && (
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col min-h-screen">
          
          {/* Retro Navigation */}
          <div className="flex items-center justify-between w-full border-b-2 border-stone-900 pb-6 mb-12">
            <button 
              onClick={() => setView('landing')}
              className="flex items-center gap-2 text-xs font-mono font-bold text-stone-600 hover:text-stone-900 transition-colors group"
            >
              ← Back to Main Room
            </button>
            <div className="text-xs font-mono font-bold bg-white px-3 py-1 border-2 border-stone-900 rounded-md shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
              Workshop Bench #1
            </div>
          </div>

          {/* Controls Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Control Form (5 Columns) */}
            <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-6 bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
              <div>
                <h2 className="text-xl font-serif font-black text-stone-900">Tweak Options</h2>
                <p className="text-xs text-stone-500 font-medium">Configure the machinery parameters below.</p>
              </div>

              <hr className="border-stone-200" />

              {/* Custom Cozy Upload Box */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase text-stone-600">Choose Source Picture</label>
                <div className="relative group border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl transition-colors p-6 bg-[#faf7f2]/50 text-center cursor-pointer">
                  <input
                    ref={refImage}
                    type="file"
                    accept="image/*"
                    disabled={isLoading}
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="space-y-1 pointer-events-none">
                    <p className="text-sm font-bold text-stone-700">
                      {image ? `📎 ${image.name}` : "Click to look up an image"}
                    </p>
                    <p className="text-xs text-stone-400 font-medium">Standard grid sizes work best</p>
                  </div>
                </div>
              </div>

              {/* Grid Selector */}
              <div className="space-y-2">
                <label htmlFor="gridSize" className="block text-xs font-mono font-bold uppercase text-stone-600">
                  Density Setting
                </label>
                <div className="relative">
                  <select
                    id="gridSize"
                    className="block w-full appearance-none rounded-xl border-2 border-stone-900 bg-white px-4 py-3 text-sm font-medium text-stone-800 outline-none transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] focus:bg-amber-50/20 cursor-pointer"
                    value={gridSize}
                    onChange={(e) => setGridSize(e.target.value)}
                  >
                    <option value="80x60">80 x 60 (Loose Canvas)</option>
                    <option value="120x90">120 x 90 (Balanced Weave)</option>
                    <option value="160x120">160 x 120 (Tight Stitch)</option>
                    <option value="160x90">160 x 90 (Widescreen Loom)</option>
                    <option value="240x135">240 x 135 (High-Def Matrix)</option>
                    <option value="320x180">320 x 180 (Terminal Overkill)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-800">
                    ▼
                  </div>
                </div>
              </div>

              {/* Color Mode Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase text-stone-600">Color Mode</label>
                <div className="flex rounded-xl border-2 border-stone-900 overflow-hidden shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                  <button
                    type="button"
                    onClick={() => setColorMode('tint')}
                    className={`flex-1 py-2.5 text-xs font-mono font-bold transition-colors ${
                      colorMode === 'tint'
                        ? 'bg-stone-900 text-white'
                        : 'bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    🎨 Tint
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode('original')}
                    className={`flex-1 py-2.5 text-xs font-mono font-bold border-l-2 border-stone-900 transition-colors ${
                      colorMode === 'original'
                        ? 'bg-stone-900 text-white'
                        : 'bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    🖼️ Original Colors
                  </button>
                </div>
              </div>

              {/* Tint controls — hidden in original color mode */}
              {colorMode === 'tint' && (
                <div className="space-y-3">
                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-600">Base Filter Tint</label>
                    <div className="flex items-center gap-4 border-2 border-stone-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]" style={{ backgroundColor: color + '22' }}>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-8 rounded cursor-pointer border-2 border-stone-900 bg-transparent"
                      />
                      <div className="text-xs font-mono font-bold text-stone-600 uppercase select-all">{color}</div>
                    </div>
                  </div>

                  {/* Preset Swatches */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold uppercase text-stone-500">Quick Presets</label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { label: 'Terminal', hex: '#00ff41' },
                        { label: 'Amber',    hex: '#ffb000' },
                        { label: 'Cyan',     hex: '#00f5ff' },
                        { label: 'Rose',     hex: '#e11d48' },
                        { label: 'Violet',   hex: '#8b5cf6' },
                        { label: 'Snow',     hex: '#f8fafc' },
                      ].map(({ label, hex }) => (
                        <button
                          key={hex}
                          type="button"
                          title={label}
                          onClick={() => setColor(hex)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 text-[10px] font-mono font-bold transition-all ${
                            color === hex
                              ? 'border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] -translate-x-px -translate-y-px'
                              : 'border-stone-300 hover:border-stone-900'
                          }`}
                          style={{ backgroundColor: hex + '33', color: '#1c1917' }}
                        >
                          <span className="w-3 h-3 rounded-full border border-stone-900/30 inline-block" style={{ backgroundColor: hex }} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Neo-brutalist Submit Button */}
              <button
                type="submit"
                disabled={!image || isLoading}
                className="w-full px-4 py-3 bg-stone-900 text-white font-bold rounded-xl border-2 border-stone-900 transition-all shadow-[3px_3px_0px_0px_rgba(225,29,72,1)] disabled:bg-stone-100 disabled:text-stone-400 disabled:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(225,29,72,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(225,29,72,1)]"
              >
                {isLoading ? "Weaving Grid Arrays..." : "Run the Loom!"}
              </button>

              {error && (
                <div className="p-3 bg-rose-50 border-2 border-rose-900 rounded-xl text-rose-900 text-xs font-mono font-bold">
                   {error}
                </div>
              )}
              {image && <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-auto rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]" />}

            </form>

            {/* Canvas Output Display Box (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white border-2 border-stone-900 rounded-2xl p-6 min-h-[420px] text-center relative shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
              
              {!data && !isLoading && (
                <div className="space-y-2 max-w-xs p-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#faf7f2] border-2 border-stone-900 flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                    🌾
                  </div>
                  <h3 className="text-base font-serif font-black text-stone-800">Easel Empty</h3>
                  <p className="text-xs text-stone-500 font-medium">Feed an image block to the compiler on the left to paint your terminal matrix here.</p>
                </div>
              )}

              {isLoading && (
                <div className="space-y-2">
                  <div className="text-3xl animate-spin inline-block [animation-duration:3s]">🎨</div>
                  <div className="text-xs font-mono font-bold text-stone-500 tracking-wider">SORTING FIBERS...</div>
                </div>
              )}

              <canvas
                ref={canvasRef}
                className={`max-w-full rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all duration-300 ${!data || isLoading ? 'hidden' : 'block'}`}
              />

              {data && !isLoading && (
                <div className="w-full flex justify-end mt-5">
                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-amber-400 text-stone-950 text-xs font-mono font-bold rounded-xl border-2 border-stone-900 transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)]"
                  >
                    💾 Save Tapestry (.png)
                  </button>
                  <button 
                  className={`px-5 py-2.5 text-stone-950 text-xs font-mono font-bold rounded-xl border-2 border-stone-900 transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] ${copied ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  onClick={handleCopy}>
                    {copied ? '✓ Copied!' : '📋 Copy as Text'}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
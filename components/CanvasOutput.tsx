'use client'

interface CanvasOutputProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  hasData: boolean
  isLoading: boolean
  copied: boolean
  onDownload: () => void
  onCopy: () => void
}

export function CanvasOutput({
  canvasRef, hasData, isLoading, copied, onDownload, onCopy,
}: CanvasOutputProps) {
  return (
    <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white border-2 border-stone-900 rounded-2xl p-6 min-h-[420px] text-center relative shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">

      {/* Empty state */}
      {!hasData && !isLoading && (
        <div className="space-y-2 max-w-xs p-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#faf7f2] border-2 border-stone-900 flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
            🌾
          </div>
          <h3 className="text-base font-serif font-black text-stone-800">Easel Empty</h3>
          <p className="text-xs text-stone-500 font-medium">
            Feed an image to the compiler on the left to paint your terminal matrix here.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-2">
          <div className="text-3xl animate-spin inline-block [animation-duration:3s]">🎨</div>
          <div className="text-xs font-mono font-bold text-stone-500 tracking-wider">SORTING FIBERS...</div>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={`max-w-full rounded-xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all duration-300 ${!hasData || isLoading ? 'hidden' : 'block'
          }`}
      />

      {/* Action buttons */}
      {hasData && !isLoading && (
        <div className="w-full flex justify-end gap-2 mt-5">
          <button
            onClick={onDownload}
            className="px-5 py-2.5 bg-amber-400 text-stone-950 text-xs font-mono font-bold rounded-xl border-2 border-stone-900 transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)]"
          >
            💾 Save Tapestry (.png)
          </button>
          
          <button
            onClick={onCopy}
            className={`px-5 py-2.5 text-stone-950 text-xs font-mono font-bold rounded-xl border-2 border-stone-900 transition-all shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(28,25,23,1)] ${copied ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy as Text'}
          </button>
        </div>
      )}
    </div>
  )
}

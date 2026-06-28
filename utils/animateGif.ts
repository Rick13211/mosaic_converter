import { GifFrame } from '@/types/mosaic'
import { decodeBase64, drawFrame } from '@/utils/renderGrid'

export function animateGif(
  frames: GifFrame[],
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  hexColor: string,
  useOriginalColors: boolean
): () => void {  // returns a stop function
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  canvas.width  = width  * 8
  canvas.height = height * 16

  // Decode all frames upfront so animation is smooth
  const decoded = frames.map(f => ({
    brightness: decodeBase64(f.brightness),
    colors: decodeBase64(f.colors),
    delay: Math.max(f.delay, 16),  // min 50ms so it doesn't flash
  }))

  let currentFrame = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let stopped = false

  function drawNext() {
    if (stopped) return

    const frame = decoded[currentFrame]
    drawFrame(ctx!, frame.brightness, useOriginalColors ? frame.colors : null, width, height, hexColor, useOriginalColors)
    currentFrame = (currentFrame + 1) % decoded.length

    timeoutId = setTimeout(() => {
      requestAnimationFrame(drawNext)
    }, frame.delay)
  }

  requestAnimationFrame(drawNext)

  // Return stop function so caller can clean up
  return () => {
    stopped = true
    if (timeoutId) clearTimeout(timeoutId)
  }
}
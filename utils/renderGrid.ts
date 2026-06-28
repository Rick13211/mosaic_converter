'use client'

export const ASCII_LADDER = [
  "@", "█", "▓", "▒", "░", "$", "B", "8", "&", "W",
  "M", "#", "0", "Q", "N", "m", "w", "g", "q", "p",
  "d", "b", "k", "h", "a", "Z", "G", "O", "D", "R",
  "H", "X", "E", "F", "K", "P", "U", "A", "S", "V",
  "e", "o", "x", "n", "u", "z", "f", "y", "C", "L",
  "J", "T", "1", "7", "s", "c", "v", "r", "j", "t",
  "i", "!", "l", "I", "+", "-", "=", ";", ":", ",",
  "^", "~", '"', "'", "`", ".", " "
]

export function decodeBase64(b64: string): Uint8Array {
  const binStr = atob(b64)
  const bytes = new Uint8Array(binStr.length)
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i)
  return bytes
}

function getDarkBackground(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  return `rgb(${Math.round(r * 0.05)}, ${Math.round(g * 0.05)}, ${Math.round(b * 0.05)})`
}

function getShade(hexColor: string, brightness: number): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const factor = Math.pow(brightness, 1.1)
  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`
}

// Core draw function — used by both renderGrid and GIF animation
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  brightnessArr: Uint8Array,
  colorsArr: Uint8Array | null,
  width: number,
  height: number,
  hexColor: string,
  useOriginalColors: boolean
) {
  const CHAR_WIDTH  = 8
  const CHAR_HEIGHT = 16

  ctx.fillStyle = useOriginalColors ? 'rgb(5,5,5)' : getDarkBackground(hexColor)
  ctx.fillRect(0, 0, width * CHAR_WIDTH, height * CHAR_HEIGHT)

  ctx.font = `bold ${CHAR_HEIGHT}px "Menlo","Consolas",monospace`
  ctx.textBaseline = "top"

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const raw = brightnessArr[idx] / 255.0
      const gamma = Math.pow(raw, 1.4)
      if (gamma < 0.05) continue

      const charIdx = Math.floor(Math.max(0, Math.min(1, gamma)) * (ASCII_LADDER.length - 1))
      const char = ASCII_LADDER[charIdx]

      if (useOriginalColors && colorsArr) {
        ctx.fillStyle = `rgb(${colorsArr[idx*3]},${colorsArr[idx*3+1]},${colorsArr[idx*3+2]})`
      } else {
        ctx.fillStyle = getShade(hexColor, gamma)
      }

      ctx.fillText(char, x * CHAR_WIDTH, y * CHAR_HEIGHT)
    }
  }
}

// Single image render
export function renderGrid(
  brightnessB64: string,
  colorsB64: string,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  hexColor: string,
  useOriginalColors: boolean
) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width  = width  * 8
  canvas.height = height * 16

  drawFrame(
    ctx,
    decodeBase64(brightnessB64),
    useOriginalColors ? decodeBase64(colorsB64) : null,
    width, height, hexColor, useOriginalColors
  )
}
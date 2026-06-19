'use client'

// Sorted from emptiest/darkest to densest/brightest for light-on-dark rendering
 export const ASCII_LADDER = [
  " ", ".", "`", "'", '"', "~", "^", ",", ":", ";", 
  "=", "-", "+", "I", "l", "!", "i", "t", "j", "r", 
  "v", "c", "s", "7", "1", "T", "J", "L", "C", "y", 
  "f", "z", "u", "n", "x", "o", "e", "V", "S", "A", 
  "U", "P", "K", "F", "E", "X", "H", "R", "D", "O", 
  "G", "Z", "a", "h", "k", "b", "d", "p", "q", "g", 
  "w", "m", "N", "Q", "0", "#", "M", "W", "&", "8", 
  "B", "$", "░", "▒", "▓", "█", "@"
]

function getDarkBackground(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  // Dropping background down to a clean 5% depth to maximize character contrast
  return `rgb(${Math.round(r * 0.05)}, ${Math.round(g * 0.05)}, ${Math.round(b * 0.05)})`
}

function getShade(hexColor: string, brightness: number): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Exponential scaling makes mid-tones cleaner and highlights significantly punchier
  const factor = Math.pow(brightness, 1.1)

  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`
}

export function renderGrid(
  grid: number[][],
  canvas: HTMLCanvasElement,
  hexColor: string,
  // When provided, each character uses the real pixel RGB instead of a single tint
  colors?: number[][][]
) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const CELL_SIZE = 10

  canvas.width  = grid[0].length * CELL_SIZE
  canvas.height = grid.length    * CELL_SIZE

  // In original-color mode there is no single tint to derive a background from,
  // so we fall back to a near-black that keeps all hues readable.
  ctx.fillStyle = colors ? 'rgb(5, 5, 5)' : getDarkBackground(hexColor)
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = `bold ${CELL_SIZE}px monospace`
  ctx.textBaseline = "top"

  grid.forEach((row, y) => {
    row.forEach((brightness, x) => {
      // Gracefully ignore absolute dead space to save draw cycles
      if (brightness < 0.02) return

      // Map higher brightness to denser characters
      const idx = Math.floor(brightness * (ASCII_LADDER.length - 1))
      const char = ASCII_LADDER[idx]

      if (colors) {
        // Original color mode: use real pixel RGB, scaled by brightness so
        // darker areas of the image stay dark (same exponential curve as tint mode)
        const [r, g, b] = colors[y][x]
        const factor = Math.pow(brightness, 1.1)
        ctx.fillStyle = `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`
      } else {
        ctx.fillStyle = getShade(hexColor, brightness)
      }

      ctx.fillText(char, x * CELL_SIZE, y * CELL_SIZE)
    })
  })
}
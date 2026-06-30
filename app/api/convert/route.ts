import {NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import Replicate from "replicate"

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

function extractBrightnessAndColors(
  data: Buffer,
  channels: number,
  cols: number,
  rows: number
): { brightnessArr: Uint8Array; colorsArr: Uint8Array } {
  const brightnessArr = new Uint8Array(cols * rows)
  const colorsArr = new Uint8Array(cols * rows * 3)

  for (let i = 0; i < cols * rows; i++) {
    const idx = i * channels
    let r = data[idx]
    let g = channels >= 3 ? data[idx + 1] : r
    let b = channels >= 3 ? data[idx + 2] : r

    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b
    brightnessArr[i] = Math.min(255, Math.max(0, Math.round(brightness)))
    colorsArr[i * 3]     = r
    colorsArr[i * 3 + 1] = g
    colorsArr[i * 3 + 2] = b
  }

  return { brightnessArr, colorsArr }
}

async function processImageBuffer(
  buffer: Buffer,
  cols: number,
  rows: number
): Promise<{ brightness: string; colors: string }> {
  const { data, info } = await sharp(buffer)
    .normalize()
    .linear(1.2, -10.2)
    .sharpen({ sigma: 1.5, m1: 0.5, m2: 2.0 })
    .resize(cols, rows, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { brightnessArr, colorsArr } = extractBrightnessAndColors(
    data, info.channels, cols, rows
  )

  return {
    brightness: Buffer.from(brightnessArr).toString('base64'),
    colors: Buffer.from(colorsArr).toString('base64'),
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const gridSize = formData.get('gridSize') as string
    const [rawCols, rawRows] = (gridSize ?? '80x60').split('x').map(Number)
    const cols = Number.isFinite(rawCols) && rawCols > 0 ? rawCols : 80
    const rows = Number.isFinite(rawRows) && rawRows > 0 ? rawRows : 60

    const imageFile = formData.get('image') as File | null
    const videoFile = formData.get('video') as File | null
    const gifFile   = formData.get('gif')   as File | null

    // ── IMAGE ──────────────────────────────────────────────
    if (imageFile) {
      const MAX_SIZE = 10 * 1024 * 1024
      if (!imageFile.type.startsWith('image/'))
        return NextResponse.json({ error: "File must be an image" }, { status: 400 })
      if (imageFile.size > MAX_SIZE)
        return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })

      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const { brightness, colors } = await processImageBuffer(buffer, cols, rows)

      return NextResponse.json({ type: 'image', brightness, colors, width: cols, height: rows })
    }

    // ── GIF ────────────────────────────────────────────────
    if (gifFile) {
      if (gifFile.type !== 'image/gif')
        return NextResponse.json({ error: "File must be a GIF" }, { status: 400 })
      if (gifFile.size > 20 * 1024 * 1024)
        return NextResponse.json({ error: "GIF too large (max 20MB)" }, { status: 400 })

      const buffer = Buffer.from(await gifFile.arrayBuffer())

      // Handle both CJS default and named export
    // @ts-ignore
    const gifFrames = (await import('gif-frames')).default

      const frameData = await gifFrames({
        url: buffer,
        frames: 'all',
        outputType: 'png',
        cumulative: true,
      })
      const MAX_FRAMES = 120
      const framesToProcess = frameData.slice(0, MAX_FRAMES)
      const frames = await Promise.all(
        framesToProcess.map(async (frame: any) => {
          // Use stream events instead of for-await
          const frameBuf = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = []
            const stream = frame.getImage()
            stream.on('data', (chunk: Buffer) => chunks.push(chunk))
            stream.on('end', () => resolve(Buffer.concat(chunks)))
            stream.on('error', reject)
          })

          const { brightness, colors } = await processImageBuffer(frameBuf, cols, rows)
          const delay = Math.max(16, (frame.frameInfo?.delay || 4) * 10)

          return { brightness, colors, delay }
        })
      )

      return NextResponse.json({ type: 'gif', frames, width: cols, height: rows })
    }

    return NextResponse.json({ error: "No file provided" }, { status: 400 })

  } catch (err) {
    console.error('Full error:', err)
    return NextResponse.json({
      error: err instanceof Error ? err.message : "Internal processing failure"
    }, { status: 500 })
  }
}
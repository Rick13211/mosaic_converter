import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('image') as File
        const gridSize = formData.get('gridSize') as string
        const [rawCols, rawRows] = (gridSize ?? '80x60').split('x').map(Number)
        const cols = Number.isFinite(rawCols) && rawCols > 0 ? rawCols : 80
        const rows = Number.isFinite(rawRows) && rawRows > 0 ? rawRows : 60

        if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 })
        const MAX_SIZE = 10 * 1024 * 1024  // 10MB
        if (!file.type.startsWith('image/'))
            return NextResponse.json({ error: "File must be an image" }, { status: 400 })
        if (file.size > MAX_SIZE)
            return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })

        const buffer = Buffer.from(await file.arrayBuffer())
        
        // Extract both data and info to know exactly how many channels we get back
        const { data, info } = await sharp(buffer)
            .normalize()
            .sharpen({ sigma: 1.5, m1: 0.5, m2: 2.0 })
            .resize(cols, rows, { fit: 'cover', kernel: sharp.kernel.lanczos3 })
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })

        const grid: number[][] = []
        const colors: number[][][] = []
        const channels = info.channels // 1 for Grayscale, 3 for RGB

        for (let row = 0; row < rows; row++) {
            const rowBrightness: number[] = []
            const rowColors: number[][] = []
            for (let col = 0; col < cols; col++) {
                // Multiply by dynamic channel count instead of hardcoded 3
                const idx = (row * cols + col) * channels
                
                // Default all to the first byte (perfect for grayscale)
                let r = data[idx]
                let g = r
                let b = r

                // Override green and blue if it's an RGB image
                if (channels >= 3) {
                    g = data[idx + 1]
                    b = data[idx + 2]
                }

                // Standard precise Rec. 709 luminance weights
                const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
                rowBrightness.push(brightness)
                // Store raw RGB (0-255 integers) for original-color mode
                rowColors.push([r, g, b])
            }
            grid.push(rowBrightness)
            colors.push(rowColors)
        }

        return NextResponse.json({ grid, colors })
    } catch (err) {
        return NextResponse.json({ error: "Internal processing failure" }, { status: 500 })
    }
}
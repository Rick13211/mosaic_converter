export interface GifFrame {
  brightness: string  // base64
  colors: string      // base64
  delay: number       // ms
}

export interface MosaicData {
  // image mode
  brightness?: string
  colors?: string
  // gif mode
  frames?: GifFrame[]
  // shared
  width: number
  height: number
  type: 'image' | 'gif'
}
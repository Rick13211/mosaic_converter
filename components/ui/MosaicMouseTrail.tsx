'use client'

import React, { useEffect, useRef } from 'react'

const CHARS = ["░", "▒", "▓", "█", "@", "#", "&", "8", "B", "$", "🌸", "🧵", "🧶"]

export const MosaicMouseTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<{
    x: number, 
    y: number, 
    char: string, 
    hue: number, 
    life: number, 
    size: number,
    velocity: { x: number, y: number }
  }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMouseMove = (e: MouseEvent) => {
      // Add a small burst of particles on move
      for(let i = 0; i < 3; i++) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          hue: Math.random() < 0.2 ? 10 : 40, // Mostly Amber, some Rose
          life: 1.0,
          size: Math.random() * 12 + 8,
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
          }
        })
      }
      
      // Limit total particles for performance
      if (particles.current.length > 150) {
        particles.current.shift()
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.current = particles.current.filter(p => {
        p.life -= 0.012
        if (p.life <= 0) return false
        
        p.x += p.velocity.x
        p.y += p.velocity.y
        p.velocity.y += 0.02 // Subtle gravity

        const alpha = p.life
        ctx.fillStyle = `hsla(${p.hue}, 80%, 50%, ${alpha})`
        ctx.font = `bold ${p.size * (0.5 + p.life * 0.5)}px monospace`
        
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.life * 2) // Slow spin
        ctx.fillText(p.char, 0, 0)
        ctx.restore()
        
        return true
      })

      requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60] select-none touch-none"
      style={{ filter: 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.2))' }}
    />
  )
}

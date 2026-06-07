'use client'


const renderGrid = (grid:string[][], canvas:HTMLCanvasElement)=>{
    if (!canvas)return
    const ctx = canvas.getContext('2d')
    const cell_size = 12
    const width = grid[0].length * cell_size
    const height = grid.length * cell_size
    
    ctx!.font = `${cell_size}px serif`
    ctx!.textBaseline = "top"

    grid.forEach((row,y)=>{
        row.forEach((emoji,x)=>{
            ctx!.fillText(emoji,x*cell_size,y*cell_size)
        })
    })
}

export default renderGrid
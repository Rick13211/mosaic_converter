import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const GRID_COLS = 80
const GRID_ROWS = 60

const EMOJI_PALETTE = [
  // Reds & Pinks
  { emoji: "🔴", r: 220, g: 50,  b: 50  },
  { emoji: "❤️", r: 200, g: 20,  b: 40  },
  { emoji: "🍎", r: 180, g: 30,  b: 40  },
  { emoji: "🌸", r: 255, g: 180, b: 200 },
  { emoji: "🐷", r: 255, g: 150, b: 180 },
  { emoji: "🧠", r: 250, g: 130, b: 160 },

  // Oranges & Browns
  { emoji: "🟠", r: 255, g: 140, b: 0   },
  { emoji: "🟧", r: 255, g: 130, b: 20  },
  { emoji: "🦊", r: 230, g: 100, b: 30  },
  { emoji: "🟤", r: 150, g: 90,  b: 50  },
  { emoji: "🟫", r: 130, g: 70,  b: 40  },
  { emoji: "🐻", r: 140, g: 80,  b: 50  },
  { emoji: "💩", r: 110, g: 60,  b: 30  },
  { emoji: "🍞", r: 230, g: 180, b: 100 },
  { emoji: "🥔", r: 190, g: 140, b: 80  },

  // Yellows
  { emoji: "🟡", r: 255, g: 220, b: 50  },
  { emoji: "🟨", r: 255, g: 220, b: 30  },
  { emoji: "🌻", r: 255, g: 200, b: 20  },
  { emoji: "🍌", r: 255, g: 230, b: 80  },
  { emoji: "🐤", r: 255, g: 240, b: 60  },
  { emoji: "☀️", r: 255, g: 200, b: 0   },
  { emoji: "🌙", r: 200, g: 180, b: 80  },

  // Greens
  { emoji: "🟢", r: 50,  g: 180, b: 50  },
  { emoji: "🟩", r: 60,  g: 180, b: 60  },
  { emoji: "🐸", r: 90,  g: 190, b: 70  },
  { emoji: "🐢", r: 70,  g: 150, b: 60  },
  { emoji: "🌿", r: 60,  g: 140, b: 60  },
  { emoji: "🌲", r: 40,  g: 100, b: 40  },
  { emoji: "🍏", r: 140, g: 210, b: 50  },
  { emoji: "🥑", r: 80,  g: 130, b: 40  },

  // Blues & Cyans
  { emoji: "🔵", r: 50,  g: 100, b: 220 },
  { emoji: "🟦", r: 40,  g: 110, b: 220 },
  { emoji: "💧", r: 100, g: 180, b: 240 },
  { emoji: "🦋", r: 80,  g: 160, b: 230 },
  { emoji: "🌊", r: 30,  g: 120, b: 200 },
  { emoji: "🐳", r: 50,  g: 120, b: 180 },
  { emoji: "❄️", r: 180, g: 220, b: 255 },
  { emoji: "🌌", r: 20,  g: 30,  b: 60  },

  // Purples
  { emoji: "🟣", r: 150, g: 50,  b: 200 },
  { emoji: "🟪", r: 140, g: 60,  b: 200 },
  { emoji: "🍇", r: 110, g: 40,  b: 140 },
  { emoji: "🍆", r: 80,  g: 30,  b: 100 },
  { emoji: "👾", r: 120, g: 50,  b: 180 },

  // Grays, Blacks, Whites
  { emoji: "⚪", r: 220, g: 220, b: 220 },
  { emoji: "⬜", r: 240, g: 240, b: 240 },
  { emoji: "☁️", r: 230, g: 230, b: 230 },
  { emoji: "🐁", r: 200, g: 200, b: 200 },
  { emoji: "🐘", r: 150, g: 150, b: 150 },
  { emoji: "🐺", r: 120, g: 120, b: 120 },
  { emoji: "🦍", r: 80,  g: 80,  b: 80  },
  { emoji: "⚫", r: 30,  g: 30,  b: 30  },
  { emoji: "⬛", r: 20,  g: 20,  b: 20  },

  // Skin Tones (Crucial for faces)
  { emoji: "👍🏻", r: 255, g: 220, b: 200 },
  { emoji: "👍🏼", r: 240, g: 200, b: 160 },
  { emoji: "👍🏽", r: 200, g: 150, b: 110 },
  { emoji: "👍🏾", r: 140, g: 90,  b: 60  },
  { emoji: "👍🏿", r: 80,  g: 50,  b: 40  },
];
function findClosestEmoji(r: number, g: number, b: number) {
    let closest = EMOJI_PALETTE[0];
    let minDist = Infinity;

    for (const entry of EMOJI_PALETTE) {
        const rMean = (r + entry.r) / 2;
        const dR = r - entry.r;
        const dG = g - entry.g;
        const dB = b - entry.b;

        const dist = Math.sqrt(
            (2 + rMean / 256) * Math.pow(dR, 2) +
            4 * Math.pow(dG, 2) +
            (2 + (255 - rMean) / 256) * Math.pow(dB, 2)
        );

        if (dist < minDist) {
            minDist = dist;
            closest = entry;
        }
    }
    return closest.emoji;
}
export async function POST(req:NextRequest){
    const formData = await req.formData()
    const file = formData.get('image') as File
    if(!file) return NextResponse.json({error:"No image provided"},{status:400})

    const buffer =  Buffer.from(await file.arrayBuffer())
    const {data} = await sharp(buffer)
    .resize(GRID_COLS,GRID_ROWS,{fit:'cover'}).removeAlpha()
    .raw()
    .toBuffer({resolveWithObject:true})

    const grid :string[][] = []

    for(let row = 0; row<GRID_ROWS;row++){
        const rowEmojis:string[] = []
        for(let col = 0; col<GRID_COLS; col++){
            const idx = (row*GRID_COLS+col)*3
            const r = data[idx]
            const g = data[idx+1]
            const b = data[idx+2]
            rowEmojis.push(findClosestEmoji(r,g,b))
        }
        grid.push(rowEmojis)
    }
    return NextResponse.json({grid})
}
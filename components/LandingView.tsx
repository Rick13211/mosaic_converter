'use client'
import { motion } from 'framer-motion'
import { SquigglyText } from '@/components/ui/squiggly-text'
import AnimatedUnderline from '@/utils/AnimatedUnerline'

interface LandingViewProps {
  onEnter: () => void
}

const INPUT_ITEMS  = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2]
const OUTPUT_ITEMS = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2]

function ProcessingNode() {
  return (
    <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center z-20">
      <div className="relative flex items-center justify-center">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 1, ease: 'easeOut' }}
            className="absolute w-10 h-10 rounded-full border-2 border-amber-400/50"
          />
        ))}
        <motion.div
          animate={{ rotate: [45, 225] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          whileHover={{ scale: 1.2, background: '#fbbf24', transition: { duration: 0.2 } }}
          className="w-9 h-9 bg-amber-500 border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] flex items-center justify-center z-10 cursor-help"
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-1.5 h-1.5 bg-stone-900 rounded-full"
          />
        </motion.div>
      </div>
    </div>
  )
}

function InputThumbnail({ item, idx }: { item: number; idx: number }) {
  const isVideo = idx % 3 === 0
  return (
    <motion.div
      key={idx}
      whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 4 : -4, y: -2 }}
      className="w-28 h-20 shrink-0 rounded-xl border-2 border-stone-900 overflow-hidden relative cursor-pointer shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)]"
    >
      <img
        src={`https://placehold.co/400x300/e2e8f0/1e293b?text=${isVideo ? 'Video' : 'Photo'}+${item}`}
        alt="Input placeholder"
        className="w-full h-full object-cover"
      />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pb-2">
          <div className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center border-2 border-stone-900 pl-0.5 text-[8px]">
            ▶
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t-2 border-stone-900 px-1 py-[2px] text-[8px] font-mono font-bold text-stone-700 text-center tracking-tight">
        raw_src_{item}.{isVideo ? 'mp4' : 'jpg'}
      </div>
    </motion.div>
  )
}

function OutputThumbnail({ item, idx }: { item: number; idx: number }) {
  const isVideo = idx % 3 === 0
  return (
    <motion.div
      key={idx}
      whileHover={{ scale: 1.1, y: -4 }}
      className="w-28 shrink-0 h-20 rounded-xl border-2 border-stone-900 overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(28,25,23,0.08)] cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,0.15)] transition-all"
    >
      <img
        src={`https://placehold.co/400x300/fef3c7/b45309?text=Mosaic+${item}`}
        alt="Output placeholder"
        className="w-full h-full object-cover"
      />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pb-2">
          <div className="w-5 h-5 bg-amber-300 rounded-full flex items-center justify-center border-2 border-stone-900 pl-0.5 text-[8px] text-stone-900">
            ▶
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-amber-100 border-t-2 border-stone-900 px-1 py-[2px] text-[8px] font-mono font-bold text-emerald-800 text-center tracking-tight">
        mosaic_{item}.{isVideo ? 'mp4' : 'png'}
      </div>
    </motion.div>
  )
}

export function LandingView({ onEnter }: LandingViewProps) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-16 px-4">

      {/* Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-stone-900 bg-amber-100 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
        <span>✨</span> Built by Humans, Sorted by Pixels
      </div>

      {/* Hero */}
      <div className="text-center max-w-2xl my-auto space-y-6">
        <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-tight text-stone-900 leading-none">
          The Great <br />
          <AnimatedUnderline text="Emoji Loom" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="text-base sm:text-lg text-stone-600 max-w-lg mx-auto font-medium leading-relaxed"
        >
          A
          <SquigglyText stepDuration={120} scale={2} className="text-amber-600 font-bold mx-1 inline-block">
            quirky
          </SquigglyText>
          , small-batch utility that deconstructs your ordinary photos and weaves them into
          <span className="inline-block bg-stone-100 text-stone-800 px-2 py-0 rounded border border-stone-200/60 font-mono text-[0.9em] mx-1 shadow-sm">
            terminal-style tapestries
          </span>.
        </motion.p>

        <div className="pt-2">
          <button
            onClick={onEnter}
            className="px-8 py-3.5 bg-stone-900 text-[#faf7f2] font-bold rounded-xl border-2 border-stone-900 transition-all shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(245,158,11,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(245,158,11,1)]"
          >
            Open the Workshop →
          </button>
        </div>
      </div>

      {/* Conveyor Belt */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-4xl border-2 border-stone-900 rounded-2xl bg-white p-1 relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y-2 md:divide-y-0 md:divide-x-2 divide-stone-900 relative bg-[#faf7f2]/40">
          <ProcessingNode />

          {/* Input stream */}
          <div className="overflow-hidden p-6 relative bg-white">
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div className="mb-3 text-xs font-mono font-bold text-stone-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-pulse" /> input_pile/
            </div>
            <div className="flex animate-flow-right gap-3 py-1 w-max">
              {INPUT_ITEMS.map((item, idx) => (
                <InputThumbnail key={idx} item={item} idx={idx} />
              ))}
            </div>
          </div>

          {/* Output stream */}
          <div className="overflow-hidden p-6 relative bg-amber-50/30">
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#faf7f2]/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#faf7f2]/90 to-transparent z-10 pointer-events-none" />
            <div className="mb-3 text-xs font-mono font-bold text-emerald-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> stitched_output/
            </div>
            <div className="flex animate-flow-right gap-3 py-1 w-max">
              {OUTPUT_ITEMS.map((item, idx) => (
                <OutputThumbnail key={idx} item={item} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

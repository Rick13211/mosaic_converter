import { motion } from "framer-motion"

const AnimatedUnderline = ({ text }: { text: string }) => {
  const containerVariants = {
    initial: {},
    hover: {}
  };

  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    hover: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.span 
      className="relative inline-block cursor-pointer group"
      initial="initial"
      whileHover="hover"
      variants={containerVariants}
    >
      <span className="relative z-10">{text}</span>

      <span className="absolute -bottom-1 left-0 h-[10px] w-full pointer-events-none">
        {/* Updated SVG with a more frequent "wavy" path */}
        <svg 
          viewBox="0 0 100 10" 
          preserveAspectRatio="none" 
          className="w-full h-full overflow-visible"
        >
          <motion.path 
            // This path has 5 full wave cycles (more wavy)
            d="M0 5 Q 5 0, 10 5 T 20 5 T 30 5 T 40 5 T 50 5 T 60 5 T 70 5 T 80 5 T 90 5 T 100 5" 
            fill="none" 
            stroke="#fbbf24" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            variants={pathVariants}
          />
        </svg>
      </span>
    </motion.span>
  );
};

export default AnimatedUnderline;

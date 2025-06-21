import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const triangleCount = 7;  // how many triangles to show
const colors = ['#ff0000', '#cc0000', '#ff3333']; // shades of red

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Single Triangle shape as SVG wrapped in motion.div
function Triangle({ style, delay }) {
  const controls = useAnimation();

  useEffect(() => {
    async function sequence() {
      // Shoot in from below
      await controls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, delay, ease: 'easeOut' },
      });
      // Float gently up and down forever
      controls.start({
        y: [0, -10, 0],
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 4 + Math.random() * 2,
          ease: 'easeInOut',
        },
      });
    }
    sequence();
  }, [controls, delay]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={controls}
      style={{
        position: 'absolute',
        width: 40,
        height: 40,
        ...style,
        pointerEvents: 'none', // no interaction
        
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill={colors[Math.floor(Math.random() * colors.length)]}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="50,0 0,100 100,100" />
      </svg>
    </motion.div>
  );
}

export default function TrianglesBackground() {
  // generate random positions and delays for triangles
  const triangles = Array.from({ length: triangleCount }).map((_, i) => ({
    left: `${randomRange(5, 95)}%`,
    bottom: `${randomRange(5, 20)}%`,
    delay: i * 0.3,
    scale: randomRange(0.5, 1.2),
    rotate: randomRange(-30, 30),
  }));

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {triangles.map(({ left, bottom, delay, scale, rotate }, i) => (
        <Triangle
          key={i}
          delay={delay}
          style={{
            left,
            bottom,
            scale,
            rotate: `${rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

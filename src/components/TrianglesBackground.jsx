import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const colors = ['#ff0000', '#cc0000', '#ff3333']; // shades of red

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Single Triangle shape as SVG wrapped in motion.div
function Triangle({ style, delay, orientation = 'horizontal' }) {
  const controls = useAnimation();

  useEffect(() => {
    async function sequence() {
      // Animation based on orientation
      const animateFrom = orientation === 'horizontal' ? { x: -50, opacity: 0 } : { y: 50, opacity: 0 };
      const floatAnimation = orientation === 'horizontal' 
        ? { x: [0, -10, 0] }
        : { y: [0, -10, 0] };
      
      // Shoot in
      await controls.start({
        x: 0,
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, delay, ease: 'easeOut' },
      });
      // Float gently
      controls.start({
        ...floatAnimation,
        transition: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 4 + Math.random() * 2,
          ease: 'easeInOut',
        },
      });
    }
    sequence();
  }, [controls, delay, orientation]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={controls}
      style={{
        position: 'absolute',
        width: 40,
        height: 40,
        ...style,
        pointerEvents: 'none',
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

export default function TrianglesBackground({ 
  count = 10, 
  orientation = 'horizontal',
  height = '100%',
  spreadX = { min: 5, max: 95 },
  spreadY = { min: 5, max: 20 }
}) {
  // generate random positions and delays for triangles
  const triangles = Array.from({ length: count }).map((_, i) => {
    // For horizontal orientation, spread triangles more horizontally
    const left = orientation === 'horizontal' 
      ? `${randomRange(spreadX.min, spreadX.max)}%`
      : `${randomRange(10, 90)}%`;
    
    const position = orientation === 'horizontal'
      ? { left, top: `${randomRange(spreadY.min, spreadY.max)}%` }
      : { left, bottom: `${randomRange(spreadY.min, spreadY.max)}%` };

    return {
      ...position,
      delay: i * 0.2,
      scale: randomRange(0.5, 1.2),
      rotate: randomRange(-30, 30),
    };
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        height,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {triangles.map((pos, i) => (
        <Triangle
          key={i}
          delay={pos.delay}
          orientation={orientation}
          style={{
            ...pos,
            scale: pos.scale,
            rotate: `${pos.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

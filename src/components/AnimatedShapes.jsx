import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * Generic animated shapes component.
 * Renders floating, flying-in shapes (triangles, circles, squares, etc.) with configurable colors.
 * Uses the classic fly-in and float animation pattern from the original TrianglesBackground.
 * 
 * Props:
 *   - count: number of shapes to render (default: 12)
 *   - shape: 'triangle', 'circle', or 'square' (default: 'triangle')
 *   - color: color name like 'red', 'blue', 'yellow', or hex like '#FF0000' (default: 'red')
 *   - orientation: 'vertical' or 'horizontal' (default: 'horizontal')
 *   - height: CSS height string, e.g., '100%' or '400px' (default: '100%')
 *   - spreadX: { min, max } for horizontal spread percentage (default: { min: 0, max: 100 })
 *   - spreadY: { min, max } for vertical spread percentage (default: { min: 20, max: 80 })
 */
export default function AnimatedShapes({
  count = 12,
  shape = 'triangle',
  color = 'red',
  orientation = 'horizontal',
  height = '100%',
  spreadX = { min: 0, max: 100 },
  spreadY = { min: 20, max: 80 },
}) {
  const [shapes, setShapes] = useState([]);

  // Normalize color: if it's a name like 'red', map to hex; otherwise use as-is
  const colorMap = {
    red: '#FF6B6B',
    blue: '#4F46E5',
    yellow: '#FCD34D',
    green: '#10B981',
    purple: '#A855F7',
    pink: '#EC4899',
    cyan: '#06B6D4',
    orange: '#F97316',
  };

  const resolvedColor = colorMap[color] || color;

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    // Generate random shape positions and animations
    const generatedShapes = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${randomRange(spreadX.min, spreadX.max)}%`,
      top: `${randomRange(spreadY.min, spreadY.max)}%`,
      delay: i * 0.1,
      size: 30 + Math.random() * 20, // Random size between 30-50px
      scale: randomRange(0.5, 1.2),
      rotate: randomRange(-30, 30),
    }));
    setShapes(generatedShapes);
  }, [count, spreadX, spreadY]);

  // Single animated shape component
  function AnimatedShape({ shapeData }) {
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
          transition: { duration: 0.8, delay: shapeData.delay, ease: 'easeOut' },
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
    }, [controls, shapeData.delay, orientation]);

    // Render shape based on type
    const renderShapeContent = () => {
      const size = shapeData.size;

      switch (shape) {
        case 'triangle':
          return (
            <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.2))' }}>
              <polygon points="50,10 90,90 10,90" fill={resolvedColor} opacity="0.8" />
            </svg>
          );
        case 'circle':
          return (
            <div
              style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: resolvedColor,
                opacity: 0.8,
                boxShadow: '0 0 8px rgba(0,0,0,0.2)',
              }}
            />
          );
        case 'square':
          return (
            <div
              style={{
                width: size,
                height: size,
                backgroundColor: resolvedColor,
                opacity: 0.8,
                boxShadow: '0 0 8px rgba(0,0,0,0.2)',
              }}
            />
          );
        default:
          return null;
      }
    };

    return (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={controls}
        style={{
          position: 'absolute',
          left: shapeData.left,
          top: shapeData.top,
          scale: shapeData.scale,
          rotate: `${shapeData.rotate}deg`,
          pointerEvents: 'none',
        }}
      >
        {renderShapeContent()}
      </motion.div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      {shapes.map((s) => (
        <AnimatedShape key={s.id} shapeData={s} />
      ))}
    </div>
  );
}

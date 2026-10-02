import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

// Where the big shapes sit down the page: alternating sides, partly off the edge, each with its
// own size and parallax rate so they read as layers at different depths
const PLACEMENTS = [
  { top: '6%', side: 'right', size: 'clamp(18rem, 34vw, 34rem)', rotate: 12, drift: 70 },
  { top: '40%', side: 'left', size: 'clamp(16rem, 28vw, 28rem)', rotate: -8, drift: 40 },
  { top: '74%', side: 'right', size: 'clamp(14rem, 24vw, 24rem)', rotate: 20, drift: 90 },
];

function Outline({ shape }) {
  if (shape === 'circle') return <circle cx="50" cy="50" r="50" />;
  if (shape === 'triangle') return <polygon points="50,4 100,96 0,96" />;
  return <rect width="100" height="100" />;
}

/**
 * Large tone-on-tone shapes in the field behind a project's sections, cut from slightly lighter
 * paper than the field itself. They give the open space between sections depth without adding
 * color, and echo the page's margin shape (square, circle, or triangle).
 */
export default function FieldShapes({ shape = 'square' }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {PLACEMENTS.map((place, i) => (
        <FieldShape key={i} shape={shape} place={place} progress={scrollYProgress} still={reduceMotion} />
      ))}
    </div>
  );
}

function FieldShape({ shape, place, progress, still }) {
  const y = useTransform(progress, [0, 1], still ? [0, 0] : [place.drift, -place.drift]);
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute"
      style={{
        y,
        top: place.top,
        [place.side]: `calc(${place.size} * -0.35)`,
        width: place.size,
        height: place.size,
        rotate: `${place.rotate}deg`,
        fill: 'rgb(255 255 255 / 0.55)',
        filter: 'drop-shadow(0 18px 26px rgb(22 26 46 / 0.08))',
      }}
    >
      <Outline shape={shape} />
    </motion.svg>
  );
}

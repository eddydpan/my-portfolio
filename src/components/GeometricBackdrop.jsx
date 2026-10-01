import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

/**
 * Large primary-colored shapes that sit behind a section's content.
 * The SVG below is placeholder artwork — swap the shapes for ones exported
 * from Illustrator (keep the 1440x900 viewBox, or update it to match).
 * Each shape casts a soft shadow so it reads as cut paper lifted off the field,
 * and drifts at its own rate as the section scrolls past for parallax depth.
 */
export default function GeometricBackdrop() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const range = (distance) => (reduceMotion ? [0, 0] : [distance, -distance]);
  const farY = useTransform(scrollYProgress, [0, 1], range(25));
  const midY = useTransform(scrollYProgress, [0, 1], range(60));
  const nearY = useTransform(scrollYProgress, [0, 1], range(110));

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="backdrop-lift" x="-25%" y="-25%" width="150%" height="170%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#161A2E" floodOpacity="0.16" />
          </filter>
        </defs>

        <g filter="url(#backdrop-lift)">
          {/* Far: cobalt half disc rising from the bottom-right edge */}
          <motion.path
            style={{ y: farY }}
            d="M 1000 960 A 280 280 0 0 1 1560 960 Z"
            fill="var(--color-cobalt)"
          />
          {/* Mid: sun disc behind the portrait, so the head breaks the frame in front of it */}
          <motion.circle style={{ y: midY }} cx="1130" cy="230" r="240" fill="var(--color-sun)" />
          {/* Near: small red disc counterweighting the left side */}
          <motion.circle style={{ y: nearY }} cx="150" cy="740" r="54" fill="var(--color-signal)" />
        </g>
      </svg>
    </div>
  );
}

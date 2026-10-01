import { useRef } from 'react';
import {
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import GeometricBackdrop from './GeometricBackdrop';
import profilePicture from '../assets/typography-portrait-full.jpg';

// Layered shadows: a tight contact shadow, a mid key shadow, and a long soft ambient one
const SHEET_SHADOW = [
  '0 1px 2px rgb(22 26 46 / 0.10)',
  '0 12px 24px -8px rgb(22 26 46 / 0.20)',
  '0 36px 64px -18px rgb(22 26 46 / 0.38)',
  '0 64px 110px -40px rgb(22 26 46 / 0.30)',
].join(', ');
const UNDER_SHEET_SHADOW = [
  '0 8px 16px -6px rgb(22 26 46 / 0.22)',
  '0 28px 48px -16px rgb(22 26 46 / 0.30)',
].join(', ');

/**
 * A paper card with under-sheets that fan out from behind it once `fanned` is true.
 * `sheets` are listed back to front: { className, rotate, x, y }.
 */
function CardStack({ sheets, fanned, transition, edge, className = '', children }) {
  return (
    <div className={`relative ${className}`}>
      {sheets.map(({ className: sheetClass, rotate, x, y }) => (
        <motion.div
          key={sheetClass}
          aria-hidden="true"
          className={`absolute inset-0 ${sheetClass}`}
          style={{ boxShadow: UNDER_SHEET_SHADOW }}
          initial={false}
          animate={fanned ? { rotate, x, y } : { rotate: 0, x: 0, y: 0 }}
          transition={transition}
        />
      ))}
      <motion.div className="relative h-full" style={{ background: edge, padding: 1.5, boxShadow: SHEET_SHADOW }}>
        <div className="h-full bg-paper">{children}</div>
      </motion.div>
    </div>
  );
}

export default function AboutSection({ id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-120px' });
  const reduceMotion = useReducedMotion();
  const settle = (delay) =>
    reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay };

  // A sliver of cobalt travels around each card's hairline edge as the section scrolls by
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const shineAngle = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-60, 420]);
  const edge = useMotionTemplate`conic-gradient(from ${shineAngle}deg,
    rgb(22 26 46 / 0.12) 0deg 290deg, var(--color-cobalt) 320deg, rgb(22 26 46 / 0.12) 350deg)`;

  return (
    <section
      id={id}
      ref={ref}
      className="relative isolate overflow-hidden bg-field py-28 md:py-36"
    >
      <GeometricBackdrop />

      {/* Two stacks of unequal size: the text card leads, the portrait card sits lower and
          overlaps its right edge, as if dropped on top of it */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-start">
        <CardStack
          className="md:flex-1"
          fanned={isInView}
          transition={settle(0.1)}
          edge={edge}
          sheets={[
            { className: 'bg-cobalt', rotate: -3.5, x: -18, y: 22 },
            { className: 'bg-paper-shade', rotate: 1.75, x: 10, y: 10 },
          ]}
        >
          <div className="px-8 py-10 md:py-14 md:pl-14 md:pr-24">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-ink mb-5">About Me</h2>
            <p className="max-w-[62ch] text-base md:text-lg leading-relaxed text-ink/80">
              Welcome to my portfolio! I'm a senior at Olin College of Engineering studying Computer Science
              and Robotics. I love working on hands-on software projects and exploring a broad
              range of topics across the stack. I'm drawn to projects with clear impact, as well as
              side projects that breathe whimsy into learning. Whether I'm tackling a practical
              problem or experimenting with a new concept, I enjoy learning by building and iterating.
            </p>
          </div>
        </CardStack>

        <CardStack
          className="w-52 self-end -mt-6 mr-6 md:w-72 md:self-auto md:mt-24 md:-ml-12 md:mr-0"
          fanned={isInView}
          transition={settle(0.3)}
          edge={edge}
          sheets={[
            { className: 'bg-signal', rotate: 4, x: 16, y: 20 },
            { className: 'bg-paper-shade', rotate: -2, x: -8, y: 12 },
          ]}
        >
          {/* Multiply drops the portrait's white background into the paper; the brightness/contrast
              lift compensates for the CMYK source rendering slightly grey */}
          <img
            src={profilePicture}
            alt="Typographic line portrait of Eddy"
            className="block w-full h-auto px-5 pt-5 mix-blend-multiply brightness-[1.03] contrast-[1.05]"
          />
        </CardStack>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, animate, useReducedMotion } from 'motion/react';
import backgroundGif from '../assets/landing-background.gif';

const ROLES = ['Software Engineer', 'DevOps', 'Embedded Systems', 'Full Stack'];
const ROLE_INTERVAL_MS = 1600;
const EASE_OUT = [0.22, 1, 0.36, 1];

const entrance = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};
const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

/** One role at a time, sliding up through a clipped slot sized to the longest role. */
function RoleSwap() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), ROLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const swap = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { y: '110%' }, animate: { y: '0%' }, exit: { y: '-110%' } };

  return (
    <>
      <span className="sr-only">{ROLES.join(', ')}</span>
      <span aria-hidden="true" className="inline-grid overflow-hidden py-1">
        {/* Invisible copies reserve the width of the longest role so nothing shifts */}
        {ROLES.map((role) => (
          <span key={role} className="invisible [grid-area:1/1]">{role}</span>
        ))}
        <AnimatePresence initial={false}>
          <motion.span
            key={ROLES[index]}
            className="[grid-area:1/1]"
            {...swap}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            {ROLES[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}

export default function LandingPage() {
  const reduceMotion = useReducedMotion();

  // Glide to About Me at a deliberate pace instead of the browser's quick smooth-scroll;
  // any wheel or touch input hands control straight back to the visitor
  const glideToAbout = () => {
    const target = document.getElementById('about');
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    if (reduceMotion) {
      window.scrollTo({ top, behavior: 'instant' });
      return;
    }
    const controls = animate(window.scrollY, top, {
      duration: 1.4,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (y) => window.scrollTo({ top: y, behavior: 'instant' }),
    });
    const stop = () => controls.stop();
    window.addEventListener('wheel', stop, { once: true, passive: true });
    window.addEventListener('touchstart', stop, { once: true, passive: true });
  };

  return (
    <section className="relative isolate min-h-svh overflow-hidden">
      <img
        src={backgroundGif}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 -z-10 bg-black/60" />

      <motion.div
        variants={entrance}
        initial="hidden"
        animate="visible"
        className="flex min-h-svh flex-col items-center justify-center px-6 text-center text-white"
      >
        <motion.h1
          variants={rise}
          className="text-6xl sm:text-7xl md:text-8xl font-bold leading-none tracking-tight
            [text-shadow:0_6px_28px_rgb(0_0_0/0.45)]"
        >
          Eddy Pan
        </motion.h1>

        <motion.p variants={rise} className="mt-6 text-xl md:text-2xl text-sun">
          <RoleSwap />
        </motion.p>

        <motion.button
          variants={rise}
          type="button"
          onClick={glideToAbout}
          className="group absolute bottom-10 flex cursor-pointer flex-col items-center gap-1 rounded-md px-4 py-2
            text-white/70 transition-colors duration-300 hover:text-white
            focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun"
        >
          <span className="text-base md:text-lg tracking-wide">Learn More</span>
          {/* On hover the two chevrons cascade downward, pointing the way */}
          <svg
            className="h-12 w-12 overflow-visible"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M6 7l6 6 6-6"
              className="transition-transform duration-300 ease-out group-hover:translate-y-1 group-focus-visible:translate-y-1"
            />
            <path
              d="M6 12l6 6 6-6"
              className="transition-transform duration-300 ease-out delay-75 group-hover:translate-y-2.5 group-focus-visible:translate-y-2.5"
            />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  );
}

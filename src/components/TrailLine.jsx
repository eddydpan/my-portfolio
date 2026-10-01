import { useEffect, useRef, useState } from 'react';
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';

const MESSAGE = 'follow me!';
const START_DELAY_MS = 3000; // after the visitor reaches About Me
const DRAW_S = 8;
const TYPE_MS = 75; // per character, typing in
const UNTYPE_MS = 230; // per character, untyping once the visitor scrolls on
const FADE_S = 3;
const SCROLL_TO_DISMISS = 40; // px of fresh scrolling that starts the fade
const DASH = 16;
const GAP = 18;

/**
 * Routes in each stage's own coordinates. Desktop shares its origin with the card row
 * (1104 wide at full size, scaling down with it); mobile is a strip below the stacked cards.
 *
 * Each route: a slight rise from the middle of the left side, a ~45° slope down, a narrow
 * elliptical loop (four quarter-ellipse curves) whose exit crosses the incoming line just
 * above the trough, a small rise, then an easy drop to the bottom-center of the section.
 * `toDescent` is the same route cut off at the crest, where the character speaks.
 */
const ROUTES = {
  desktop: {
    width: 1104,
    height: 856,
    disc: { cx: -110, cy: 730, r: 81 },
    voice: { x: 480, y: 690 },
    toDescent: `M -320 360 C -250 360, -190 335, -130 335
      C -90 335, -70 355, -30 395
      C 10 435, 20 590, 75 590
      C 97.1 590, 115 563.1, 115 530
      C 115 496.9, 97.1 470, 75 470
      C 52.9 470, 35 496.9, 35 530
      C 35 575, 60 652, 110 652
      C 170 652, 230 615, 300 615`,
    descent: 'C 390 615, 500 760, 552 856',
  },
  mobile: {
    width: 342,
    height: 360,
    disc: { cx: -10, cy: 285, r: 42 },
    voice: { x: 190, y: 262 },
    toDescent: `M -40 62 C -25 62, -15 48, 0 48
      C 12 48, 18 58, 30 70
      C 45 85, 45 186, 80 186
      C 93.3 186, 104 169.9, 104 150
      C 104 130.1, 93.3 114, 80 114
      C 66.7 114, 56 130.1, 56 150
      C 56 178, 72 222, 110 222
      C 125 222, 130 214, 142 214`,
    descent: 'C 166 214, 171 270, 171 360',
  },
};

function useIsDesktop() {
  const query = '(min-width: 768px)';
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return matches;
}

/**
 * Dash pattern that shows only the first `drawn` px of a path: whole dash/gap pairs up to
 * that point, then one gap covering the rest. Unlike a reveal mask, a later stretch of trail
 * that crosses an earlier one stays hidden until the character actually gets there.
 */
function dashesUpTo(drawn, total) {
  const period = DASH + GAP;
  const whole = Math.floor(drawn / period);
  const parts = [];
  for (let i = 0; i < whole; i++) parts.push(DASH, GAP);
  parts.push(Math.min(DASH, drawn - whole * period), total);
  return parts.join(' ');
}

/**
 * A small triangle character crosses About Me on its own a few seconds after the visitor
 * arrives, leaving a dashed map trail. As it turns down toward Projects it types
 * "follow me!", which untypes and fades away once the visitor keeps scrolling.
 */
export default function TrailLine({ sectionRef }) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const route = ROUTES[isDesktop ? 'desktop' : 'mobile'];

  const pathRef = useRef(null);
  const descentRef = useRef(null);
  const characterRef = useRef(null);
  const stageRef = useRef(null);
  const progress = useMotionValue(0);

  // Desktop: "reached About Me" = the section has risen into the top 40% of the screen.
  // Mobile: the stacked cards fill the screen first, so wait until the trail's own strip is in view.
  const reachedSection = useInView(sectionRef, { margin: '0px 0px -60% 0px' });
  const reachedStage = useInView(stageRef, { amount: 0.6 });
  const reached = isDesktop ? reachedSection : reachedStage;
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!reached || started) return;
    const id = setTimeout(() => setStarted(true), START_DELAY_MS);
    return () => clearTimeout(id);
  }, [reached, started]);

  useEffect(() => {
    if (!started) return;
    const draw = animate(
      progress,
      1,
      reduceMotion ? { duration: 0 } : { duration: DRAW_S, ease: [0.45, 0, 0.4, 1] }
    );
    return () => draw.stop();
  }, [started, reduceMotion, progress]);

  // "follow me!": idle → typing → shown → fading → gone, once per visit
  const [phase, setPhase] = useState('idle');
  const [typed, setTyped] = useState(0);
  const voiceOpacity = useMotionValue(1);

  // Grow the trail and keep the character on its leading tip, pointed along it
  useMotionValueEvent(progress, 'change', (v) => {
    const path = pathRef.current;
    const character = characterRef.current;
    if (!path || !character) return;
    const total = path.getTotalLength();
    const drawn = v * total;
    path.setAttribute('stroke-dasharray', dashesUpTo(drawn, total));

    const at = Math.max(1, drawn);
    const p = path.getPointAtLength(at);
    const back = path.getPointAtLength(Math.max(0, at - 2));
    const angle = (Math.atan2(p.y - back.y, p.x - back.x) * 180) / Math.PI;
    character.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`);
    character.style.opacity = v > 0 ? '1' : '0';

    if (phase === 'idle' && drawn >= descentRef.current.getTotalLength()) setPhase('typing');
  });

  useEffect(() => {
    if (phase === 'typing') {
      if (reduceMotion) {
        setTyped(MESSAGE.length);
        setPhase('shown');
        return;
      }
      const id = setInterval(() => {
        setTyped((n) => {
          if (n + 1 >= MESSAGE.length) {
            clearInterval(id);
            setPhase('shown');
          }
          return Math.min(n + 1, MESSAGE.length);
        });
      }, TYPE_MS);
      return () => clearInterval(id);
    }

    if (phase === 'shown') {
      const startY = window.scrollY;
      const onScroll = () => {
        if (Math.abs(window.scrollY - startY) > SCROLL_TO_DISMISS) setPhase('fading');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    if (phase === 'fading') {
      const fade = animate(voiceOpacity, 0, { duration: reduceMotion ? 0.6 : FADE_S, ease: 'easeIn' });
      fade.then(() => setPhase('gone'));
      const id = reduceMotion ? null : setInterval(() => setTyped((n) => Math.max(0, n - 1)), UNTYPE_MS);
      return () => {
        fade.stop();
        clearInterval(id);
      };
    }
  }, [phase, reduceMotion, voiceOpacity]);

  const { width, height, disc, voice, toDescent, descent } = route;
  const pct = (n, of) => `${(n / of) * 100}%`;

  return (
    // Desktop: overlays the card row from its top-left corner. Mobile: a strip below the cards.
    <div
      ref={stageRef}
      className="pointer-events-none relative w-full md:absolute md:inset-x-6 md:top-0 md:w-auto"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <filter id="trail-lift" x="-50%" y="-50%" width="200%" height="220%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#161A2E" floodOpacity="0.18" />
          </filter>
        </defs>

        <circle cx={disc.cx} cy={disc.cy} r={disc.r} fill="var(--color-signal)" filter="url(#trail-lift)" />

        <path ref={descentRef} d={toDescent} fill="none" stroke="none" />
        <path
          ref={pathRef}
          d={`${toDescent} ${descent}`}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity={0.85}
          strokeWidth={5.25}
          strokeLinecap="round"
          strokeDasharray="0 100000"
        />
        <g ref={characterRef} style={{ opacity: 0, filter: 'drop-shadow(0 2px 3px rgb(22 26 46 / 0.35))' }}>
          {/* Equilateral, pointing along +x so rotation follows the trail */}
          <polygon points="12,0 -6,-10.4 -6,10.4" fill="var(--color-signal)" />
        </g>
      </svg>

      <p className="sr-only">follow me!</p>
      {phase !== 'idle' && phase !== 'gone' && (
        <motion.p
          aria-hidden="true"
          className="absolute origin-left -rotate-[25deg] whitespace-nowrap text-sm md:text-base font-bold text-ink"
          style={{ left: pct(voice.x, width), top: pct(voice.y, height), opacity: voiceOpacity }}
        >
          {MESSAGE.slice(0, typed)}
        </motion.p>
      )}
    </div>
  );
}

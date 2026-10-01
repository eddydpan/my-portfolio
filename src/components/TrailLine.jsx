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
const START_DELAY_MS = 1000; // after the visitor reaches About Me
const DRAW_S = 8;
const TYPE_MS = 75; // per character, typing in
// "follow me!" lives ~1.5s once typed: a brief hold, then it untypes while fading out
const VOICE_HOLD_MS = 400;
const UNTYPE_MS = 100; // per character
const FADE_S = 1.1;
// The trail erases only after the trail is complete AND "follow me!" has started leaving
const ERASE_DELAY_MS = 2000;
const ERASE_S = 6;
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
 * Dash pattern showing only the stretch of path between `from` and `to` px. Dashes stay
 * anchored to the path (they don't crawl as the window moves), and a later stretch of trail
 * that crosses an earlier one stays hidden until the character actually gets there.
 * Returns null when nothing is visible.
 */
function visibleDashes(from, to, total) {
  const period = DASH + GAP;
  const round = (n) => Math.round(n * 100) / 100;
  const parts = [];
  let first = null;
  let cursor = 0;
  for (let k = Math.floor(from / period); k * period < to; k++) {
    const a = Math.max(k * period, from);
    const b = Math.min(k * period + DASH, to);
    if (b <= a) continue;
    if (first === null) first = a;
    else parts.push(round(a - cursor));
    parts.push(round(b - a));
    cursor = b;
  }
  if (first === null) return null;
  // The trailing gap covers the rest; the offset starts the pattern at the first visible dash
  parts.push(round(total));
  return { dasharray: parts.join(' '), dashoffset: round(-first) };
}

/**
 * A small triangle character crosses About Me on its own a few seconds after the visitor
 * arrives, leaving a dashed map trail that wipes away from its start a few seconds after it
 * finishes. As it turns down toward Projects it briefly types "follow me!", which untypes and
 * fades away before the trail starts to disappear.
 */
export default function TrailLine({ sectionRef }) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const route = ROUTES[isDesktop ? 'desktop' : 'mobile'];

  const pathRef = useRef(null);
  const descentRef = useRef(null);
  const characterRef = useRef(null);
  const stageRef = useRef(null);
  const progress = useMotionValue(0); // how far the character has walked
  const erased = useMotionValue(0); // how much of the trail behind it has faded, from the start

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

  // Walk the route once
  const [drawDone, setDrawDone] = useState(false);
  useEffect(() => {
    if (!started) return;
    const draw = animate(
      progress,
      1,
      reduceMotion ? { duration: 0 } : { duration: DRAW_S, ease: [0.45, 0, 0.4, 1] }
    );
    draw.then(() => setDrawDone(true));
    return () => draw.stop();
  }, [started, reduceMotion, progress]);

  // "follow me!": idle → typing → shown → fading → gone, once per visit
  const [phase, setPhase] = useState('idle');
  const [typed, setTyped] = useState(0);
  const voiceOpacity = useMotionValue(1);
  const voiceLeaving = phase === 'fading' || phase === 'gone';

  // Wipe the trail away from its start, always after "follow me!" has begun to leave
  useEffect(() => {
    if (!drawDone || !voiceLeaving) return;
    let erase;
    const id = setTimeout(() => {
      erase = animate(
        erased,
        1,
        reduceMotion ? { duration: 0 } : { duration: ERASE_S, ease: [0.45, 0, 0.4, 1] }
      );
    }, ERASE_DELAY_MS);
    return () => {
      clearTimeout(id);
      erase?.stop();
    };
  }, [drawDone, voiceLeaving, reduceMotion, erased]);

  // Show the walked-but-not-yet-erased stretch, and keep the character on the leading tip
  const renderTrail = () => {
    const path = pathRef.current;
    const character = characterRef.current;
    if (!path || !character) return;
    const total = path.getTotalLength();
    const drawn = progress.get() * total;

    const dashes = visibleDashes(erased.get() * total, drawn, total);
    path.style.visibility = dashes ? 'visible' : 'hidden';
    if (dashes) {
      path.setAttribute('stroke-dasharray', dashes.dasharray);
      path.setAttribute('stroke-dashoffset', dashes.dashoffset);
    }

    const at = Math.max(1, drawn);
    const p = path.getPointAtLength(at);
    const back = path.getPointAtLength(Math.max(0, at - 2));
    const angle = (Math.atan2(p.y - back.y, p.x - back.x) * 180) / Math.PI;
    character.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`);
    character.style.opacity = drawn > 0 ? '1' : '0';
    return drawn;
  };

  useMotionValueEvent(progress, 'change', () => {
    const drawn = renderTrail();
    if (phase === 'idle' && drawn >= descentRef.current.getTotalLength()) setPhase('typing');
  });
  useMotionValueEvent(erased, 'change', renderTrail);

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
      const id = setTimeout(() => setPhase('fading'), reduceMotion ? 1500 : VOICE_HOLD_MS);
      return () => clearTimeout(id);
    }

    if (phase === 'fading') {
      const fade = animate(voiceOpacity, 0, { duration: reduceMotion ? 0.6 : FADE_S, ease: 'easeOut' });
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
          visibility="hidden"
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

import { motion, useReducedMotion } from 'motion/react';
import { ELEVATION, ELEVATION_FILTER, RESTING_SHADOW, SETTLE_EASE, UNDER_SHEET_SHADOW } from '../../lib/depth';
import { colorOf, toneOf } from './tones';

// Outlines a surface can take. `slant` is clipped, so its depth comes from a drop-shadow filter.
const SHAPES = {
  rect: {},
  arch: { borderTopLeftRadius: '50% 7rem', borderTopRightRadius: '50% 7rem' },
  circle: { borderRadius: '9999px' },
  slant: { clipPath: 'polygon(0 0, 100% 2.25rem, 100% 100%, 0 calc(100% - 2.25rem))' },
};

// Where each sheet in a stack rests, back to front, as it fans out from behind its surface
const FAN = [
  { rotate: -3, x: -14, y: 14 },
  { rotate: 2.5, x: 12, y: 10 },
  { rotate: -1.5, x: -6, y: 24 },
];

// stack="cobalt", stack={['sun', 'shade']}, or explicit sheets [{ color, rotate, x, y }]
function stackSheets(stack) {
  if (!stack) return [];
  const list = Array.isArray(stack) ? stack : [stack];
  return list.map((sheet, i) => {
    const spec = typeof sheet === 'string' ? { color: sheet } : sheet;
    return { ...FAN[i % FAN.length], ...spec, color: colorOf(spec.color) };
  });
}

/**
 * A sheet of colored paper sitting on the field: the material every project section is made
 * of. Choose its `tone`, `shape`, `elevation` (flat, raised, lifted, floating), a `stack` of
 * colored sheets fanned out behind it, and a `tilt` in degrees. With `lift`, it is the page's
 * moment of motion: it settles the last few pixels into place as it scrolls into view and its
 * stack fans out. `className` places the whole thing (grid columns); `innerClassName` styles the
 * paper itself (padding, layout).
 */
export default function Surface({
  as = 'div',
  tone = 'paper',
  shape = 'rect',
  elevation = 'raised',
  stack,
  tilt = 0,
  lift = false,
  delay = 0,
  className = '',
  innerClassName = '',
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const animate = lift && !reduceMotion;
  const outline = SHAPES[shape] ?? SHAPES.rect;
  const clipped = Boolean(outline.clipPath);
  const shadow = ELEVATION[elevation] ?? ELEVATION.raised;
  const sheets = stackSheets(stack);
  const { bg } = toneOf(tone);
  const hairline = tone === 'paper' && !clipped ? 'ring-1 ring-ink/[0.06]' : '';

  const Tag = animate ? motion[as] : as;
  const paperMotion = animate
    ? {
        initial: { boxShadow: clipped ? 'none' : RESTING_SHADOW },
        whileInView: { boxShadow: clipped ? 'none' : shadow },
        viewport: { once: true, margin: '0px 0px -10% 0px' },
        transition: { duration: 1.1, ease: SETTLE_EASE, delay },
      }
    : {};

  const paper = (
    <Tag
      className={`relative h-full ${hairline} ${innerClassName}`}
      style={{ ...outline, background: bg, boxShadow: clipped ? undefined : shadow }}
      {...paperMotion}
      {...rest}
    >
      {children}
    </Tag>
  );

  const Wrapper = animate ? motion.div : 'div';
  const wrapperMotion = animate
    ? {
        initial: { y: 18 },
        whileInView: { y: 0 },
        viewport: { once: true, margin: '0px 0px -10% 0px' },
        transition: { duration: 1.1, ease: SETTLE_EASE, delay },
      }
    : {};

  return (
    <Wrapper className={`relative ${className}`} style={tilt ? { rotate: `${tilt}deg` } : undefined} {...wrapperMotion}>
      {sheets.map(({ color, rotate, x, y }, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute inset-0"
          style={{ ...outline, background: color, boxShadow: clipped ? undefined : UNDER_SHEET_SHADOW }}
          initial={animate ? { rotate: 0, x: 0, y: 0 } : false}
          animate={animate ? undefined : { rotate, x, y }}
          whileInView={animate ? { rotate, x, y } : undefined}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.9, ease: SETTLE_EASE, delay: delay + 0.2 + i * 0.08 }}
        />
      ))}
      {clipped ? <div className="relative h-full" style={{ filter: ELEVATION_FILTER[elevation] }}>{paper}</div> : paper}
    </Wrapper>
  );
}

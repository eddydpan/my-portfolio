import { useContext } from 'react';
import { ProjectContext } from './ProjectContext';

// Exponential ease-out for the small playful moves: a sheet fanning out, a shape turning over
export const FAN_EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]';

// The page's accent color and margin shape, with defaults for use outside a project page
function usePageStyle(accent, shape) {
  const project = useContext(ProjectContext);
  return {
    accent: accent ?? project?.accent ?? 'var(--color-cobalt)',
    shape: shape ?? project?.shape ?? 'square',
  };
}

export function ArrowIcon({ direction = 'right', className = 'h-4 w-4' }) {
  const d = {
    right: 'M5 12h14m-6-6 6 6-6 6',
    left: 'M19 12H5m6-6-6 6 6 6',
    out: 'M7 17 17 7m-8 0h8v8',
  }[direction];
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}

/** One of the page's margin shapes in miniature. */
export function ShapeGlyph({ shape = 'square', color, className = 'h-3 w-3' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className={className} style={{ fill: color }}>
      {shape === 'circle' && <circle cx="6" cy="6" r="6" />}
      {shape === 'triangle' && <polygon points="6,0.5 12,11.5 0,11.5" />}
      {shape !== 'circle' && shape !== 'triangle' && <rect width="12" height="12" />}
    </svg>
  );
}

/**
 * The page's main call to action: an ink tab resting on a sheet of the accent color. On hover
 * the tab lifts and the sheet fans out from under it; pressing settles it back down.
 * Pass `href` for an external link, or `as={Link}`/`as={HashLink}` with `to` for an internal one.
 */
export function PrimaryLink({ as: Tag = 'a', accent, icon = 'out', children, className = '', ...rest }) {
  const style = usePageStyle(accent);
  const external = Tag === 'a';
  return (
    <Tag
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
      className={`group relative isolate inline-flex focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-cobalt ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-transform duration-500 ${FAN_EASE} [transform:translate(-5px,5px)_rotate(-3deg)] group-hover:[transform:translate(-10px,9px)_rotate(-6deg)] group-active:[transform:translate(-3px,3px)_rotate(-1.5deg)] group-active:duration-150 motion-reduce:transition-none`}
        style={{ background: style.accent }}
      />
      <span className="inline-flex items-center gap-2.5 bg-ink px-5 pt-3.5 pb-3 font-semibold text-paper transition-transform duration-300 ease-out group-hover:[transform:translate(2px,-2px)] group-active:[transform:none] group-active:duration-100 motion-reduce:transition-none">
        {children}
        <ArrowIcon
          direction={icon}
          className="h-4 w-4 transition-transform duration-300 group-hover:[transform:translate(2px,-2px)] motion-reduce:transition-none"
        />
      </span>
    </Tag>
  );
}

/**
 * A quieter link marked with the page's shape, which turns over when the link is hovered.
 */
export function ShapeLink({ as: Tag = 'a', accent, shape, children, className = '', ...rest }) {
  const style = usePageStyle(accent, shape);
  const external = Tag === 'a';
  return (
    <Tag
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
      className={`group inline-flex items-center gap-2.5 py-2 font-semibold text-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt ${className}`}
    >
      <ShapeGlyph
        shape={style.shape}
        color={style.accent}
        className={`h-3 w-3 shrink-0 transition-transform duration-500 ${FAN_EASE} group-hover:rotate-[135deg] group-hover:scale-125 motion-reduce:transition-none`}
      />
      <span className="underline decoration-ink/25 decoration-[1.5px] underline-offset-4 transition-[text-decoration-color] group-hover:decoration-ink">
        {children}
      </span>
    </Tag>
  );
}
